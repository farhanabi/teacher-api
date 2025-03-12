import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { setupTestDb, teardownTestDb } from './helpers/db.js';
import { db } from '../src/db/index.js';
import { teachers, students } from '../src/db/schema.js';
import { eq, or } from 'drizzle-orm';

describe('POST /api/retrievefornotifications', () => {
  let testData;
  let teacherEmails: string[];
  let studentEmails: string[];
  
  beforeAll(async () => {
    const result = await setupTestDb();
    testData = result;
    
    const allTeachers = await db
      .select()
      .from(teachers)
      .where(eq(teachers.id, testData.teachers[0]!.id));
      
    teacherEmails = allTeachers.map(t => t.email);
    
    const allStudents = await db
      .select()
      .from(students)
      .where(
        or(
          eq(students.id, testData.students[0]!.id),
          eq(students.id, testData.students[1]!.id),
          eq(students.id, testData.students[2]!.id)
        )
      );
      
    studentEmails = allStudents.map(s => s.email);
  });
  
  afterAll(async () => {
    await teardownTestDb();
  });
  
  it('should retrieve registered students who are not suspended', async () => {
    const res = await request(app)
      .post('/api/retrievefornotifications')
      .send({
        teacher: teacherEmails[0],
        notification: 'Hello students!'
      });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('recipients');
    expect(res.body.recipients).toBeInstanceOf(Array);
    expect(res.body.recipients.length).toBeGreaterThanOrEqual(1);
  });
  
  it('should retrieve mentioned students who are not suspended', async () => {
    const nonSuspendedStudent = await db
      .select()
      .from(students)
      .where(eq(students.suspended, false))
      .limit(1);
      
    const studentEmail = nonSuspendedStudent[0]!.email;
    
    const res = await request(app)
      .post('/api/retrievefornotifications')
      .send({
        teacher: teacherEmails[0],
        notification: `Hello @${studentEmail}!`
      });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('recipients');
    expect(res.body.recipients).toBeInstanceOf(Array);
    expect(res.body.recipients.includes(studentEmail)).toBe(true);
  });
  
  it('should not include suspended students', async () => {
    let suspendedStudent = await db
      .select()
      .from(students)
      .where(eq(students.suspended, true))
      .limit(1);

    if (suspendedStudent.length === 0) {
      const studentToSuspend = await db
        .select()
        .from(students)
        .limit(1);
        
      await db
        .update(students)
        .set({ suspended: true })
        .where(eq(students.id, studentToSuspend[0]!.id));
      
      const fetchedStudent = await db
        .select()
        .from(students)
        .where(eq(students.id, studentToSuspend[0]!.id))
        .limit(1);
      
      suspendedStudent = [fetchedStudent[0]!];
    }
      
    const suspendedEmail = suspendedStudent[0]!.email;
    
    const res = await request(app)
      .post('/api/retrievefornotifications')
      .send({
        teacher: teacherEmails[0],
        notification: `Hello @${suspendedEmail}!`
      });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('recipients');
    expect(res.body.recipients).toBeInstanceOf(Array);
    expect(res.body.recipients.includes(suspendedEmail)).toBe(false);
  });
  
  it('should return 400 when teacher does not exist', async () => {
    const res = await request(app)
      .post('/api/retrievefornotifications')
      .send({
        teacher: 'nonexistent@example.com',
        notification: 'Hello students!'
      });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});