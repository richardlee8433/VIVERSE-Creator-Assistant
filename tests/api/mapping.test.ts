import { describe, expect, it } from 'vitest';
import { mapUIAnswersToAPI } from '@/lib/utils/mapping';

describe('mapUIAnswersToAPI', () => {
  it('maps onboarding UI values to backend enum payload', () => {
    const mapped = mapUIAnswersToAPI({
      goal: 'virtual-space',
      experience: 'beginner',
      workflow: 'templates',
      assets: 'nothing',
      first_project_goal: 'learn',
      biggest_concern: 'complexity',
    });

    expect(mapped).toEqual({
      goal: '3d_world',
      experience: 'none',
      workflow: 'no_code_tools',
      assets: 'none',
      first_project_goal: 'shareable_demo',
      biggest_concern: 'complexity',
    });
  });
});
