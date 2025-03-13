import { eq } from "drizzle-orm";
import { db } from "../db";
import { students } from "../db/schema";

export const suspendStudent = async (email: string) => {
	const existingStudents = await db
		.select()
		.from(students)
		.where(eq(students.email, email));

	if (existingStudents.length === 0) {
		throw new Error(`Student ${email} not found`);
	}

	await db
		.update(students)
		.set({ suspended: true })
		.where(eq(students.email, email));
};
