export const creatorPaths = [
  {
    id: "no-code",
    title: "No-code World Creation",
    description: "Build immersive experiences without writing code",
    icon: "Sparkles",
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
  {
    id: "playcanvas",
    title: "3D Creator Pipeline",
    description: "Use the visual editor and toolkit for 3D web content",
    icon: "Box",
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: "interactive",
    title: "Interactive Builder",
    description: "Create interactive 3D experiences with scripting",
    icon: "Zap",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "standalone",
    title: "Standalone Publishing",
    description: "Publish directly from Unity, Unreal, or other engines",
    icon: "Rocket",
    gradient: "from-pink-500/20 to-orange-500/20",
  },
];

export const onboardingQuestions = [
  {
    id: 1,
    question: "What do you want to create?",
    options: [
      { id: "virtual-space", label: "A virtual space or world" },
      { id: "interactive-experience", label: "An interactive experience or game" },
      { id: "3d-showcase", label: "A 3D showcase or portfolio" },
      { id: "social-venue", label: "A social event venue" },
    ],
  },
  {
    id: 2,
    question: "What is your experience with 3D or development?",
    options: [
      { id: "beginner", label: "Complete beginner" },
      { id: "some-3d", label: "Some 3D experience" },
      { id: "developer", label: "Experienced developer" },
      { id: "3d-artist", label: "Professional 3D artist" },
    ],
  },
  {
    id: 3,
    question: "How do you prefer to build?",
    options: [
      { id: "visual", label: "Visual drag-and-drop tools" },
      { id: "templates", label: "Starting from templates" },
      { id: "code", label: "Writing code" },
      { id: "import", label: "Importing existing assets" },
    ],
  },
  {
    id: 4,
    question: "What do you already have?",
    options: [
      { id: "nothing", label: "Nothing yet, starting fresh" },
      { id: "3d-assets", label: "3D models or assets" },
      { id: "design", label: "Design mockups or concepts" },
      { id: "existing-project", label: "An existing project to port" },
    ],
  },
  {
    id: 5,
    question: "What is your goal for your first project?",
    options: [
      { id: "learn", label: "Learn the platform" },
      { id: "prototype", label: "Build a quick prototype" },
      { id: "publish", label: "Publish something real" },
      { id: "evaluate", label: "Evaluate for a bigger project" },
    ],
  },
  {
    id: 6,
    question: "What concerns you most?",
    options: [
      { id: "complexity", label: "Technical complexity" },
      { id: "time", label: "Time to first result" },
      { id: "quality", label: "Output quality" },
      { id: "scalability", label: "Scalability and features" },
    ],
  },
];

export const mockRecommendation = {
  path: {
    id: "playcanvas",
    title: "3D Creator Pipeline",
    confidence: 92,
  },
  reason:
    "Based on your experience with 3D assets and preference for visual tools, the 3D Creator Pipeline gives you the perfect balance of power and ease of use. You can build interactive content without diving into low-level code.",
  firstSteps: [
    {
      step: 1,
      title: "Set up the toolkit",
      description: "Install and configure the VIVERSE PlayCanvas integration",
    },
    {
      step: 2,
      title: "Build one simple scene",
      description: "Create your first 3D scene with basic interactions",
    },
    {
      step: 3,
      title: "Publish a test experience",
      description: "Deploy your scene to VIVERSE and share it",
    },
  ],
  guides: [
    {
      id: "toolkit-setup",
      title: "Toolkit Setup Guide",
      reason: "Essential first step for your chosen path",
      url: "/guides/setup_toolkit",
      sourceUrl: "https://docs.viverse.com/publishing-from-templates/creating-from-templates",
    },
    {
      id: "first-scene",
      title: "Your First Scene",
      reason: "Hands-on tutorial matched to your experience level",
      url: "/guides/build_toolkit",
      sourceUrl: "https://docs.viverse.com/how-to-publish",
    },
    {
      id: "publishing",
      title: "Publishing to VIVERSE",
      reason: "Get your work live quickly",
      url: "/guides/publish_toolkit",
      sourceUrl: "https://docs.viverse.com/playcanvas-toolkit/toolkit-setup",
    },
    {
      id: "optimization",
      title: "Optimization Basics",
      reason: "Ensure smooth performance from the start",
      url: "/guides/intro_toolkit",
      sourceUrl: "https://docs.viverse.com/standalone-app-publishing/intro-to-standalone-app-publishing",
    },
  ],
  pitfalls: [
    {
      title: "Starting with too many large assets",
      tip: "Begin with optimized, smaller assets to keep performance smooth",
    },
    {
      title: "Choosing an advanced workflow too early",
      tip: "Master the basics before adding complex interactions",
    },
    {
      title: "Skipping a first publish test",
      tip: "Publish early to understand the deployment process",
    },
  ],
};
