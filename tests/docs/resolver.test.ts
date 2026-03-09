import { describe, expect, it } from 'vitest';
import { resolveRecommendedDocs } from '@/lib/docs/resolver';

describe('resolveRecommendedDocs', () => {
  it('returns guides for each path', () => {
    const guides = resolveRecommendedDocs('no_code_path');
    expect(guides.length).toBeGreaterThanOrEqual(3);
    expect(guides[0].taskStage).toBe('intro');
  });

  it('respects stage + priority order', () => {
    const guides = resolveRecommendedDocs('standalone_publish_path');
    expect(guides.map((g) => g.taskStage)).toEqual(['intro', 'setup', 'first_build', 'publish']);
  });
});
