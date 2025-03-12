import { z } from 'zod';

export const registerSchema = z.object({
  teacher: z.string().email(),
  students: z.array(z.string().email()),
});

export type RegisterRequest = z.infer<typeof registerSchema>;