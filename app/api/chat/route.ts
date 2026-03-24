import { submitOnboarding } from '@/lib/api';
import { generateJsonWithOpenAI } from '@/lib/llm/client';
import { VIVERSE_CREATOR_ASSISTANT_ONBOARDING_SYSTEM_PROMPT } from '@/lib/llm/prompts';
import { type FreeTextOnboardingAnswers, mapFreeTextAnswersToAPI } from '@/lib/utils/mapping';
import { parseJsonBody } from '@/lib/utils/request';
import { z } from 'zod';

const ALLOWED_FIELDS = ['goal', 'experience', 'workflow', 'assets', 'first_project_goal', 'biggest_concern'] as const;
type AllowedField = (typeof ALLOWED_FIELDS)[number];

type FollowupResponse = {
  type: 'followup';
  message: string;
  partial_answers?: Partial<Record<AllowedField, string | null>>;
  missing_fields?: AllowedField[];
};

type FinalResponse = {
  type: 'final';
  sessionId: string;
  answers: ReturnType<typeof mapFreeTextAnswersToAPI>;
  metadata?: Record<string, unknown>;
};

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1),
});

const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1),
});

function fallbackFollowup(message = 'Thanks — could you clarify your goal and your current experience level in one sentence?'): FollowupResponse {
  return { type: 'followup', message };
}

function asAllowedField(value: unknown): value is AllowedField {
  return typeof value === 'string' && ALLOWED_FIELDS.includes(value as AllowedField);
}

function buildConversationPrompt(messages: Array<{ role: 'user' | 'assistant'; content: string }>): string {
  return JSON.stringify(
    {
      task: 'Run conversational onboarding intake for VIVERSE Creator Assistant',
      instructions: 'Infer the six onboarding fields from the message history and return strict JSON according to the system contract.',
      messages,
    },
    null,
    2,
  );
}

function parseLLMJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function parseFollowupCandidate(candidate: unknown): FollowupResponse | null {
  if (!candidate || typeof candidate !== 'object') return null;
  const record = candidate as Record<string, unknown>;
  if (record.ready !== false || typeof record.assistant_message !== 'string' || !record.assistant_message.trim()) return null;

  const partial = record.partial_answers;
  const parsedPartial: Partial<Record<AllowedField, string | null>> = {};
  if (partial && typeof partial === 'object') {
    for (const field of ALLOWED_FIELDS) {
      const value = (partial as Record<string, unknown>)[field];
      if (typeof value === 'string' || value === null) parsedPartial[field] = value;
    }
  }

  const missing_fields = Array.isArray(record.missing_fields)
    ? record.missing_fields.filter(asAllowedField)
    : undefined;

  return {
    type: 'followup',
    message: record.assistant_message,
    partial_answers: Object.keys(parsedPartial).length ? parsedPartial : undefined,
    missing_fields,
  };
}

function parseFinalAnswers(candidate: unknown): FreeTextOnboardingAnswers | null {
  if (!candidate || typeof candidate !== 'object') return null;
  const record = candidate as Record<string, unknown>;
  if (record.ready !== true || !record.answers || typeof record.answers !== 'object') return null;

  const answerRecord = record.answers as Record<string, unknown>;
  const answers = {} as FreeTextOnboardingAnswers;

  for (const field of ALLOWED_FIELDS) {
    const value = answerRecord[field];
    if (typeof value !== 'string' || !value.trim()) return null;
    answers[field] = value;
  }

  return answers;
}

function toMetadata(body: Record<string, unknown>): Record<string, unknown> {
  const { recommendationSnapshot, ...rest } = body;
  return rest;
}

export async function POST(request: Request): Promise<Response> {
  const payload = await parseJsonBody(request);
  if (!payload.ok) return Response.json({ error: 'Malformed JSON body' }, { status: 400 });

  const parsedPayload = chatRequestSchema.safeParse(payload.data);
  if (!parsedPayload.success) return Response.json({ error: 'Invalid chat payload' }, { status: 400 });

  let rawLLMOutput = '';
  try {
    rawLLMOutput = await generateJsonWithOpenAI(
      VIVERSE_CREATOR_ASSISTANT_ONBOARDING_SYSTEM_PROMPT,
      buildConversationPrompt(parsedPayload.data.messages),
    );
  } catch (error) {
    const details = error instanceof Error ? { name: error.name, message: error.message } : { error };
    console.error('[api/chat] LLM request failed', details);
    return Response.json(fallbackFollowup('I may have missed that. Could you restate what you want to build first?'));
  }

  const llmJson = parseLLMJson(rawLLMOutput);
  if (!llmJson) {
    console.warn('[api/chat] Received invalid JSON from LLM');
    return Response.json(fallbackFollowup('Could you clarify your background and what you want to build in VIVERSE?'));
  }

  const followup = parseFollowupCandidate(llmJson);
  if (followup) {
    return Response.json(followup);
  }

  const extractedAnswers = parseFinalAnswers(llmJson);
  if (!extractedAnswers) {
    console.warn('[api/chat] LLM response missing required fields for follow-up/final branches');
    return Response.json(fallbackFollowup('Thanks! Could you share a bit more about your assets and first project goal?'));
  }

  const mappedAnswers = mapFreeTextAnswersToAPI(extractedAnswers);

  try {
    const submitResult = await submitOnboarding({ answers: mappedAnswers });
    if (submitResult.status !== 200) {
      console.error('[api/chat] submitOnboarding returned non-success', {
        status: submitResult.status,
        body: submitResult.body,
      });
      return Response.json({ error: 'Failed to complete onboarding submission' }, { status: 500 });
    }

    const sessionId = submitResult?.body?.sessionId;
    if (typeof sessionId !== 'string' || !sessionId.trim()) {
      console.error('[api/chat] submitOnboarding response missing sessionId', {
        status: submitResult.status,
        body: submitResult.body,
      });
      return Response.json({ error: 'Failed to complete onboarding submission' }, { status: 500 });
    }

    const response = Response.json({
      type: 'final',
      sessionId,
      answers: mappedAnswers,
      metadata: toMetadata(submitResult.body as Record<string, unknown>),
    } satisfies FinalResponse);

    if ('recommendationSnapshot' in submitResult.body) {
      response.headers.set(
        'Set-Cookie',
        `vca_recommendation_cache=${encodeURIComponent(JSON.stringify(submitResult.body.recommendationSnapshot))}; Path=/; Max-Age=900; SameSite=Lax`,
      );
    }

    return response;
  } catch (error) {
    const details = error instanceof Error ? { name: error.name, message: error.message } : { error };
    console.error('[api/chat] Failed to complete onboarding submission', details);
    return Response.json({ error: 'Failed to complete onboarding submission' }, { status: 500 });
  }
}
