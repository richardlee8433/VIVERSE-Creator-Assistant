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

export type ConversationalOnboardingAnswers = FreeTextOnboardingAnswers;

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
    .replace(/[\s_-]+/g, ' ');
}

function includesAny(value: string, phrases: string[]): boolean {
  return phrases.some((phrase) => value.includes(phrase));
}

function mapGoal(value: string): OnboardingAnswers['goal'] {
  const normalized = normalizeText(value);
  if (normalized === '3d world' || includesAny(normalized, ['virtual', '3d world', 'showcase', 'gallery', 'space'])) return '3d_world';
  if (normalized === 'interactive experience' || includesAny(normalized, ['interactive', 'game', 'experience'])) return 'interactive_experience';
  if (normalized === 'publish existing app' || includesAny(normalized, ['existing app', 'port', 'migration'])) return 'publish_existing_app';
  return 'exploring';
}

function mapExperience(value: string): OnboardingAnswers['experience'] {
  const normalized = normalizeText(value);
  if (normalized === 'none' || includesAny(normalized, ['beginner', 'new', 'none', 'no experience'])) return 'none';
  if (normalized === 'playcanvas' || includesAny(normalized, ['playcanvas'])) return 'playcanvas';
  if (normalized === 'web development' || includesAny(normalized, ['developer', 'javascript', 'typescript', 'web'])) return 'web_development';
  if (normalized === 'unity unreal' || includesAny(normalized, ['unity', 'unreal'])) return 'unity_unreal';
  return '3d_tools';
}

function mapWorkflow(value: string): OnboardingAnswers['workflow'] {
  const normalized = normalizeText(value);
  if (normalized === 'writing code' || includesAny(normalized, ['code', 'script', 'developer'])) return 'writing_code';
  if (normalized === 'visual editor' || includesAny(normalized, ['visual', 'editor', 'drag', 'import'])) return 'visual_editor';
  return 'no_code_tools';
}

function mapAssets(value: string): OnboardingAnswers['assets'] {
  const normalized = normalizeText(value);
  if (normalized === 'full project' || includesAny(normalized, ['project', 'repo', 'application'])) return 'full_project';
  if (normalized === '3d models' || includesAny(normalized, ['model', 'assets', 'fbx', 'gltf', 'obj'])) return '3d_models';
  return 'none';
}

function mapFirstProjectGoal(value: string): OnboardingAnswers['first_project_goal'] {
  const normalized = normalizeText(value);
  if (normalized === 'viverse app' || includesAny(normalized, ['publish', 'launch', 'app', 'production'])) return 'viverse_app';
  if (normalized === 'interactive world' || includesAny(normalized, ['prototype', 'interactive', 'world'])) return 'interactive_world';
  return 'shareable_demo';
}

function mapBiggestConcern(value: string): OnboardingAnswers['biggest_concern'] {
  const normalized = normalizeText(value);
  if (normalized === 'performance' || includesAny(normalized, ['quality', 'performance', 'fps', 'optimization'])) return 'performance';
  if (normalized === 'publishing' || includesAny(normalized, ['publish', 'release', 'distribution'])) return 'publishing';
  if (normalized === 'tools setup' || includesAny(normalized, ['setup', 'time', 'tooling'])) return 'tools_setup';
  return 'complexity';
}

function mapConversationalGoalToUI(value: string): OnboardingUIAnswers['goal'] {
  const normalized = normalizeText(value);
  if (includesAny(normalized, ['social', 'community', 'hangout', 'event', 'venue'])) return 'social-venue';
  if (includesAny(normalized, ['interactive', 'game', 'experience'])) return 'interactive-experience';
  if (includesAny(normalized, ['showcase', 'gallery', 'portfolio', 'display'])) return '3d-showcase';
  if (includesAny(normalized, ['virtual', 'world', 'space', 'room', 'environment'])) return 'virtual-space';

  // Best-effort fallback: unknown intent is treated as an exploratory "virtual-space"
  // path because it keeps onboarding flow unblocked while remaining broadly useful.
  return 'virtual-space';
}

function mapConversationalExperienceToUI(value: string): OnboardingUIAnswers['experience'] {
  const normalized = normalizeText(value);
  if (includesAny(normalized, ['unity', 'unreal', 'blender', 'maya', '3d artist', 'artist'])) return '3d-artist';
  if (includesAny(normalized, ['developer', 'engineer', 'javascript', 'typescript', 'programming', 'code'])) return 'developer';
  if (includesAny(normalized, ['some', 'intermediate', 'used before', 'familiar', 'basic 3d'])) return 'some-3d';
  if (includesAny(normalized, ['new', 'beginner', 'first time', 'no experience'])) return 'beginner';

  // Best-effort fallback: when confidence is low, we choose "beginner" instead of
  // overestimating user skill and routing them to a too-advanced path.
  return 'beginner';
}

function mapConversationalWorkflowToUI(value: string): OnboardingUIAnswers['workflow'] {
  const normalized = normalizeText(value);
  if (includesAny(normalized, ['code', 'sdk', 'api', 'script', 'developer'])) return 'code';
  if (includesAny(normalized, ['import', 'upload', 'bring my', 'from blender', 'from unity'])) return 'import';
  if (includesAny(normalized, ['template', 'starter', 'quick start', 'boilerplate'])) return 'templates';
  if (includesAny(normalized, ['visual', 'drag', 'drop', 'editor', 'no code'])) return 'visual';

  // Best-effort fallback: default to "visual" as the lowest-friction workflow.
  return 'visual';
}

function mapConversationalAssetsToUI(value: string): OnboardingUIAnswers['assets'] {
  const normalized = normalizeText(value);
  if (includesAny(normalized, ['existing project', 'full project', 'repo', 'application', 'app'])) return 'existing-project';
  if (includesAny(normalized, ['3d', 'model', 'fbx', 'gltf', 'obj', 'asset'])) return '3d-assets';
  if (includesAny(normalized, ['design', 'figma', 'concept', 'mockup', 'ui'])) return 'design';
  if (includesAny(normalized, ['nothing', 'none', 'start from scratch', 'no assets'])) return 'nothing';

  // Best-effort fallback: unknown assets are treated as "nothing" to avoid assumptions.
  return 'nothing';
}

function mapConversationalFirstProjectGoalToUI(value: string): OnboardingUIAnswers['first_project_goal'] {
  const normalized = normalizeText(value);
  if (includesAny(normalized, ['publish', 'launch', 'ship', 'production', 'go live'])) return 'publish';
  if (includesAny(normalized, ['prototype', 'poc', 'mvp', 'test idea'])) return 'prototype';
  if (includesAny(normalized, ['evaluate', 'assess', 'compare', 'explore options'])) return 'evaluate';
  if (includesAny(normalized, ['learn', 'tutorial', 'practice', 'study'])) return 'learn';

  // Best-effort fallback: prefer "learn" when goal is ambiguous.
  return 'learn';
}

function mapConversationalBiggestConcernToUI(value: string): OnboardingUIAnswers['biggest_concern'] {
  const normalized = normalizeText(value);
  if (includesAny(normalized, ['quality', 'performance', 'lag', 'fps', 'optimization'])) return 'quality';
  if (includesAny(normalized, ['scale', 'scalability', 'users', 'growth', 'deployment'])) return 'scalability';
  if (includesAny(normalized, ['time', 'deadline', 'speed', 'quickly', 'fast'])) return 'time';
  if (includesAny(normalized, ['complex', 'complexity', 'difficulty', 'hard', 'confusing'])) return 'complexity';

  // Best-effort fallback: "complexity" is the safest generic concern and maps cleanly.
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

export function mapConversationalAnswersToUIAnswers(
  answers: ConversationalOnboardingAnswers
): OnboardingUIAnswers {
  return {
    goal: mapConversationalGoalToUI(answers.goal),
    experience: mapConversationalExperienceToUI(answers.experience),
    workflow: mapConversationalWorkflowToUI(answers.workflow),
    assets: mapConversationalAssetsToUI(answers.assets),
    first_project_goal: mapConversationalFirstProjectGoalToUI(answers.first_project_goal),
    biggest_concern: mapConversationalBiggestConcernToUI(answers.biggest_concern),
  };
}

export function mapConversationalAnswersToAPI(
  answers: ConversationalOnboardingAnswers
): OnboardingAnswers {
  return mapUIAnswersToAPI(mapConversationalAnswersToUIAnswers(answers));
}
