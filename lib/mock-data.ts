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
