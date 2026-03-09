import mappings from '@/data/creator-paths.json';
import type { CreatorProfileId, OnboardingAnswers, PathId } from '@/lib/session/types';

const profileToPath = mappings.profileToPath as Record<CreatorProfileId, PathId>;

export function routePath(profile: CreatorProfileId, answers: OnboardingAnswers): PathId {
  if (answers.experience === 'playcanvas' && answers.goal === 'interactive_experience') {
    return 'interactive_build_path';
  }

  if (answers.experience === 'unity_unreal' && answers.goal === 'publish_existing_app') {
    return 'standalone_publish_path';
  }

  return profileToPath[profile] ?? 'no_code_path';
}
