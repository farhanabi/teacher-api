import { and, eq } from "drizzle-orm";
import request from "supertest";
import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
} from "vitest";
import app from "../src/app.js";
import { db } from "../src/db/index.js";
import { registrations, students, teachers } from "../src/db/schema.js";
import { logger } from "../src/utils/logger.js";

describe("POST /api/register", () => {
	const testResources: { teacherEmails: string[]; studentEmails: string[] } = {
		teacherEmails: [],
		studentEmails: [],
	};

	afterEach(async () => {
		for (const teacherEmail of testResources.teacherEmails) {
			const teacherRecord = await db
				.select()
				.from(teachers)
				.where(eq(teachers.email, teacherEmail));
			if (teacherRecord.length > 0) {
				const teacherId = teacherRecord[0]?.id as number;
				await db
					.delete(registrations)
					.where(eq(registrations.teacherId, teacherId));
				await db.delete(teachers).where(eq(teachers.id, teacherId));
			}
		}

		for (const studentEmail of testResources.studentEmails) {
			const studentRecord = await db
				.select()
				.from(students)
				.where(eq(students.email, studentEmail));
			if (studentRecord.length > 0) {
				const studentId = studentRecord[0]?.id as number;
				await db
					.delete(registrations)
					.where(eq(registrations.studentId, studentId));
				await db.delete(students).where(eq(students.id, studentId));
			}
		}

		// Reset the tracking arrays
		testResources.teacherEmails = [];
		testResources.studentEmails = [];
	});

	it("should register students to a teacher", async () => {
		const timestamp = Date.now();
		const testTeacherEmail = `teacher-reg-${timestamp}@example.com`;
		const testStudentEmails = [
			`student-reg1-${timestamp}@example.com`,
			`student-reg2-${timestamp}@example.com`,
		];

		testResources.teacherEmails.push(testTeacherEmail);
		testResources.studentEmails.push(...testStudentEmails);

		logger.info(`Testing with teacher: ${testTeacherEmail}`);
		logger.info(`Testing with students: ${testStudentEmails.join(", ")}`);

		const res = await request(app).post("/api/register").send({
			teacher: testTeacherEmail,
			students: testStudentEmails,
		});

		expect(res.status).toBe(204);

		const teacher = await db
			.select()
			.from(teachers)
			.where(eq(teachers.email, testTeacherEmail));
		expect(teacher.length).toBe(1);

		for (const studentEmail of testStudentEmails) {
			const student = await db
				.select()
				.from(students)
				.where(eq(students.email, studentEmail));
			expect(student.length).toBe(1);

			const registrationResults = await db
				.select()
				.from(registrations)
				.where(
					and(
						eq(registrations.teacherId, teacher[0]?.id as number),
						eq(registrations.studentId, student[0]?.id as number),
					),
				);

			if (registrationResults.length !== 1) {
				const allRegs = await db.select().from(registrations);
				logger.info(`All registrations: ${JSON.stringify(allRegs)}`);
			}

			expect(registrationResults.length).toBe(1);
		}
	});

	it("should return 400 with invalid emails", async () => {
		const res = await request(app)
			.post("/api/register")
			.send({
				teacher: "invalid-email",
				students: ["student1@example.com"],
			});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("message");
	});
});
