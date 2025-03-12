import { db } from '../db/index.js';
import { teachers, students, registrations } from '../db/schema.js';
import { eq, and, inArray } from 'drizzle-orm';

export const findOrCreateTeacher = async (email: string) => {
  const existingTeachers = await db.select().from(teachers).where(eq(teachers.email, email));
  
  if (existingTeachers.length > 0) {
    return existingTeachers[0]!;
  }
  
  await db.insert(teachers).values({ email });

  const newTeacher = await db.select().from(teachers).where(eq(teachers.email, email));
  return newTeacher[0]!;
};

export const findOrCreateStudent = async (email: string) => {
  const existingStudents = await db.select().from(students).where(eq(students.email, email));
  
  if (existingStudents.length > 0) {
    return existingStudents[0]!;
  }
  
  await db.insert(students).values({ email })

  const newStudent = await db.select().from(students).where(eq(students.email, email));
  return newStudent[0]!;
};

export const registerStudentsToTeacher = async (teacherEmail: string, studentEmails: string[]) => {
  const teacher = await findOrCreateTeacher(teacherEmail);
  
  for (const studentEmail of studentEmails) {
    const student = await findOrCreateStudent(studentEmail);
    
    const existingRegistrations = await db
      .select()
      .from(registrations)
      .where(
        and(
          eq(registrations.teacherId, teacher.id),
          eq(registrations.studentId, student.id)
        )
      );
    
    if (existingRegistrations.length === 0) {
      await db.insert(registrations).values({
        teacherId: teacher.id,
        studentId: student.id,
      });
    }
  }
};

export const getCommonStudents = async (teacherEmails: string[]) => {
  const teacherIds = await Promise.all(
    teacherEmails.map(async (email) => {
      const teacher = await db.select().from(teachers).where(eq(teachers.email, email)).limit(1);
      if (teacher.length === 0) {
        throw new Error(`Teacher ${email} not found`);
      }
      return teacher[0]!.id;
    })
  );

  if (teacherIds.length === 1) {
    const registeredStudents = await db
      .select({
        email: students.email,
      })
      .from(students)
      .innerJoin(
        registrations,
        eq(students.id, registrations.studentId)
      )
      .where(eq(registrations.teacherId, teacherIds[0]!));
    
    return registeredStudents.map(s => s.email);
  }

  const commonStudentEmails = await db.transaction(async (tx) => {
    const firstTeacherStudentIds = await tx
      .select({ studentId: registrations.studentId })
      .from(registrations)
      .where(eq(registrations.teacherId, teacherIds[0]!));
    
    let filteredStudentIds = firstTeacherStudentIds.map(s => s.studentId);
    
    for (let i = 1; i < teacherIds.length; i++) {
      const teacherId = teacherIds[i]!;
      
      const registeredToTeacher = await tx
        .select({ studentId: registrations.studentId })
        .from(registrations)
        .where(eq(registrations.teacherId, teacherId));
      
      const registeredIds = new Set(registeredToTeacher.map(r => r.studentId));
      
      filteredStudentIds = filteredStudentIds.filter(id => registeredIds.has(id));
    }
    
    const commonStudents = await Promise.all(
      filteredStudentIds.map(async (id) => {
        const student = await tx
          .select({ email: students.email })
          .from(students)
          .where(eq(students.id, id));
        
        return student[0]!.email;
      })
    );
    
    return commonStudents;
  });
  
  return commonStudentEmails;
};