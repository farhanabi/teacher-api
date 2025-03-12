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