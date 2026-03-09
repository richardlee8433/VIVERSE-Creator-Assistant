import type { Guide, OnboardingAnswers, PathId, RecommendedGuide } from '@/lib/session/types';

export function buildFallbackGuide(
  answers: OnboardingAnswers,
  path: PathId,
  docs: RecommendedGuide[],
): Guide {
  const mainDoc = docs[0];
  return {
    headline: `Start your ${path.replaceAll('_', ' ')} today`,
    why: `Based on your ${answers.experience} experience and ${answers.goal} goal, this path gives the shortest route to a first result.`,
    firstSteps: [
      `Read ${mainDoc?.title ?? 'the intro guide'} and note the minimum setup requirements.`,
      `Complete one small build milestone focused on ${answers.first_project_goal}.`,
      'Publish a simple demo and collect feedback before expanding scope.',
    ],
    pitfalls: [
      'Trying to solve advanced optimization before finishing a working first version.',
      'Skipping setup validation steps, which often causes avoidable build issues.',
    ],
  };
}
