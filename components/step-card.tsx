import { cn } from "@/lib/utils";

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  className?: string;
}

export function StepCard({ step, title, description, className }: StepCardProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center glow-cyan-subtle">
        <span className="text-primary font-semibold text-sm">{step}</span>
      </div>
      <div className="space-y-1 pt-1">
        <h4 className="font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
