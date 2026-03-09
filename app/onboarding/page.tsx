"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { OptionButton } from "@/components/option-button";
import { onboardingQuestions } from "@/lib/mock-data";
import { ArrowLeft, ArrowRight, Clock, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = onboardingQuestions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentQuestion = onboardingQuestions[currentStep];
  const selectedAnswer = answers[currentQuestion.id];
  const isLastStep = currentStep === totalSteps - 1;

  const handleOptionSelect = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Generate a mock session ID
    const sessionId = "demo-session-" + Date.now();
    router.push(`/result/${sessionId}`);
  };

  return (
    <main className="min-h-screen bg-background noise-bg flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 gradient-radial pointer-events-none" />
      <div className="fixed inset-0 gradient-mesh opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 glass">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to home</span>
            </Link>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>2–3 min</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-xl space-y-8">
          {/* Progress section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Question {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-primary font-medium">
                {Math.round(progress)}% complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question card */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">
                {currentQuestion.question}
              </h1>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <OptionButton
                    key={option.id}
                    label={option.label}
                    selected={selectedAnswer === option.id}
                    onClick={() => handleOptionSelect(option.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!selectedAnswer || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : isLastStep ? (
                "Get my recommendation"
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2">
            {onboardingQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index < currentStep || answers[onboardingQuestions[index].id]) {
                    setCurrentStep(index);
                  }
                }}
                disabled={index > currentStep && !answers[onboardingQuestions[index].id]}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-8 bg-primary glow-cyan-subtle"
                    : index < currentStep || answers[onboardingQuestions[index].id]
                    ? "w-2 bg-primary/50 hover:bg-primary/70 cursor-pointer"
                    : "w-2 bg-secondary"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
