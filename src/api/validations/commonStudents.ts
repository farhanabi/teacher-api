import { z } from 'zod';

export const commonStudentsSchema = z.object({
  query: z.object({
    teacher: z.union([
      z.string().email('Invalid teacher email format'),
      z.array(z.string().email('Invalid teacher email format')),
    ]),
  }),
});

export type CommonStudentsRequest = z.infer<typeof commonStudentsSchema>['query'];