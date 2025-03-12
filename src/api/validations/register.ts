import { z } from "zod";

export const registerSchema = z.object({
	body: z.object({
		teacher: z.string().email("Invalid teacher email format"),
		students: z
			.array(z.string().email("Invalid student email format"))
			.min(1, "At least one student must be provided"),
	}),
});

export type RegisterRequest = z.infer<typeof registerSchema>["body"];
