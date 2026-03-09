import { badRequest, internalError, ok } from '@/lib/utils/api';
import { parseJsonBody } from '@/lib/utils/request';
import { submitOnboarding } from '@/lib/api';
import { SessionStoreError } from '@/lib/session/store';

const ONBOARDING_ERROR_CODES = {
  INTERNAL: 'ONBOARDING_INTERNAL_ERROR',
  SCHEMA: 'ONBOARDING_SCHEMA_ERROR',
  STORE: 'ONBOARDING_STORE_ERROR',
} as const;

function inferOnboardingErrorCode(error: unknown): string {
  if (error instanceof SessionStoreError) return ONBOARDING_ERROR_CODES.STORE;
  if (error instanceof Error) {
    if (error.name === 'ZodError' || /schema|validation/i.test(error.message)) {
      return ONBOARDING_ERROR_CODES.SCHEMA;
    }
  }

  return ONBOARDING_ERROR_CODES.INTERNAL;
}

function serializeError(error: unknown): Record<string, string> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack ?? 'No stack trace',
    };
  }

  return {
    name: 'NonErrorThrown',
    message: typeof error === 'string' ? error : 'Unknown error type',
    stack: 'No stack trace',
  };
}

export async function POST(request: Request): Promise<Response> {
  const payload = await parseJsonBody(request);
  if (!payload.ok) return badRequest('Malformed JSON body');

  try {
    const result = await submitOnboarding(payload.data);
    return ok(result.body, result.status);
  } catch (error) {
    const errorCode = inferOnboardingErrorCode(error);
    console.error('[onboarding/submit] Failed to process onboarding submission', {
      errorCode,
      error: serializeError(error),
    });

    return internalError('Failed to process onboarding submission', errorCode);
  }
}
