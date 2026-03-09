import type { CreatorProfileId, OnboardingAnswers } from '@/lib/session/types';
import { PROFILE_ORDER_SIMPLER_TO_COMPLEX } from '@/lib/classifier/profiles';
import { scoreProfile, type ProfileScoreBreakdown } from '@/lib/classifier/rules';

type ClassificationResult = {
  profile: CreatorProfileId;
  confidence: number;
  breakdown: ProfileScoreBreakdown[];
};

const EXPERIENCE_PRIORITY: Record<string, CreatorProfileId[]> = {
  none: ['beginner_creator'],
  '3d_tools': ['three_d_creator'],
  playcanvas: ['interactive_builder'],
  web_development: ['web_engine_developer'],
  unity_unreal: ['web_engine_developer'],
};

const GOAL_PRIORITY: Record<string, CreatorProfileId[]> = {
  interactive_experience: ['interactive_builder'],
  publish_existing_app: ['web_engine_developer'],
  '3d_world': ['three_d_creator'],
  exploring: ['beginner_creator'],
};

const ASSET_PRIORITY: Record<string, CreatorProfileId[]> = {
  none: ['beginner_creator'],
  '3d_models': ['three_d_creator'],
  full_project: ['web_engine_developer'],
};

function tiebreak(candidates: CreatorProfileId[], answers: OnboardingAnswers): CreatorProfileId {
  const byExperience = EXPERIENCE_PRIORITY[answers.experience] ?? [];
  const expWinner = candidates.find((c) => byExperience.includes(c));
  if (expWinner) return expWinner;

  const byGoal = GOAL_PRIORITY[answers.goal] ?? [];
  const goalWinner = candidates.find((c) => byGoal.includes(c));
  if (goalWinner) return goalWinner;

  const byAssets = ASSET_PRIORITY[answers.assets] ?? [];
  const assetWinner = candidates.find((c) => byAssets.includes(c));
  if (assetWinner) return assetWinner;

  return PROFILE_ORDER_SIMPLER_TO_COMPLEX.find((profile) => candidates.includes(profile)) ?? candidates[0];
}

export function classifyCreatorProfile(answers: OnboardingAnswers): ClassificationResult {
  const profiles: CreatorProfileId[] = [
    'beginner_creator',
    'three_d_creator',
    'interactive_builder',
    'web_engine_developer',
  ];
  const breakdown = profiles.map((profile) => scoreProfile(profile, answers));
  const maxScore = Math.max(...breakdown.map((b) => b.total));
  const top = breakdown.filter((b) => b.total === maxScore).map((b) => b.profile);
  const profile = top.length === 1 ? top[0] : tiebreak(top, answers);
  const totalScore = breakdown.reduce((acc, b) => acc + b.total, 0);
  const confidence = totalScore === 0 ? 0.25 : Number((maxScore / totalScore).toFixed(2));

  return { profile, confidence, breakdown };
}
