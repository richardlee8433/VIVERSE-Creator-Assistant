import { z } from 'zod';

export const guideSchema = z.object({
  headline: z.string().min(1),
  why: z.string().min(1),
  firstSteps: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]),
  pitfalls: z.array(z.string().min(1)).min(1).max(3),
});

export type GuideShape = z.infer<typeof guideSchema>;

export function parseGuideFromLLM(raw: string): GuideShape {
  return guideSchema.parse(JSON.parse(raw));
}
