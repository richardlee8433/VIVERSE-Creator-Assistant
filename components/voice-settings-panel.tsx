"use client";

import { useMemo, useState } from "react";

interface VoiceSettingsPanelProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  ttsEnabled: boolean;
  onTtsToggle: (enabled: boolean) => void;
  sttEnabled: boolean;
  onSttToggle: (enabled: boolean) => void;
  onClose: () => void;
}

function Toggle({
  enabled,
  disabled,
  onChange,
}: {
  enabled: boolean;
  disabled?: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={[
        "relative h-6 w-11 rounded-full border transition-colors duration-200",
        enabled ? "bg-primary border-primary" : "bg-secondary border-border",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
      aria-pressed={enabled}
    >
      <span
        className={[
          "absolute top-0.5 h-4.5 w-4.5 rounded-full bg-primary-foreground transition-transform duration-200",
          enabled ? "translate-x-5" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
}

export function VoiceSettingsPanel({
  apiKey,
  onApiKeyChange,
  ttsEnabled,
  onTtsToggle,
  sttEnabled,
  onSttToggle,
  onClose,
}: VoiceSettingsPanelProps) {
  const [showKey, setShowKey] = useState(false);
  const hasKey = apiKey.length > 10;

  const keyStateText = useMemo(() => (hasKey ? "Key saved" : "No key"), [hasKey]);

  return (
    <div className="mb-2 bg-card border border-border/50 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">Voice settings</p>
          <p className="text-xs text-muted-foreground">Key is saved only for this browser session.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close voice settings"
        >
          ×
        </button>
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <label className="text-xs text-muted-foreground">OpenAI API key</label>
          <div className="mt-1.5 flex gap-2">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(event) => onApiKeyChange(event.target.value)}
              placeholder="sk-... (stored in sessionStorage only)"
              className="flex-1 bg-input border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            />
            <button
              type="button"
              onClick={() => setShowKey((prev) => !prev)}
              className="px-3 py-2 rounded-xl border border-border bg-secondary text-xs text-foreground"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs">
            <span
              className={[
                "w-2 h-2 rounded-full",
                hasKey ? "bg-primary" : "bg-secondary border border-border",
              ].join(" ")}
            />
            <span className="text-muted-foreground">{keyStateText}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground">Assistant voice (TTS)</p>
          <Toggle enabled={ttsEnabled} disabled={!hasKey} onChange={onTtsToggle} />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground">Microphone input (STT)</p>
          <Toggle enabled={sttEnabled} disabled={!hasKey} onChange={onSttToggle} />
        </div>
      </div>
    </div>
  );
}
