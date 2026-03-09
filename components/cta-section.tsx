import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl border border-border/50 p-8 sm:p-12 lg:p-16 text-center space-y-8">
          {/* Glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Ready to start your
              <span className="text-primary text-glow"> creator journey</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
              Find your personalized path and get started with the right tools,
              guides, and resources for your goals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" asChild>
              <Link href="/onboarding">
                Find my best path
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Free to use. No account required.
          </p>
        </div>
      </div>
    </section>
  );
}
