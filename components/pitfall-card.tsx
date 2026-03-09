import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PitfallCardProps {
  title: string;
  tip: string;
  className?: string;
}

export function PitfallCard({ title, tip, className }: PitfallCardProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border border-border bg-card/50",
        className
      )}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-destructive/20 flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
        </div>
      </div>
    </div>
  );
}
