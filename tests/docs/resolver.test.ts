import { describe, expect, it } from 'vitest';
import { resolveRecommendedDocs } from '@/lib/docs/resolver';

describe('resolveRecommendedDocs', () => {
  const officialDocsByPath = {
    no_code_path: 'https://docs.viverse.com/publishing-from-templates/creating-from-templates',
    playcanvas_toolkit_path: 'https://docs.viverse.com/how-to-publish',
    interactive_build_path: 'https://docs.viverse.com/playcanvas-toolkit/toolkit-setup',
    standalone_publish_path: 'https://docs.viverse.com/standalone-app-publishing/intro-to-standalone-app-publishing',
  } as const;

  it('returns guides for each path', () => {
    const guides = resolveRecommendedDocs('no_code_path');
    expect(guides.length).toBeGreaterThanOrEqual(3);
    expect(guides[0].taskStage).toBe('intro');
  });


  it('returns local quick guide urls with source docs links', () => {
    const [guide] = resolveRecommendedDocs('playcanvas_toolkit_path');
    expect(guide.url.startsWith('/guides/')).toBe(true);
    expect(guide.sourceUrl.startsWith('https://')).toBe(true);
  });

  it('maps all onboarding paths to the finalized official docs links', () => {
    (Object.keys(officialDocsByPath) as Array<keyof typeof officialDocsByPath>).forEach((pathId) => {
      const guides = resolveRecommendedDocs(pathId);
      guides.forEach((guide) => {
        expect(guide.sourceUrl).toBe(officialDocsByPath[pathId]);
      });
    });
  });


  it('uses the finalized guide title mapping for each path taxonomy label', () => {
    expect(resolveRecommendedDocs('no_code_path').map((g) => g.title)).toEqual([
      'Create Your First World From Templates',
      'Customize a Template World',
      'Publish Your Template World',
    ]);

    expect(resolveRecommendedDocs('playcanvas_toolkit_path').map((g) => g.title)).toEqual([
      'Prepare Your 3D Experience',
      'Upload Using VIVERSE Studio',
      'Configure World Settings',
      'Publish Your Experience',
    ]);

    expect(resolveRecommendedDocs('interactive_build_path').map((g) => g.title)).toEqual([
      'Toolkit Setup Guide',
      'Your First Scene',
      'Publishing to VIVERSE',
      'Optimization Basics',
    ]);

    expect(resolveRecommendedDocs('standalone_publish_path').map((g) => g.title)).toEqual([
      'Prepare Your Web App',
      'Configure Standalone App',
      'Upload Build Files',
      'Publish Standalone Experience',
    ]);
  });

  it('respects stage + priority order', () => {
    const guides = resolveRecommendedDocs('standalone_publish_path');
    expect(guides.map((g) => g.taskStage)).toEqual(['intro', 'setup', 'first_build', 'publish']);
  });
});
