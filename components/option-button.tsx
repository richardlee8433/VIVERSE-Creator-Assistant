"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export function OptionButton({
  label,
  selected,
  onClick,
  className,
}: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full text-left p-4 rounded-xl border transition-all duration-200",
        selected
          ? "border-primary bg-primary/10 glow-cyan-subtle"
          : "border-border bg-card hover:border-primary/50 hover:bg-secondary",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            selected ? "text-primary" : "text-foreground"
          )}
        >
          {label}
        </span>
        <div
          className={cn(
            "flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
            selected
              ? "border-primary bg-primary"
              : "border-muted-foreground/30"
          )}
        >
          {selected && <Check className="h-3 w-3 text-primary-foreground" />}
        </div>
      </div>
    </button>
  );
}
