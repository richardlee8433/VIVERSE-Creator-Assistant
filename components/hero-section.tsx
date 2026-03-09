import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { creatorPaths } from "@/lib/mock-data";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-radial" />
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Powered by VIVERSE Create
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                <span className="text-foreground">Find the fastest way to</span>
                <br />
                <span className="text-primary text-glow">start creating</span>
                <br />
                <span className="text-foreground">on VIVERSE</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed text-pretty">
                Answer a few questions and get a personalized recommendation for 
                the best path to bring your vision to life in the 3D internet.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="xl" asChild>
                <Link href="/onboarding">
                  Find my best path
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="#how-it-works">
                  <Play className="mr-2 h-4 w-4" />
                  See how it works
                </Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Takes about 2–3 minutes to complete
            </p>
          </div>

          {/* Right content - Decorative cards */}
          <div className="relative hidden lg:block">
            <div className="relative h-[500px]">
              {/* Floating path cards */}
              {creatorPaths.map((path, index) => (
                <div
                  key={path.id}
                  className="absolute glass rounded-2xl border border-border/50 p-5 w-64 hover:border-primary/50 hover:glow-cyan-subtle transition-all duration-500 cursor-pointer"
                  style={{
                    top: `${index * 110 + 20}px`,
                    left: index % 2 === 0 ? '0' : '100px',
                    transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
                    zIndex: creatorPaths.length - index,
                  }}
                >
                  <div className="space-y-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <div className="h-4 w-4 rounded bg-primary/60" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{path.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{path.description}</p>
                  </div>
                </div>
              ))}
              
              {/* Glow orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
