import { getRecommendation } from "@/lib/api";
import { internalError, ok } from "@/lib/utils/api";
import type { NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
): Promise<Response> {
  try {
    const { sessionId } = await context.params;
    const result = await getRecommendation(sessionId);
    return ok(result.body, result.status);
  } catch {
    return internalError("Failed to fetch recommendation");
  }
}
