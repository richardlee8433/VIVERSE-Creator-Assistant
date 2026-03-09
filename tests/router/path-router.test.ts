import { describe, expect, it } from 'vitest';
import { routePath } from '@/lib/router/path-router';

import { classifyCreatorProfile } from '@/lib/classifier/scorer';

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


  it('routes no code + beginner to no_code_path', () => {
    const answers = { ...baseAnswers, experience: 'none', workflow: 'no_code_tools', assets: 'none' } as const;
    const profile = classifyCreatorProfile(answers).profile;
    expect(routePath(profile, answers)).toBe('no_code_path');
  });

  it('routes 3D asset + beginner to playcanvas_toolkit_path', () => {
    const answers = { ...baseAnswers, experience: '3d_tools', workflow: 'visual_editor', assets: '3d_models', goal: '3d_world' } as const;
    const profile = classifyCreatorProfile(answers).profile;
    expect(routePath(profile, answers)).toBe('playcanvas_toolkit_path');
  });

  it('routes web developer to standalone_publish_path', () => {
    const answers = { ...baseAnswers, experience: 'web_development', workflow: 'writing_code', assets: 'full_project', goal: 'publish_existing_app' } as const;
    const profile = classifyCreatorProfile(answers).profile;
    expect(routePath(profile, answers)).toBe('standalone_publish_path');
  });

});
