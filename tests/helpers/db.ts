import { db } from '../../src/db/index.js';
import { teachers, students, registrations } from '../../src/db/schema.js';
import { eq, or } from 'drizzle-orm';

// Generate a unique suffix for test data to avoid conflicts when running tests in parallel
const uniqueSuffix = Math.random().toString(36).substring(2, 10);

export const getTestData = () => {
  return {
    teachers: [
      { email: `teacher1-${uniqueSuffix}@example.com` },
      { email: `teacher2-${uniqueSuffix}@example.com` },
    ],
    students: [
      { email: `student1-${uniqueSuffix}@example.com`, suspended: false },
      { email: `student2-${uniqueSuffix}@example.com`, suspended: false },
      { email: `student3-${uniqueSuffix}@example.com`, suspended: true },
    ]
  };
};

export const setupTestDb = async () => {
  await teardownTestDb();
  
  const testData = getTestData();
  
  await db.insert(teachers).values(testData.teachers);
  await db.insert(students).values(testData.students);
  
  const teachersData = await db.select().from(teachers)
    .where(
      or(
        eq(teachers.email, testData.teachers[0]!.email),
        eq(teachers.email, testData.teachers[1]!.email)
      )
    )
    
  const studentsData = await db.select().from(students)
    .where(
      or(
        eq(students.email, testData.students[0]!.email), 
        eq(students.email, testData.students[1]!.email),
        eq(students.email, testData.students[2]!.email)
      )
    );
  
  await db.insert(registrations).values([
    { 
      teacherId: teachersData[0]!.id, 
      studentId: studentsData[0]!.id 
    },
    { 
      teacherId: teachersData[0]!.id, 
      studentId: studentsData[1]!.id 
    },
    { 
      teacherId: teachersData[1]!.id, 
      studentId: studentsData[0]!.id 
    },
  ]);
  
  return {
    teachers: teachersData,
    students: studentsData
  };
};

export const teardownTestDb = async () => {
  await db.delete(registrations);
  
  const testTeachers = await db
    .select()
    .from(teachers)
    .where(
      or(
        eq(teachers.email, `teacher1-${uniqueSuffix}@example.com`),
        eq(teachers.email, `teacher2-${uniqueSuffix}@example.com`)
      )
    );
    
  for (const teacher of testTeachers) {
    await db.delete(registrations).where(eq(registrations.teacherId, teacher.id));
  }
  
  const testStudents = await db
    .select()
    .from(students)
    .where(
      or(
        eq(students.email, `student1-${uniqueSuffix}@example.com`),
        eq(students.email, `student2-${uniqueSuffix}@example.com`),
        eq(students.email, `student3-${uniqueSuffix}@example.com`)
      )
    );
    
  for (const student of testStudents) {
    await db.delete(registrations).where(eq(registrations.studentId, student.id));
  }
  
  await db.delete(teachers)
    .where(
      or(
        eq(teachers.email, `teacher1-${uniqueSuffix}@example.com`),
        eq(teachers.email, `teacher2-${uniqueSuffix}@example.com`)
      )
    );
    
  await db.delete(students)
    .where(
      or(
        eq(students.email, `student1-${uniqueSuffix}@example.com`),
        eq(students.email, `student2-${uniqueSuffix}@example.com`),
        eq(students.email, `student3-${uniqueSuffix}@example.com`)
      )
    );
};