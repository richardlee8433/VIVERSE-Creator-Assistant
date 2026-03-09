import { badRequest, internalError, ok } from '@/lib/utils/api';
import { parseJsonBody } from '@/lib/utils/request';
import { submitOnboarding } from '@/lib/api';

export async function POST(request: Request): Promise<Response> {
  const payload = await parseJsonBody(request);
  if (!payload.ok) return badRequest('Malformed JSON body');

  try {
    const result = await submitOnboarding(payload.data);
    return ok(result.body, result.status);
  } catch {
    return internalError('Failed to process onboarding submission');
  }
}
