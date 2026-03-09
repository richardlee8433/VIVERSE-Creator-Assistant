import { recordAnalyticsEvent } from '@/lib/analytics/store';
import { badRequest, internalError, ok } from '@/lib/utils/api';
import { parseJsonBody } from '@/lib/utils/request';

export async function POST(request: Request): Promise<Response> {
  const payload = await parseJsonBody(request);
  if (!payload.ok) return badRequest('Malformed JSON body');

  try {
    const result = await recordAnalyticsEvent(payload.data);
    if (!result.ok) return ok({ error: result.error }, 400);
    return ok({ success: true }, 200);
  } catch {
    return internalError('Failed to record analytics event');
  }
}
