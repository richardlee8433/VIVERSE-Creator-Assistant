export const GOALS = [
  '3d_world',
  'interactive_experience',
  'publish_existing_app',
  'exploring',
] as const;

export const EXPERIENCES = [
  'none',
  '3d_tools',
  'playcanvas',
  'web_development',
  'unity_unreal',
] as const;

export const WORKFLOWS = ['no_code_tools', 'visual_editor', 'writing_code'] as const;
export const ASSETS = ['none', '3d_models', 'full_project'] as const;
export const FIRST_PROJECT_GOALS = ['shareable_demo', 'interactive_world', 'viverse_app'] as const;
export const BIGGEST_CONCERNS = ['complexity', 'performance', 'publishing', 'tools_setup'] as const;

export const CREATOR_PROFILES = [
  'beginner_creator',
  'three_d_creator',
  'interactive_builder',
  'web_engine_developer',
] as const;

export const PATH_IDS = [
  'no_code_path',
  'playcanvas_toolkit_path',
  'interactive_build_path',
  'standalone_publish_path',
] as const;

export type Goal = (typeof GOALS)[number];
export type Experience = (typeof EXPERIENCES)[number];
export type Workflow = (typeof WORKFLOWS)[number];
export type Assets = (typeof ASSETS)[number];
export type FirstProjectGoal = (typeof FIRST_PROJECT_GOALS)[number];
export type BiggestConcern = (typeof BIGGEST_CONCERNS)[number];
export type CreatorProfileId = (typeof CREATOR_PROFILES)[number];
export type PathId = (typeof PATH_IDS)[number];

export type OnboardingAnswers = {
  goal: Goal;
  experience: Experience;
  workflow: Workflow;
  assets: Assets;
  first_project_goal: FirstProjectGoal;
  biggest_concern: BiggestConcern;
};

export type Guide = {
  headline: string;
  why: string;
  firstSteps: [string, string, string];
  pitfalls: string[];
};

export type RecommendedGuide = {
  id: string;
  title: string;
  url: string;
  sourceUrl: string;
  reason: string;
  taskStage: string;
  summary: string;
};

export type SessionRecord = {
  sessionId: string;
  answers: OnboardingAnswers;
  creatorProfile: CreatorProfileId;
  recommendedPath: PathId;
  confidence: number;
  generatedGuide: Guide;
  recommendedGuides: RecommendedGuide[];
  createdAt: string;
};

export type AnalyticsEventName =
  | 'landing_viewed'
  | 'onboarding_started'
  | 'question_answered'
  | 'onboarding_completed'
  | 'recommendation_viewed'
  | 'guide_clicked'
  | 'followup_question_submitted'
  | 'followup_answer_returned';

export type AnalyticsEvent = {
  eventName: AnalyticsEventName;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};
