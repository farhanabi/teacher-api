import { db } from ".";
import type { Registration } from "../types";
import { logger } from "../utils/logger";
import { registrations, students, teachers } from "./schema";

/**
 * Seed the database with initial data for testing/development
 */
async function seed() {
	logger.info("Starting database seed...");

	try {
		// Create teachers
		const teacherData = [
			{ email: "teacherken@gmail.com" },
			{ email: "teacherjoe@gmail.com" },
			{ email: "teachersmith@gmail.com" },
		];
		logger.info(`Seeding ${teacherData.length} teachers...`);
		await db.insert(teachers).values(teacherData);

		// Create students
		const studentData = [
			{ email: "commonstudent1@gmail.com", suspended: false },
			{ email: "commonstudent2@gmail.com", suspended: false },
			{ email: "student_only_under_teacher_ken@gmail.com", suspended: false },
			{ email: "studentagnes@gmail.com", suspended: false },
			{ email: "studentmiche@gmail.com", suspended: false },
			{ email: "studentbob@gmail.com", suspended: false },
			{ email: "studentmary@gmail.com", suspended: false },
			{ email: "studentsuspended@gmail.com", suspended: true },
		];
		logger.info(`Seeding ${studentData.length} students...`);
		await db.insert(students).values(studentData);

		// Get IDs for registration mappings
		const teachersList = await db.select().from(teachers);
		const studentsList = await db.select().from(students);

		const teacherMap = new Map(
			teachersList.map((teacher) => [teacher.email, teacher.id]),
		);
		const studentMap = new Map(
			studentsList.map((student) => [student.email, student.id]),
		);

		// Create registrations
		const registrationData = [
			// Teacher Ken's students
			{
				teacherId: teacherMap.get("teacherken@gmail.com"),
				studentId: studentMap.get("commonstudent1@gmail.com"),
			},
			{
				teacherId: teacherMap.get("teacherken@gmail.com"),
				studentId: studentMap.get("commonstudent2@gmail.com"),
			},
			{
				teacherId: teacherMap.get("teacherken@gmail.com"),
				studentId: studentMap.get("student_only_under_teacher_ken@gmail.com"),
			},
			{
				teacherId: teacherMap.get("teacherken@gmail.com"),
				studentId: studentMap.get("studentbob@gmail.com"),
			},

			// Teacher Joe's students
			{
				teacherId: teacherMap.get("teacherjoe@gmail.com"),
				studentId: studentMap.get("commonstudent1@gmail.com"),
			},
			{
				teacherId: teacherMap.get("teacherjoe@gmail.com"),
				studentId: studentMap.get("commonstudent2@gmail.com"),
			},

			// Teacher Smith's students
			{
				teacherId: teacherMap.get("teachersmith@gmail.com"),
				studentId: studentMap.get("studentagnes@gmail.com"),
			},
			{
				teacherId: teacherMap.get("teachersmith@gmail.com"),
				studentId: studentMap.get("studentmiche@gmail.com"),
			},
		];

		logger.info(`Seeding ${registrationData.length} registrations...`);

		// Filter out any undefined values that might have occurred
		const validRegistrations = registrationData.filter(
			(reg) => reg.teacherId !== undefined && reg.studentId !== undefined,
		) as Registration[];

		if (validRegistrations.length !== registrationData.length) {
			logger.warn(
				"Some registrations were skipped due to missing teacher or student IDs",
			);
		}

		await db.insert(registrations).values(validRegistrations);

		logger.info("Database seed completed successfully!");
	} catch (error) {
		logger.error("Error seeding database:", error);
		throw error;
	}
}

// ES modules version of "if this file is run directly"
// This will be true when the file is executed directly with node
// but false when imported as a module
if (import.meta.url === import.meta.resolve("./seed.js")) {
	seed()
		.then(() => {
			process.exit(0);
		})
		.catch((error) => {
			console.error("Seed failed:", error);
			process.exit(1);
		});
}

export default seed;
