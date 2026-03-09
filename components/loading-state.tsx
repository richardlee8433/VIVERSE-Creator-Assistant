import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 space-y-4",
        className
      )}
    >
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-primary/20" />
        <Loader2 className="h-12 w-12 text-primary animate-spin absolute inset-0" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
