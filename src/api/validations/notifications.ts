import { z } from 'zod';

export const notificationsSchema = z.object({
  teacher: z.string().email(),
  notification: z.string(),
});

export type NotificationsRequest = z.infer<typeof notificationsSchema>;