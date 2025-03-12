import { relations } from "drizzle-orm";
import {
	boolean,
	int,
	mysqlTable,
	primaryKey,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";

export const teachers = mysqlTable("teachers", {
	id: int("id").primaryKey().autoincrement(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const teachersRelations = relations(teachers, ({ many }) => ({
	registrations: many(registrations),
}));

export const students = mysqlTable("students", {
	id: int("id").primaryKey().autoincrement(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	suspended: boolean("suspended").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const studentsRelations = relations(students, ({ many }) => ({
	registrations: many(registrations),
}));

export const registrations = mysqlTable(
	"registrations",
	{
		teacherId: int("teacher_id").notNull(),
		studentId: int("student_id").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.teacherId, table.studentId] }),
	}),
);

export const registrationsRelations = relations(registrations, ({ one }) => ({
	teacher: one(teachers, {
		fields: [registrations.teacherId],
		references: [teachers.id],
	}),
	student: one(students, {
		fields: [registrations.studentId],
		references: [students.id],
	}),
}));
