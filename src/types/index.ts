/**
 * Database entity interfaces
 */

export interface Teacher {
	id: number;
	email: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Student {
	id: number;
	email: string;
	suspended: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface Registration {
	teacherId: number;
	studentId: number;
	createdAt: Date;
}

/**
 * API Request/Response interfaces
 */

// Register endpoint
export interface RegisterRequest {
	teacher: string;
	students: string[];
}

// Common students endpoint
export interface CommonStudentsQuery {
	teacher: string | string[];
}

export interface CommonStudentsResponse {
	students: string[];
}

// Suspend endpoint
export interface SuspendRequest {
	student: string;
}

// Notifications endpoint
export interface NotificationsRequest {
	teacher: string;
	notification: string;
}

export interface NotificationsResponse {
	recipients: string[];
}

/**
 * Error interfaces
 */
export interface ApiErrorResponse {
	message: string;
}

/**
 * Service interfaces
 */
export interface TeacherService {
	findOrCreateTeacher(email: string): Promise<Teacher>;
	findOrCreateStudent(email: string): Promise<Student>;
	registerStudentsToTeacher(
		teacherEmail: string,
		studentEmails: string[],
	): Promise<void>;
	getCommonStudents(teacherEmails: string[]): Promise<string[]>;
}

export interface StudentService {
	suspendStudent(email: string): Promise<void>;
}

export interface NotificationService {
	getNotificationRecipients(
		teacherEmail: string,
		notification: string,
	): Promise<string[]>;
}
