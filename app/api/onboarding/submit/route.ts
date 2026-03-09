import { badRequest, ok } from '@/lib/utils/api';
import { parseJsonBody } from '@/lib/utils/request';
import { submitOnboarding } from '@/lib/api';

export async function POST(request: Request): Promise<Response> {
  const payload = await parseJsonBody(request);
  if (!payload.ok) return badRequest('Malformed JSON body');

  try {
    const result = await submitOnboarding(payload.data);
    return ok(result.body, result.status);
  } catch (error) {
    const details = error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : { error };
    console.error('[api/onboarding/submit] Failed to process onboarding submission', details);

    return Response.json(
      {
        error: 'Failed to process onboarding submission',
        errorCode: 'ONBOARDING_SUBMIT_INTERNAL',
      },
      { status: 500 },
    );
  }
}
