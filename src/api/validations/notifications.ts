import { z } from 'zod';

export const notificationsSchema = z.object({
  body: z.object({
    teacher: z.string().email('Invalid teacher email format'),
    notification: z.string().min(1, 'Notification cannot be empty'),
  }),
});

export type NotificationsRequest = z.infer<typeof notificationsSchema>['body'];