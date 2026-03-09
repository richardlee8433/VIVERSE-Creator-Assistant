import { describe, expect, it } from 'vitest';
import { routePath } from '@/lib/router/path-router';

const baseAnswers = {
  goal: 'exploring',
  experience: 'none',
  workflow: 'no_code_tools',
  assets: 'none',
  first_project_goal: 'shareable_demo',
  biggest_concern: 'complexity',
} as const;

describe('routePath', () => {
  it('maps profile to default path', () => {
    expect(routePath('three_d_creator', { ...baseAnswers, experience: '3d_tools' })).toBe('playcanvas_toolkit_path');
  });

  it('applies playcanvas interactive override', () => {
    expect(routePath('three_d_creator', { ...baseAnswers, experience: 'playcanvas', goal: 'interactive_experience' })).toBe('interactive_build_path');
  });

  it('applies unity publish override', () => {
    expect(routePath('interactive_builder', { ...baseAnswers, experience: 'unity_unreal', goal: 'publish_existing_app' })).toBe('standalone_publish_path');
  });
});
