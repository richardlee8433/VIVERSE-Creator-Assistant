import { z } from 'zod';
import {
  ASSETS,
  BIGGEST_CONCERNS,
  EXPERIENCES,
  FIRST_PROJECT_GOALS,
  GOALS,
  WORKFLOWS,
} from '@/lib/session/types';

export const onboardingAnswersSchema = z.object({
  goal: z.enum(GOALS),
  experience: z.enum(EXPERIENCES),
  workflow: z.enum(WORKFLOWS),
  assets: z.enum(ASSETS),
  first_project_goal: z.enum(FIRST_PROJECT_GOALS),
  biggest_concern: z.enum(BIGGEST_CONCERNS),
});

export const onboardingSubmitSchema = z.object({
  answers: onboardingAnswersSchema,
});

export type OnboardingSubmitInput = z.infer<typeof onboardingSubmitSchema>;
