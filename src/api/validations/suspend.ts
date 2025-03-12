import { z } from 'zod';

export const suspendSchema = z.object({
  body: z.object({
    student: z.string().email('Invalid student email format'),
  }),
});

export type SuspendRequest = z.infer<typeof suspendSchema>['body'];