import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { setupTestDb, teardownTestDb } from './helpers/db.js';
import { db } from '../src/db/index.js';
import { students } from '../src/db/schema.js';
import { eq, or } from 'drizzle-orm';

describe('POST /api/suspend', () => {
  let testData;
  let studentEmails: string[];
  
  beforeAll(async () => {
    const result = await setupTestDb();
    testData = result;
    
    const allStudents = await db
      .select()
      .from(students)
      .where(
        or(
          eq(students.id, testData.students[0]!.id),
          eq(students.id, testData.students[1]!.id)
        )!
      );
      
    studentEmails = allStudents.map(s => s.email);
  });
  
  afterAll(async () => {
    await teardownTestDb();
  });
  
  it('should suspend a student', async () => {
    const studentEmail = studentEmails[0]!;
    
    const initialStudent = await db.select().from(students).where(eq(students.email, studentEmail));
    expect(initialStudent[0]!.suspended).toBe(false);
    
    const res = await request(app)
      .post('/api/suspend')
      .send({
        student: studentEmail
      });
    
    expect(res.status).toBe(204);
    
    const updatedStudent = await db.select().from(students).where(eq(students.email, studentEmail));
    expect(updatedStudent[0]!.suspended).toBe(true);
  });
  
  it('should return 400 when student does not exist', async () => {
    const res = await request(app)
      .post('/api/suspend')
      .send({
        student: 'nonexistent@example.com'
      });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
  
  it('should return 400 with invalid email', async () => {
    const res = await request(app)
      .post('/api/suspend')
      .send({
        student: 'invalid-email'
      });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});