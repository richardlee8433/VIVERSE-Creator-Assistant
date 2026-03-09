import { z } from 'zod';

export const analyticsEventSchema = z.object({
  eventName: z.enum([
    'landing_viewed',
    'onboarding_started',
    'question_answered',
    'onboarding_completed',
    'recommendation_viewed',
    'guide_clicked',
    'followup_question_submitted',
    'followup_answer_returned',
  ]),
  sessionId: z.string().min(1).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
