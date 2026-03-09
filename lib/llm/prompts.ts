import type { CreatorProfileId, OnboardingAnswers, PathId, RecommendedGuide } from '@/lib/session/types';

export const ONBOARDING_SYSTEM_PROMPT = `You are an onboarding assistant for VIVERSE creators.
Only use the supplied structured context.
Do not invent unsupported capabilities.
Recommend the shortest practical starting path.
Keep language simple.
Return valid JSON only.`;

export function buildGuidePrompt(input: {
  answers: OnboardingAnswers;
  profile: CreatorProfileId;
  path: PathId;
  docs: RecommendedGuide[];
}): string {
  return JSON.stringify(
    {
      task: 'Generate a personalized quick-start guide in strict JSON format',
      outputSchema: {
        headline: 'string',
        why: 'string',
        firstSteps: ['string', 'string', 'string'],
        pitfalls: ['string (1-3 items)'],
      },
      context: input,
      constraints: [
        'Concise onboarding coach tone',
        'No invented product features',
        'FirstSteps exactly 3 items',
        'Pitfalls between 1 and 3 items',
      ],
    },
    null,
    2,
  );
}
