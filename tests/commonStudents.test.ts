import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { setupTestDb, teardownTestDb } from './helpers/db.js';
import { db } from '../src/db/index.js';
import { teachers } from '../src/db/schema.js';
import { eq, or } from 'drizzle-orm';

describe('GET /api/commonstudents', () => {
  let testData;
  let teacherEmails: string[];
  
  beforeAll(async () => {
    const result = await setupTestDb();
    testData = result;
    
    const allTeachers = await db
      .select()
      .from(teachers)
      .where(
        or(
          eq(teachers.id, testData.teachers[0]!.id),
          eq(teachers.id, testData.teachers[1]!.id)
        )
      );
      
    teacherEmails = allTeachers.map(t => t.email);
  });
  
  afterAll(async () => {
    await teardownTestDb();
  });
  
  it('should return students registered to a single teacher', async () => {
    const res = await request(app)
      .get('/api/commonstudents')
      .query({ teacher: teacherEmails[0] });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('students');
    expect(res.body.students).toBeInstanceOf(Array);
    expect(res.body.students.length).toBeGreaterThanOrEqual(1);
  });
  
  it('should return common students for multiple teachers', async () => {
    const res = await request(app)
      .get('/api/commonstudents')
      .query({ teacher: [teacherEmails[0], teacherEmails[1]] });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('students');
    expect(res.body.students).toBeInstanceOf(Array);
    // We expect at least one common student
    expect(res.body.students.length).toBeGreaterThanOrEqual(1);
  });
  
  it('should return 400 when teacher does not exist', async () => {
    const res = await request(app)
      .get('/api/commonstudents')
      .query({ teacher: 'nonexistent@example.com' });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});