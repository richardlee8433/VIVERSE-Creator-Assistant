import { describe, expect, it } from 'vitest';
import { mapFreeTextAnswersToAPI, mapUIAnswersToAPI } from '@/lib/utils/mapping';

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

describe('mapFreeTextAnswersToAPI', () => {
  it('maps free text onboarding signals to backend enums', () => {
    const mapped = mapFreeTextAnswersToAPI({
      goal: 'I want an interactive game-like experience',
      experience: 'I am a web developer using TypeScript',
      workflow: 'I prefer writing code',
      assets: 'I already have glTF models',
      first_project_goal: 'prototype a small interactive world',
      biggest_concern: 'I am worried about performance',
    });

    expect(mapped).toEqual({
      goal: 'interactive_experience',
      experience: 'web_development',
      workflow: 'writing_code',
      assets: '3d_models',
      first_project_goal: 'interactive_world',
      biggest_concern: 'performance',
    });
  });
});
