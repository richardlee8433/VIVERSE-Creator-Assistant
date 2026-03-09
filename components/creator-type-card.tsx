import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Box, Zap, Rocket, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Box,
  Zap,
  Rocket,
};

interface CreatorTypeCardProps {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  className?: string;
}

export function CreatorTypeCard({
  title,
  description,
  icon,
  gradient,
  className,
}: CreatorTypeCardProps) {
  const Icon = iconMap[icon] || Sparkles;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden hover:border-primary/50 hover:glow-cyan-subtle cursor-pointer",
        className
      )}
    >
      {/* Gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          gradient
        )}
      />

      <CardContent className="relative p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
