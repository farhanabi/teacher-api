import { z } from 'zod';

export const suspendSchema = z.object({
  student: z.string().email(),
});

export type SuspendRequest = z.infer<typeof suspendSchema>;