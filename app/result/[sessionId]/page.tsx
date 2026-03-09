import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StepCard } from "@/components/step-card";
import { GuideCard } from "@/components/guide-card";
import { PitfallCard } from "@/components/pitfall-card";
import { FollowupInput } from "@/components/followup-input";
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

type RecommendationResponse = {
  sessionId: string;
  creatorProfile: {
    id: string;
    label: string;
  };
  recommendedPath: {
    id: string;
    label: string;
  };
  guide: {
    headline: string;
    why: string;
    firstSteps: [string, string, string];
    pitfalls: string[];
  };
  recommendedGuides: Array<{
    id: string;
    title: string;
    url: string;
    reason: string;
    sourceUrl: string;
  }>;
};

async function fetchRecommendation(sessionId: string): Promise<RecommendationResponse> {
  const response = await fetch(`/api/recommendation/${sessionId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to load recommendation");
  }

  return response.json();
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { sessionId } = await params;

  try {
    const recommendation = await fetchRecommendation(sessionId);

    return (
      <main className="min-h-screen bg-background noise-bg">
        <div className="fixed inset-0 gradient-radial pointer-events-none" />
        <div className="fixed inset-0 gradient-mesh opacity-30 pointer-events-none" />

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

        <div className="relative py-12 px-4">
          <div className="mx-auto max-w-5xl space-y-12">
            <section className="space-y-6">
              <div className="text-center space-y-2">
                <Badge variant="neon" className="mb-4">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Your recommended path
                </Badge>
              </div>

              <Card className="border-primary/30 bg-card/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <CardContent className="p-8 sm:p-12 text-center space-y-6">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/20 border border-primary/30 glow-cyan mx-auto">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                      {recommendation.recommendedPath.label}
                    </h1>
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

            <section>
              <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Why this path fits you
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{recommendation.guide.why}</p>
                </CardContent>
              </Card>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Your first 3 steps</h2>
              </div>

              <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8">
                  <div className="space-y-8">
                    {recommendation.guide.firstSteps.map((stepText, index) => (
                      <div key={index} className="relative">
                        {index < recommendation.guide.firstSteps.length - 1 && (
                          <div className="absolute left-5 top-14 h-full w-px bg-gradient-to-b from-primary/30 to-transparent" />
                        )}
                        <StepCard
                          step={index + 1}
                          title={`Step ${index + 1}`}
                          description={stepText}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="recommended-guides" className="space-y-6 scroll-mt-24">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Recommended guides</h2>
                </div>
                <Badge variant="outline">{recommendation.recommendedGuides.length} guides</Badge>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {recommendation.recommendedGuides.map((guide) => (
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

            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h2 className="text-2xl font-bold text-foreground">Common pitfalls to avoid</h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {recommendation.guide.pitfalls.map((pitfall, index) => (
                  <PitfallCard key={index} title={`Pitfall ${index + 1}`} tip={pitfall} />
                ))}
              </div>
            </section>

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

            <section className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-4">Session ID: {sessionId}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/onboarding">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Start over
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/">Return home</Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-background noise-bg flex items-center justify-center px-4">
        <Card className="w-full max-w-lg border-destructive/40">
          <CardHeader>
            <CardTitle>Unable to load recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Something went wrong while loading your recommendation."}
            </p>
            <Button asChild>
              <Link href="/onboarding">Retake onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }
}
