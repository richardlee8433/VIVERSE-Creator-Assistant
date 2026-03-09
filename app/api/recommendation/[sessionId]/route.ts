import { getRecommendation } from '@/lib/api';
import { internalError, ok } from '@/lib/utils/api';

export async function GET(_: Request, { params }: { params: { sessionId: string } }): Promise<Response> {
  try {
    const result = await getRecommendation(params.sessionId);
    return ok(result.body, result.status);
  } catch {
    return internalError('Failed to fetch recommendation');
  }
}
