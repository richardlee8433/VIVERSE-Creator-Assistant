import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuideCardProps {
  title: string;
  reason: string;
  url: string;
  sourceUrl?: string;
  className?: string;
}

export function GuideCard({ title, reason, url, sourceUrl, className }: GuideCardProps) {
  return (
    <Card
      className={cn(
        "group hover:border-primary/50 hover:glow-cyan-subtle transition-all duration-300",
        className
      )}
    >
      <CardContent className="p-5">
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {reason}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <Button
              variant="default"
              size="sm"
              className="w-full"
              asChild
            >
              <a href={url}>
                View Quick Guide
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full group-hover:border-primary/50"
              asChild
            >
              <a href={sourceUrl ?? url} target="_blank" rel="noopener noreferrer">
                Official Docs
                <ExternalLink className="ml-2 h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
