import type { CreatorProfileId, OnboardingAnswers } from '@/lib/session/types';

export type ProfileScoreBreakdown = {
  profile: CreatorProfileId;
  total: number;
  reasons: string[];
};

export function scoreProfile(profile: CreatorProfileId, answers: OnboardingAnswers): ProfileScoreBreakdown {
  const reasons: string[] = [];
  let total = 0;

  if (profile === 'beginner_creator') {
    if (answers.experience === 'none') { total += 4; reasons.push('experience:none'); }
    if (answers.workflow === 'no_code_tools') { total += 3; reasons.push('workflow:no_code_tools'); }
    if (answers.assets === 'none') { total += 2; reasons.push('assets:none'); }
    if (answers.biggest_concern === 'complexity') { total += 2; reasons.push('concern:complexity'); }
  }

  if (profile === 'three_d_creator') {
    if (answers.experience === '3d_tools') { total += 4; reasons.push('experience:3d_tools'); }
    if (answers.assets === '3d_models') { total += 3; reasons.push('assets:3d_models'); }
    if (answers.workflow === 'visual_editor') { total += 2; reasons.push('workflow:visual_editor'); }
    if (answers.biggest_concern === 'performance' || answers.biggest_concern === 'publishing') { total += 2; reasons.push('concern:perf_or_publish'); }
  }

  if (profile === 'interactive_builder') {
    if (answers.experience === 'playcanvas') { total += 4; reasons.push('experience:playcanvas'); }
    if (answers.goal === 'interactive_experience') { total += 3; reasons.push('goal:interactive_experience'); }
    if (answers.workflow === 'writing_code' || answers.workflow === 'visual_editor') { total += 2; reasons.push('workflow:code_or_visual'); }
  }

  if (profile === 'web_engine_developer') {
    if (answers.experience === 'web_development' || answers.experience === 'unity_unreal') { total += 4; reasons.push('experience:web_or_engine'); }
    if (answers.assets === 'full_project') { total += 3; reasons.push('assets:full_project'); }
    if (answers.goal === 'publish_existing_app') { total += 3; reasons.push('goal:publish_existing_app'); }
  }

  return { profile, total, reasons };
}
