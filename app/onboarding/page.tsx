"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Send, Loader2, Mic, MicOff, Settings2 } from "lucide-react";
import { mapUIAnswersToAPI, type OnboardingUIAnswers } from "@/lib/utils/mapping";
import { speakText, stopSpeaking } from "@/lib/tts/client";
import {
  startRecording,
  stopRecordingAndTranscribe,
  cancelRecording,
  isRecording,
} from "@/lib/stt/client";
import { VoiceSettingsPanel } from "@/components/voice-settings-panel";

// ─── Types ────────────────────────────────────────────────────────────────────

type Option = {
  id: string;
  label: string;
};

type Question = {
  id: number;
  message: string;
  placeholder: string;
  options: Option[];
};

type Answer = {
  id: string | null; // null when free-text
  label: string;
};

type Message =
  | { role: "assistant"; content: string }
  | { role: "user"; content: string }
  | { role: "typing" };

// ─── Questions ────────────────────────────────────────────────────────────────

const questions: Question[] = [
  {
    id: 1,
    message:
      "Hi! I'm your VIVERSE Creator Assistant 👋\n\nLet's find the best path for you. First — **what do you want to create?**",
    placeholder: "e.g. a virtual concert venue, a 3D portfolio…",
    options: [
      { id: "virtual-space",          label: "A virtual space or world" },
      { id: "interactive-experience", label: "An interactive experience or game" },
      { id: "3d-showcase",            label: "A 3D showcase or portfolio" },
      { id: "social-venue",           label: "A social event venue" },
    ],
  },
  {
    id: 2,
    message: "Got it! Now, **what's your experience with 3D or development?**",
    placeholder: "e.g. I've used Blender before but never coded…",
    options: [
      { id: "beginner",  label: "Complete beginner" },
      { id: "some-3d",   label: "Some 3D experience" },
      { id: "developer", label: "Experienced developer" },
      { id: "3d-artist", label: "Professional 3D artist" },
    ],
  },
  {
    id: 3,
    message: "Helpful, thanks! **How do you prefer to build things?**",
    placeholder: "e.g. I like drag-and-drop, no coding for me…",
    options: [
      { id: "visual",    label: "Visual drag-and-drop" },
      { id: "templates", label: "Starting from templates" },
      { id: "code",      label: "Writing code" },
      { id: "import",    label: "Importing existing assets" },
    ],
  },
  {
    id: 4,
    message: "Nice. **What do you already have to work with?**",
    placeholder: "e.g. I have a Unity project ready to port…",
    options: [
      { id: "nothing",          label: "Nothing yet" },
      { id: "3d-assets",        label: "3D models or assets" },
      { id: "design",           label: "Design mockups" },
      { id: "existing-project", label: "An existing project" },
    ],
  },
  {
    id: 5,
    message: "Almost there! **What's your goal for the first project?**",
    placeholder: "e.g. I want to publish something real this month…",
    options: [
      { id: "learn",     label: "Learn the platform" },
      { id: "prototype", label: "Build a quick prototype" },
      { id: "publish",   label: "Publish something real" },
      { id: "evaluate",  label: "Evaluate for a bigger project" },
    ],
  },
  {
    id: 6,
    message: "Last one — **what concerns you most right now?**",
    placeholder: "e.g. I'm worried about the learning curve…",
    options: [
      { id: "complexity",  label: "Technical complexity" },
      { id: "time",        label: "Time to first result" },
      { id: "quality",     label: "Output quality" },
      { id: "scalability", label: "Scalability and features" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

/** Converts **bold** and \n in question messages to JSX */
function renderBold(text: string) {
  return text.split("\n").map((line, li) => (
    <span key={li}>
      {li > 0 && <br />}
      {line.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      )}
    </span>
  ));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar() {
  return (
    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-[0.7rem] glow-cyan-subtle">
      V
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: `${delay}ms`, animationDuration: "1.2s" }}
        />
      ))}
    </div>
  );
}

function AssistantBubble({ content }: { content: string }) {
  return (
    <div className="flex gap-2.5 items-end animate-in fade-in slide-in-from-bottom-1 duration-300">
      <Avatar />
      <div className="max-w-[min(78%,26rem)] px-4 py-3 rounded-2xl rounded-bl-sm bg-card border border-border/50 text-sm leading-relaxed">
        {renderBold(content)}
      </div>
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end animate-in fade-in slide-in-from-bottom-1 duration-300">
      <div className="max-w-[min(78%,26rem)] px-4 py-3 rounded-2xl rounded-br-sm bg-primary/12 border border-primary/25 text-sm leading-relaxed">
        {content}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex gap-2.5 items-end animate-in fade-in duration-200">
      <Avatar />
      <div className="bg-card border border-border/50 rounded-2xl rounded-bl-sm">
        <TypingIndicator />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();

  const [messages, setMessages]         = useState<Message[]>([]);
  const [currentStep, setCurrentStep]   = useState(0);
  const [answers, setAnswers]           = useState<Record<number, Answer>>({});
  const [chips, setChips]               = useState<Option[]>([]);
  const [selectedChipId, setSelectedChipId] = useState<string | null>(null);
  const [locked, setLocked]             = useState(true);
  const [inputValue, setInputValue]     = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);
  const [isDone, setIsDone]             = useState(false);
  const [apiKey, setApiKey]             = useState<string>("");
  const [ttsEnabled, setTtsEnabled]     = useState(false);
  const [sttEnabled, setSttEnabled]     = useState(false);
  const [isListening, setIsListening]   = useState(false);
  const [isSpeaking, setIsSpeaking]     = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [sttError, setSttError]         = useState<string | null>(null);

  const chatEndRef  = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chips]);

  // auto-resize textarea
  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 112) + "px";
  }

  // ── append helpers ──────────────────────────────────────────────────────────

  function addMessage(msg: Message) {
    setMessages((prev) => [...prev, msg]);
  }

  function removeTyping() {
    setMessages((prev) => prev.filter((m) => m.role !== "typing"));
  }

  const maybeSpeakAssistantMessage = useCallback(
    async (content: string) => {
      if (!ttsEnabled || !apiKey.trim()) return;
      try {
        setIsSpeaking(true);
        await speakText(content, apiKey);
      } catch {
        // Non-blocking for chat UX.
      } finally {
        setIsSpeaking(false);
      }
    },
    [ttsEnabled, apiKey]
  );

  // ── init: show first question ───────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    async function start() {
      addMessage({ role: "typing" });
      await sleep(650);
      if (cancelled) return;
      removeTyping();
      const firstMessage = questions[0].message;
      addMessage({ role: "assistant", content: firstMessage });
      void maybeSpeakAssistantMessage(firstMessage);
      setChips(questions[0].options);
      setLocked(false);
    }
    start();
    return () => { cancelled = true; };
  }, [maybeSpeakAssistantMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const savedKey = sessionStorage.getItem("viverse_openai_key") ?? "";
    setApiKey(savedKey);
  }, []);

  useEffect(() => {
    if (apiKey.trim()) {
      sessionStorage.setItem("viverse_openai_key", apiKey.trim());
      return;
    }
    sessionStorage.removeItem("viverse_openai_key");
    setTtsEnabled(false);
    setSttEnabled(false);
  }, [apiKey]);

  useEffect(() => {
    if (!locked) return;
    stopSpeaking();
    setIsSpeaking(false);
  }, [locked]);

  useEffect(() => {
    if (!sttError) return;
    const timer = window.setTimeout(() => setSttError(null), 4000);
    return () => window.clearTimeout(timer);
  }, [sttError]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      cancelRecording();
    };
  }, []);

  // ── core: handle any answer (chip OR typed) ─────────────────────────────────

  const submitAnswer = useCallback(
    async (displayText: string, optionId: string | null) => {
      if (locked) return;
      setLocked(true);
      setSelectedChipId(optionId);

      await sleep(120);

      // user bubble
      addMessage({ role: "user", content: displayText });
      setChips([]);
      setSelectedChipId(null);
      setInputValue("");

      const stepIndex = currentStep;
      const newAnswers = {
        ...answers,
        [questions[stepIndex].id]: { id: optionId, label: displayText },
      };
      setAnswers(newAnswers);

      const nextStep = stepIndex + 1;
      setCurrentStep(nextStep);

      if (nextStep < questions.length) {
        await sleep(320);
        addMessage({ role: "typing" });
        await sleep(500 + Math.random() * 250);
        removeTyping();
        const nextMessage = questions[nextStep].message;
        addMessage({ role: "assistant", content: nextMessage });
        void maybeSpeakAssistantMessage(nextMessage);
        setChips(questions[nextStep].options);
        setLocked(false);
      } else {
        // all 6 done — show summary bubble then submit
        await sleep(320);
        addMessage({ role: "typing" });
        await sleep(700);
        removeTyping();
        addMessage({
          role: "assistant",
          content:
            "Great, I have everything I need! Let me find your recommended path…",
        });
        void maybeSpeakAssistantMessage("Great, I have everything I need! Let me find your recommended path…");
        setIsDone(true);

        // fire the real API call
        await handleFinalSubmit(newAnswers);
      }
    },
    [locked, currentStep, answers, maybeSpeakAssistantMessage] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── final API submit ────────────────────────────────────────────────────────

  async function handleFinalSubmit(finalAnswers: Record<number, Answer>) {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Map question IDs (1-6) to UI answer IDs, then convert to API enums
      const uiAnswers: OnboardingUIAnswers = {
        goal:               (finalAnswers[1]?.id ?? "virtual-space") as OnboardingUIAnswers["goal"],
        experience:         (finalAnswers[2]?.id ?? "beginner")       as OnboardingUIAnswers["experience"],
        workflow:           (finalAnswers[3]?.id ?? "visual")         as OnboardingUIAnswers["workflow"],
        assets:             (finalAnswers[4]?.id ?? "nothing")        as OnboardingUIAnswers["assets"],
        first_project_goal: (finalAnswers[5]?.id ?? "learn")          as OnboardingUIAnswers["first_project_goal"],
        biggest_concern:    (finalAnswers[6]?.id ?? "complexity")     as OnboardingUIAnswers["biggest_concern"],
      };

      // Free-text answers (optionId === null) fall back to the default enum above.
      // TODO: replace defaults with LLM-based mapping once lib/utils/mapping supports free text.

      const mappedAnswers = mapUIAnswersToAPI(uiAnswers);

      const response = await fetch("/api/onboarding/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: mappedAnswers }),
      });

      const data = await response.json();
      if (!response.ok || !data?.sessionId) {
        throw new Error(data?.error ?? "Failed to submit onboarding answers");
      }

      router.push(`/result/${data.sessionId}`);
    } catch (err) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(msg);
      addMessage({
        role: "assistant",
        content: `Hmm, something went wrong: ${msg}\n\nPlease try again.`,
      });
      void maybeSpeakAssistantMessage(`Hmm, something went wrong: ${msg}. Please try again.`);
      setIsDone(false);
      setLocked(false);
    }
  }

  async function handleMicClick() {
    if (!sttEnabled || !apiKey.trim()) return;

    if (!isRecording()) {
      try {
        setSttError(null);
        await startRecording();
        setIsListening(true);
        window.setTimeout(() => {
          if (!isRecording()) return;
          void stopRecordingAndTranscribe(apiKey)
            .then((transcript) => {
              setInputValue(transcript);
              autoResize();
            })
            .catch(() => {
              setSttError("Voice input failed. Please type your answer instead.");
            })
            .finally(() => {
              setIsListening(false);
            });
        }, 60_000);
      } catch (error) {
        const errorMessage =
          error instanceof Error && error.message === "STT_MIC_DENIED"
            ? "Microphone access denied — please allow microphone in browser settings."
            : "Voice input failed. Please type your answer instead.";
        setSttError(errorMessage);
        setIsListening(false);
      }
      return;
    }

    try {
      const transcript = await stopRecordingAndTranscribe(apiKey);
      setInputValue(transcript);
      autoResize();
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message === "STT_MIC_DENIED"
          ? "Microphone access denied — please allow microphone in browser settings."
          : "Voice input failed. Please type your answer instead.";
      setSttError(errorMessage);
    } finally {
      setIsListening(false);
    }
  }

  // ── keyboard handler ────────────────────────────────────────────────────────

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !locked) {
        submitAnswer(inputValue.trim(), null);
      }
    }
  }

  // ── progress ────────────────────────────────────────────────────────────────

  const progress = Math.round((currentStep / questions.length) * 100);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen h-dvh bg-background noise-bg flex flex-col overflow-hidden">
      {/* background */}
      <div className="fixed inset-0 gradient-radial pointer-events-none" />
      <div className="fixed inset-0 gradient-mesh opacity-30 pointer-events-none" />

      {/* ── header ── */}
      <header className="relative z-10 border-b border-border/50 glass flex-shrink-0">
        <div className="mx-auto max-w-2xl px-5">
          <div className="flex items-center justify-between h-15">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to home
            </Link>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Clock className="w-3.5 h-3.5" />
              2–3 min
            </div>
          </div>
        </div>
      </header>

      {/* ── progress ── */}
      <div className="relative z-10 flex-shrink-0 mx-auto max-w-2xl w-full px-5 pt-2.5">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">
            {currentStep < questions.length
              ? `Question ${currentStep + 1} of ${questions.length}`
              : "All done!"}
          </span>
          <span className="text-primary font-medium">{progress}% complete</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary glow-cyan-subtle transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── chat messages ── */}
      <div className="relative z-10 flex-1 overflow-y-auto mx-auto max-w-2xl w-full px-5 py-4 flex flex-col gap-3.5">
        {messages.map((msg, i) => {
          if (msg.role === "typing")    return <TypingBubble key={`typing-${i}`} />;
          if (msg.role === "assistant") return <AssistantBubble key={i} content={msg.content} />;
          if (msg.role === "user")      return <UserBubble key={i} content={msg.content} />;
          return null;
        })}
        <div ref={chatEndRef} />
      </div>

      {/* ── chips ── */}
      {chips.length > 0 && (
        <div className="relative z-10 flex-shrink-0 mx-auto max-w-2xl w-full px-5 pb-1 flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-bottom-1 duration-300">
          {chips.map((opt) => (
            <button
              key={opt.id}
              disabled={locked}
              onClick={() => submitAnswer(opt.label, opt.id)}
              className={[
                "px-3.5 py-1.5 rounded-xl border text-sm transition-all duration-150 whitespace-nowrap",
                selectedChipId === opt.id
                  ? "border-primary bg-primary/12 text-primary glow-cyan-subtle"
                  : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/6 hover:text-primary",
                locked ? "pointer-events-none opacity-50" : "",
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* ── step dots ── */}
      <div className="relative z-10 flex-shrink-0 flex justify-center gap-1.5 py-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className={[
              "h-1.5 rounded-full transition-all duration-300",
              i < currentStep
                ? "w-1.5 bg-primary/50"
                : i === currentStep
                ? "w-7 bg-primary glow-cyan-subtle"
                : "w-1.5 bg-secondary",
            ].join(" ")}
          />
        ))}
      </div>

      {/* ── input row ── */}
      <div className="relative z-10 flex-shrink-0 mx-auto max-w-2xl w-full px-5 pb-4">
        {showVoiceSettings && (
          <VoiceSettingsPanel
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            ttsEnabled={ttsEnabled}
            onTtsToggle={setTtsEnabled}
            sttEnabled={sttEnabled}
            onSttToggle={setSttEnabled}
            onClose={() => setShowVoiceSettings(false)}
          />
        )}

        {/* hint */}
        <p className="text-[0.6875rem] text-muted-foreground mb-1.5 transition-opacity duration-200"
           style={{ opacity: locked && !isDone ? 0 : 1 }}>
          {isDone
            ? "Analyzing your answers…"
            : isSpeaking
            ? "Assistant is speaking…"
            : "or type your own answer (Shift+Enter for new line)"}
        </p>

        <div className="flex gap-2 items-end">
          <button
            type="button"
            disabled={!sttEnabled || !apiKey.trim()}
            onClick={handleMicClick}
            aria-label={isListening ? "Stop microphone recording" : "Start microphone recording"}
            className={[
              "relative flex-shrink-0 w-11 h-11 rounded-2xl border flex items-center justify-center transition-all duration-200",
              !sttEnabled || !apiKey.trim()
                ? "opacity-40 cursor-not-allowed bg-secondary border-border text-muted-foreground"
                : isListening
                ? "border-destructive bg-secondary text-destructive"
                : "bg-secondary border-border text-foreground",
            ].join(" ")}
          >
            {isListening && (
              <span className="absolute inset-0 rounded-2xl border border-destructive animate-ping" />
            )}
            {isListening ? <MicOff className="w-4 h-4 relative z-10" /> : <Mic className="w-4 h-4" />}
          </button>

          <textarea
            ref={textareaRef}
            value={inputValue}
            disabled={locked}
            placeholder={
              isDone
                ? "Redirecting to your results…"
                : currentStep < questions.length
                ? questions[currentStep]?.placeholder
                : "Type a follow-up question…"
            }
            rows={1}
            className="flex-1 bg-input border border-border rounded-2xl text-foreground font-sans text-sm leading-relaxed px-4 py-2.5 resize-none outline-none min-h-11 max-h-28 overflow-y-auto transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/8 placeholder:text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed scrollbar-none"
            onChange={(e) => {
              setInputValue(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            disabled={locked || !inputValue.trim() || isSubmitting}
            onClick={() => {
              if (inputValue.trim() && !locked) submitAnswer(inputValue.trim(), null);
            }}
            className="flex-shrink-0 w-11 h-11 rounded-2xl border-none bg-primary text-primary-foreground flex items-center justify-center transition-all duration-200 glow-cyan-subtle hover:glow-cyan disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none"
            aria-label="Send"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowVoiceSettings((prev) => !prev)}
            aria-label="Toggle voice settings"
            className="relative flex-shrink-0 w-11 h-11 rounded-2xl border border-border bg-secondary text-foreground flex items-center justify-center transition-colors hover:border-primary/50"
          >
            {(ttsEnabled || sttEnabled) && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
            )}
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        {sttError && <p className="mt-2 text-xs text-destructive">{sttError}</p>}

        {submitError && (
          <p className="mt-2 text-xs text-destructive text-center">{submitError}</p>
        )}
      </div>
    </main>
  );
}
