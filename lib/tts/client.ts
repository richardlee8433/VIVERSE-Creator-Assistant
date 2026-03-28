let activeAudio: HTMLAudioElement | null = null;
let activeObjectUrl: string | null = null;

function stripMarkdown(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function stopSpeaking(): void {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio.src = "";
    activeAudio = null;
  }

  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }
}

export async function speakText(
  text: string,
  apiKey: string,
  options?: { voice?: string; model?: string; speed?: number }
): Promise<void> {
  if (!apiKey?.trim()) {
    throw new Error("TTS_NO_KEY");
  }

  const plainText = stripMarkdown(text);
  if (!plainText) return;

  stopSpeaking();

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options?.model ?? "tts-1",
      voice: options?.voice ?? "alloy",
      speed: options?.speed ?? 1.0,
      input: plainText,
    }),
  });

  if (!response.ok) {
    throw new Error(`TTS_API_ERROR:${response.status}`);
  }

  const audioBlob = await response.blob();
  const objectUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(objectUrl);

  activeAudio = audio;
  activeObjectUrl = objectUrl;

  await new Promise<void>((resolve, reject) => {
    audio.onended = () => {
      if (activeObjectUrl === objectUrl) {
        URL.revokeObjectURL(objectUrl);
        activeObjectUrl = null;
      }
      if (activeAudio === audio) {
        activeAudio = null;
      }
      resolve();
    };

    audio.onerror = () => {
      if (activeObjectUrl === objectUrl) {
        URL.revokeObjectURL(objectUrl);
        activeObjectUrl = null;
      }
      if (activeAudio === audio) {
        activeAudio = null;
      }
      reject(new Error("TTS_PLAYBACK_ERROR"));
    };

    void audio.play().catch((error: unknown) => {
      if (activeObjectUrl === objectUrl) {
        URL.revokeObjectURL(objectUrl);
        activeObjectUrl = null;
      }
      if (activeAudio === audio) {
        activeAudio = null;
      }
      reject(error instanceof Error ? error : new Error("TTS_PLAYBACK_ERROR"));
    });
  });
}
