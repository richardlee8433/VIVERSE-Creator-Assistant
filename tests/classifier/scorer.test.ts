import { describe, expect, it } from 'vitest';
import { classifyCreatorProfile } from '@/lib/classifier/scorer';

describe('classifyCreatorProfile', () => {
  it('classifies beginner creator', () => {
    const result = classifyCreatorProfile({
      goal: 'exploring',
      experience: 'none',
      workflow: 'no_code_tools',
      assets: 'none',
      first_project_goal: 'shareable_demo',
      biggest_concern: 'complexity',
    });
    expect(result.profile).toBe('beginner_creator');
  });

  it('classifies 3D creator', () => {
    const result = classifyCreatorProfile({
      goal: '3d_world',
      experience: '3d_tools',
      workflow: 'visual_editor',
      assets: '3d_models',
      first_project_goal: 'interactive_world',
      biggest_concern: 'performance',
    });
    expect(result.profile).toBe('three_d_creator');
  });

  it('classifies interactive builder', () => {
    const result = classifyCreatorProfile({
      goal: 'interactive_experience',
      experience: 'playcanvas',
      workflow: 'writing_code',
      assets: '3d_models',
      first_project_goal: 'interactive_world',
      biggest_concern: 'tools_setup',
    });
    expect(result.profile).toBe('interactive_builder');
  });

  it('classifies web/engine developer', () => {
    const result = classifyCreatorProfile({
      goal: 'publish_existing_app',
      experience: 'unity_unreal',
      workflow: 'writing_code',
      assets: 'full_project',
      first_project_goal: 'viverse_app',
      biggest_concern: 'publishing',
    });
    expect(result.profile).toBe('web_engine_developer');
  });

  it('uses tie-break by experience', () => {
    const result = classifyCreatorProfile({
      goal: 'interactive_experience',
      experience: 'playcanvas',
      workflow: 'visual_editor',
      assets: '3d_models',
      first_project_goal: 'interactive_world',
      biggest_concern: 'publishing',
    });
    expect(result.profile).toBe('interactive_builder');
  });
});
