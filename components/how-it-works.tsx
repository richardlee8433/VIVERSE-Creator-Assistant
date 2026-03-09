import { MessageSquare, Target, BookOpen } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Answer a few questions",
    description:
      "Tell us about your experience, goals, and what you want to create. It only takes a couple of minutes.",
  },
  {
    icon: Target,
    title: "Get your recommended path",
    description:
      "We analyze your answers and match you with the best starting point for your unique situation.",
  },
  {
    icon: BookOpen,
    title: "Start with the right guides",
    description:
      "Follow curated tutorials and resources specifically chosen to help you succeed from day one.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            How it works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Get personalized guidance in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-border via-primary/30 to-border" />
              )}

              <div className="flex flex-col items-center text-center space-y-4">
                {/* Icon container */}
                <div className="relative">
                  <div className="h-24 w-24 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:glow-cyan-subtle transition-all duration-300">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  {/* Step number */}
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
