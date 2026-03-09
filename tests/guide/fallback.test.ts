import { describe, expect, it } from 'vitest';
import { buildFallbackGuide } from '@/lib/guide/fallback';

describe('buildFallbackGuide', () => {
  it('returns valid shape with exactly 3 first steps', () => {
    const guide = buildFallbackGuide(
      {
        goal: 'exploring',
        experience: 'none',
        workflow: 'no_code_tools',
        assets: 'none',
        first_project_goal: 'shareable_demo',
        biggest_concern: 'complexity',
      },
      'no_code_path',
      [],
    );

    expect(guide.headline).toBeTruthy();
    expect(guide.firstSteps).toHaveLength(3);
    expect(guide.pitfalls.length).toBeGreaterThanOrEqual(1);
  });
});
