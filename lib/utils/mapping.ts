import type { OnboardingAnswers } from '@/lib/session/types';

export type OnboardingUIAnswers = {
  goal: 'virtual-space' | 'interactive-experience' | '3d-showcase' | 'social-venue';
  experience: 'beginner' | 'some-3d' | 'developer' | '3d-artist';
  workflow: 'visual' | 'templates' | 'code' | 'import';
  assets: 'nothing' | '3d-assets' | 'design' | 'existing-project';
  first_project_goal: 'learn' | 'prototype' | 'publish' | 'evaluate';
  biggest_concern: 'complexity' | 'time' | 'quality' | 'scalability';
};

export type FreeTextOnboardingAnswers = {
  goal: string;
  experience: string;
  workflow: string;
  assets: string;
  first_project_goal: string;
  biggest_concern: string;
};

const GOAL_MAP: Record<OnboardingUIAnswers['goal'], OnboardingAnswers['goal']> = {
  'virtual-space': '3d_world',
  'interactive-experience': 'interactive_experience',
  '3d-showcase': '3d_world',
  'social-venue': 'exploring',
};

const EXPERIENCE_MAP: Record<OnboardingUIAnswers['experience'], OnboardingAnswers['experience']> = {
  beginner: 'none',
  'some-3d': '3d_tools',
  developer: 'web_development',
  '3d-artist': '3d_tools',
};

const WORKFLOW_MAP: Record<OnboardingUIAnswers['workflow'], OnboardingAnswers['workflow']> = {
  visual: 'visual_editor',
  templates: 'no_code_tools',
  code: 'writing_code',
  import: 'visual_editor',
};

const ASSETS_MAP: Record<OnboardingUIAnswers['assets'], OnboardingAnswers['assets']> = {
  nothing: 'none',
  '3d-assets': '3d_models',
  design: 'none',
  'existing-project': 'full_project',
};

const FIRST_PROJECT_GOAL_MAP: Record<
  OnboardingUIAnswers['first_project_goal'],
  OnboardingAnswers['first_project_goal']
> = {
  learn: 'shareable_demo',
  prototype: 'interactive_world',
  publish: 'viverse_app',
  evaluate: 'shareable_demo',
};

const BIGGEST_CONCERN_MAP: Record<
  OnboardingUIAnswers['biggest_concern'],
  OnboardingAnswers['biggest_concern']
> = {
  complexity: 'complexity',
  time: 'tools_setup',
  quality: 'performance',
  scalability: 'publishing',
};

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
}

function includesAny(value: string, phrases: string[]): boolean {
  return phrases.some((phrase) => value.includes(phrase));
}

function mapGoal(value: string): OnboardingAnswers['goal'] {
  const normalized = normalizeText(value);
  if (normalized === '3d_world' || includesAny(normalized, ['virtual', '3d_world', 'showcase', 'gallery', 'space'])) return '3d_world';
  if (normalized === 'interactive_experience' || includesAny(normalized, ['interactive', 'game', 'experience'])) return 'interactive_experience';
  if (normalized === 'publish_existing_app' || includesAny(normalized, ['existing_app', 'port', 'migration'])) return 'publish_existing_app';
  return 'exploring';
}

function mapExperience(value: string): OnboardingAnswers['experience'] {
  const normalized = normalizeText(value);
  if (normalized === 'none' || includesAny(normalized, ['beginner', 'new', 'none', 'no_experience'])) return 'none';
  if (normalized === 'playcanvas' || includesAny(normalized, ['playcanvas'])) return 'playcanvas';
  if (normalized === 'web_development' || includesAny(normalized, ['developer', 'javascript', 'typescript', 'web'])) return 'web_development';
  if (normalized === 'unity_unreal' || includesAny(normalized, ['unity', 'unreal'])) return 'unity_unreal';
  return '3d_tools';
}

function mapWorkflow(value: string): OnboardingAnswers['workflow'] {
  const normalized = normalizeText(value);
  if (normalized === 'writing_code' || includesAny(normalized, ['code', 'script', 'developer'])) return 'writing_code';
  if (normalized === 'visual_editor' || includesAny(normalized, ['visual', 'editor', 'drag', 'import'])) return 'visual_editor';
  return 'no_code_tools';
}

function mapAssets(value: string): OnboardingAnswers['assets'] {
  const normalized = normalizeText(value);
  if (normalized === 'full_project' || includesAny(normalized, ['project', 'repo', 'application'])) return 'full_project';
  if (normalized === '3d_models' || includesAny(normalized, ['model', 'assets', 'fbx', 'gltf', 'obj'])) return '3d_models';
  return 'none';
}

function mapFirstProjectGoal(value: string): OnboardingAnswers['first_project_goal'] {
  const normalized = normalizeText(value);
  if (normalized === 'viverse_app' || includesAny(normalized, ['publish', 'launch', 'app', 'production'])) return 'viverse_app';
  if (normalized === 'interactive_world' || includesAny(normalized, ['prototype', 'interactive', 'world'])) return 'interactive_world';
  return 'shareable_demo';
}

function mapBiggestConcern(value: string): OnboardingAnswers['biggest_concern'] {
  const normalized = normalizeText(value);
  if (normalized === 'performance' || includesAny(normalized, ['quality', 'performance', 'fps', 'optimization'])) return 'performance';
  if (normalized === 'publishing' || includesAny(normalized, ['publish', 'release', 'distribution'])) return 'publishing';
  if (normalized === 'tools_setup' || includesAny(normalized, ['setup', 'time', 'tooling'])) return 'tools_setup';
  return 'complexity';
}

export function mapUIAnswersToAPI(answers: OnboardingUIAnswers): OnboardingAnswers {
  return {
    goal: GOAL_MAP[answers.goal],
    experience: EXPERIENCE_MAP[answers.experience],
    workflow: WORKFLOW_MAP[answers.workflow],
    assets: ASSETS_MAP[answers.assets],
    first_project_goal: FIRST_PROJECT_GOAL_MAP[answers.first_project_goal],
    biggest_concern: BIGGEST_CONCERN_MAP[answers.biggest_concern],
  };
}

export function mapFreeTextAnswersToAPI(answers: FreeTextOnboardingAnswers): OnboardingAnswers {
  return {
    goal: mapGoal(answers.goal),
    experience: mapExperience(answers.experience),
    workflow: mapWorkflow(answers.workflow),
    assets: mapAssets(answers.assets),
    first_project_goal: mapFirstProjectGoal(answers.first_project_goal),
    biggest_concern: mapBiggestConcern(answers.biggest_concern),
  };
}
