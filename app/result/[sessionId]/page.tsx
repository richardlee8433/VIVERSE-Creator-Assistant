import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StepCard } from "@/components/step-card";
import { GuideCard } from "@/components/guide-card";
import { PitfallCard } from "@/components/pitfall-card";
import { FollowupInput } from "@/components/followup-input";
import { mockRecommendation } from "@/lib/mock-data";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  AlertTriangle,
  MessageCircle,
  Share2,
  RotateCcw,
} from "lucide-react";

interface ResultPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { sessionId } = await params;
  const recommendation = mockRecommendation;

  return (
    <main className="min-h-screen bg-background noise-bg">
      {/* Background effects */}
      <div className="fixed inset-0 gradient-radial pointer-events-none" />
      <div className="fixed inset-0 gradient-mesh opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 glass sticky top-0">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">Back to home</span>
            </Link>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/onboarding">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake
                </Link>
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative py-12 px-4">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Recommendation Hero */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <Badge variant="neon" className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Your recommended path
              </Badge>
            </div>

            <Card className="border-primary/30 bg-card/80 backdrop-blur-sm overflow-hidden">
              {/* Top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              
              <CardContent className="p-8 sm:p-12 text-center space-y-6">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/20 border border-primary/30 glow-cyan mx-auto">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                    {recommendation.path.title}
                  </h1>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-sm">
                      {recommendation.path.confidence}% match
                    </Badge>
                  </div>
                </div>

                <Button size="lg" className="mt-4" asChild>
                  <a href="#recommended-guides">
                    View recommended guides
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Why this path */}
          <section>
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Why this path fits you
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {recommendation.reason}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* First 3 steps */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Your first 3 steps
              </h2>
            </div>

            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-8">
                  {recommendation.firstSteps.map((step, index) => (
                    <div key={step.step} className="relative">
                      {index < recommendation.firstSteps.length - 1 && (
                        <div className="absolute left-5 top-14 h-full w-px bg-gradient-to-b from-primary/30 to-transparent" />
                      )}
                      <StepCard
                        step={step.step}
                        title={step.title}
                        description={step.description}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Recommended guides */}
          <section id="recommended-guides" className="space-y-6 scroll-mt-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  Recommended guides
                </h2>
              </div>
              <Badge variant="outline">{recommendation.guides.length} guides</Badge>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {recommendation.guides.map((guide) => (
                <GuideCard
                  key={guide.id}
                  title={guide.title}
                  reason={guide.reason}
                  url={guide.url}
                  sourceUrl={guide.sourceUrl}
                />
              ))}
            </div>
          </section>

          {/* Common pitfalls */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h2 className="text-2xl font-bold text-foreground">
                Common pitfalls to avoid
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {recommendation.pitfalls.map((pitfall, index) => (
                <PitfallCard
                  key={index}
                  title={pitfall.title}
                  tip={pitfall.tip}
                />
              ))}
            </div>
          </section>

          {/* Follow-up question */}
          <section className="space-y-6">
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Have a question?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FollowupInput />
              </CardContent>
            </Card>
          </section>

          {/* Bottom CTA */}
          <section className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">
              Session ID: {sessionId}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/onboarding">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Start over
                </Link>
              </Button>
              <Button asChild>
                <Link href="/">
                  Return home
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
