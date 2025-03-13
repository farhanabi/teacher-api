import { eq, or } from "drizzle-orm";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "../src/app";
import { db } from "../src/db";
import { students } from "../src/db/schema";
import type { Student, Teacher } from "../src/types";
import { setupTestDb, teardownTestDb } from "./helpers/db";

describe("POST /api/suspend", () => {
	let testData: {
		students: Student[];
		teachers: Teacher[];
	};
	let studentEmails: string[];

	beforeAll(async () => {
		const result = await setupTestDb();
		testData = result;

		const allStudents = await db
			.select()
			.from(students)
			.where(
				or(
					eq(students.id, testData.students[0]?.id as number),
					eq(students.id, testData.students[1]?.id as number),
				),
			);

		studentEmails = allStudents.map((s) => s.email);
	});

	afterAll(async () => {
		await teardownTestDb();
	});

	it("should suspend a student", async () => {
		const studentEmail = studentEmails[0] as string;

		const initialStudent = await db
			.select()
			.from(students)
			.where(eq(students.email, studentEmail));
		expect(initialStudent[0]?.suspended).toBe(false);

		const res = await request(app).post("/api/suspend").send({
			student: studentEmail,
		});

		expect(res.status).toBe(204);

		const updatedStudent = await db
			.select()
			.from(students)
			.where(eq(students.email, studentEmail));
		expect(updatedStudent[0]?.suspended).toBe(true);
	});

	it("should return 400 when student does not exist", async () => {
		const res = await request(app).post("/api/suspend").send({
			student: "nonexistent@example.com",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("message");
	});

	it("should return 400 with invalid email", async () => {
		const res = await request(app).post("/api/suspend").send({
			student: "invalid-email",
		});

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("message");
	});
});
