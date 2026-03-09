import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { CreatorPathsSection } from "@/components/creator-paths-section";
import { CTASection } from "@/components/cta-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-background noise-bg">
      <Header />
      <HeroSection />
      <HowItWorks />
      <CreatorPathsSection />
      <CTASection />
      
      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-xs">V</span>
              </div>
              <span className="text-sm text-muted-foreground">
                VIVERSE Creator Assistant
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Part of the VIVERSE ecosystem
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
