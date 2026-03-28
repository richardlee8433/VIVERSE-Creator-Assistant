let mediaRecorder: MediaRecorder | null = null;
let mediaStream: MediaStream | null = null;
let recordedChunks: BlobPart[] = [];
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const MAX_RECORDING_MS = 60_000;

function stopMediaTracks(): void {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
}

function clearRecordingTimeout(): void {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

function getMimeType(): string {
  if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
    return "audio/webm;codecs=opus";
  }
  if (MediaRecorder.isTypeSupported("audio/webm")) {
    return "audio/webm";
  }
  if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
    return "audio/ogg;codecs=opus";
  }
  return "audio/ogg";
}

export function isRecording(): boolean {
  return mediaRecorder?.state === "recording";
}

export async function startRecording(): Promise<void> {
  if (isRecording()) return;

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    throw new Error("STT_MIC_DENIED");
  }

  recordedChunks = [];
  mediaRecorder = new MediaRecorder(mediaStream, { mimeType: getMimeType() });

  mediaRecorder.addEventListener("dataavailable", (event: BlobEvent) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  });

  mediaRecorder.addEventListener("stop", () => {
    clearRecordingTimeout();
    stopMediaTracks();
  });

  timeoutId = setTimeout(() => {
    if (mediaRecorder?.state === "recording") {
      mediaRecorder.stop();
    }
  }, MAX_RECORDING_MS);

  mediaRecorder.start();
}

async function waitForRecorderToStop(): Promise<void> {
  if (!mediaRecorder || mediaRecorder.state === "inactive") return;

  await new Promise<void>((resolve) => {
    mediaRecorder?.addEventListener("stop", () => resolve(), { once: true });
    mediaRecorder?.stop();
  });
}

export function cancelRecording(): void {
  clearRecordingTimeout();

  if (mediaRecorder?.state === "recording") {
    mediaRecorder.stop();
  }

  stopMediaTracks();
  recordedChunks = [];
  mediaRecorder = null;
}

export async function stopRecordingAndTranscribe(apiKey: string): Promise<string> {
  if (!apiKey?.trim()) {
    throw new Error("STT_NO_KEY");
  }

  await waitForRecorderToStop();

  if (recordedChunks.length === 0) {
    mediaRecorder = null;
    return "";
  }

  const mimeType = mediaRecorder?.mimeType || "audio/webm";
  const extension = mimeType.includes("ogg") ? "ogg" : "webm";
  const audioBlob = new Blob(recordedChunks, { type: mimeType });
  const file = new File([audioBlob], `recording.${extension}`, { type: mimeType });

  recordedChunks = [];
  mediaRecorder = null;

  const formData = new FormData();
  formData.append("model", "whisper-1");
  formData.append("file", file);

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`STT_API_ERROR:${response.status}`);
  }

  const data: unknown = await response.json();
  if (typeof data === "object" && data !== null && "text" in data) {
    const text = (data as { text?: unknown }).text;
    return typeof text === "string" ? text.trim() : "";
  }

  return "";
}
