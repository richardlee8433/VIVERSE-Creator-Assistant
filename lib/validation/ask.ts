import { z } from 'zod';

export const askSchema = z.object({
  sessionId: z.string().min(1),
  question: z.string().min(3).max(1000),
});

export type AskInput = z.infer<typeof askSchema>;
