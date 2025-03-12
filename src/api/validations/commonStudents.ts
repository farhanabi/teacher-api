import { z } from 'zod';

export const commonStudentsSchema = z.object({
  teacher: z.union([z.string().email(), z.array(z.string().email())]),
});

export type CommonStudentsRequest = z.infer<typeof commonStudentsSchema>;