import { CreatorTypeCard } from "@/components/creator-type-card";
import { creatorPaths } from "@/lib/mock-data";

export function CreatorPathsSection() {
  return (
    <section id="paths" className="py-24 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Creator paths
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Four distinct paths to help you start creating, matched to your
            experience and goals
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {creatorPaths.map((path) => (
            <CreatorTypeCard
              key={path.id}
              title={path.title}
              description={path.description}
              icon={path.icon}
              gradient={path.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
