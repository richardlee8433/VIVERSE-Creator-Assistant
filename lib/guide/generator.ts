import type { CreatorProfileId, Guide, OnboardingAnswers, PathId, RecommendedGuide } from '@/lib/session/types';
import { parseGuideFromLLM } from '@/lib/guide/formatter';
import { buildFallbackGuide } from '@/lib/guide/fallback';
import { generateJsonWithOpenAI } from '@/lib/llm/client';
import { buildGuidePrompt, ONBOARDING_SYSTEM_PROMPT } from '@/lib/llm/prompts';

export async function generateGuide(input: {
  answers: OnboardingAnswers;
  profile: CreatorProfileId;
  path: PathId;
  docs: RecommendedGuide[];
}): Promise<Guide> {
  try {
    const raw = await generateJsonWithOpenAI(
      ONBOARDING_SYSTEM_PROMPT,
      buildGuidePrompt(input),
    );
    return parseGuideFromLLM(raw);
  } catch {
    return buildFallbackGuide(input.answers, input.path, input.docs);
  }
}
