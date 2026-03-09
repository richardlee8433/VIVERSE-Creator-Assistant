import type { OnboardingAnswers } from "@/lib/session/types";

export type OnboardingUIAnswers = {
  goal: "virtual-space" | "interactive-experience" | "3d-showcase" | "social-venue";
  experience: "beginner" | "some-3d" | "developer" | "3d-artist";
  workflow: "visual" | "templates" | "code" | "import";
  assets: "nothing" | "3d-assets" | "design" | "existing-project";
  first_project_goal: "learn" | "prototype" | "publish" | "evaluate";
  biggest_concern: "complexity" | "time" | "quality" | "scalability";
};

const GOAL_MAP: Record<OnboardingUIAnswers["goal"], OnboardingAnswers["goal"]> = {
  "virtual-space": "3d_world",
  "interactive-experience": "interactive_experience",
  "3d-showcase": "3d_world",
  "social-venue": "exploring",
};

const EXPERIENCE_MAP: Record<OnboardingUIAnswers["experience"], OnboardingAnswers["experience"]> = {
  beginner: "none",
  "some-3d": "3d_tools",
  developer: "web_development",
  "3d-artist": "3d_tools",
};

const WORKFLOW_MAP: Record<OnboardingUIAnswers["workflow"], OnboardingAnswers["workflow"]> = {
  visual: "visual_editor",
  templates: "no_code_tools",
  code: "writing_code",
  import: "visual_editor",
};

const ASSETS_MAP: Record<OnboardingUIAnswers["assets"], OnboardingAnswers["assets"]> = {
  nothing: "none",
  "3d-assets": "3d_models",
  design: "none",
  "existing-project": "full_project",
};

const FIRST_PROJECT_GOAL_MAP: Record<
  OnboardingUIAnswers["first_project_goal"],
  OnboardingAnswers["first_project_goal"]
> = {
  learn: "shareable_demo",
  prototype: "interactive_world",
  publish: "viverse_app",
  evaluate: "shareable_demo",
};

const BIGGEST_CONCERN_MAP: Record<
  OnboardingUIAnswers["biggest_concern"],
  OnboardingAnswers["biggest_concern"]
> = {
  complexity: "complexity",
  time: "tools_setup",
  quality: "performance",
  scalability: "publishing",
};

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
