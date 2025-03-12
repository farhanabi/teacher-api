import { and, eq, inArray } from "drizzle-orm";
import { db } from "../db/index.js";
import { registrations, students, teachers } from "../db/schema.js";

export const getNotificationRecipients = async (
	teacherEmail: string,
	notification: string,
) => {
	const mentionedStudentEmails = extractMentionedEmails(notification);

	const teacher = await db
		.select()
		.from(teachers)
		.where(eq(teachers.email, teacherEmail))
		.limit(1);

	if (teacher.length === 0) {
		throw new Error(`Teacher ${teacherEmail} not found`);
	}

	const registeredStudents = await db
		.select({
			email: students.email,
		})
		.from(students)
		.innerJoin(registrations, eq(students.id, registrations.studentId))
		.where(
			and(
				eq(registrations.teacherId, teacher[0]?.id as number),
				eq(students.suspended, false),
			),
		);

	const registeredStudentEmails = registeredStudents.map((s) => s.email);

	let mentionedNonSuspendedStudents: string[] = [];

	if (mentionedStudentEmails.length > 0) {
		const mentionedStudents = await db
			.select({
				email: students.email,
			})
			.from(students)
			.where(
				and(
					inArray(students.email, mentionedStudentEmails),
					eq(students.suspended, false),
				),
			);

		mentionedNonSuspendedStudents = mentionedStudents.map((s) => s.email);
	}

	const allRecipients = [
		...new Set([...registeredStudentEmails, ...mentionedNonSuspendedStudents]),
	];

	return allRecipients;
};

function extractMentionedEmails(notification: string): string[] {
	const mentionRegex = /@([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
	const matches = notification.match(mentionRegex) || [];

	return matches.map((match) => match.substring(1));
}
