import { appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { analyticsEventSchema } from '@/lib/analytics/events';

const ANALYTICS_PATH = process.env.ANALYTICS_STORE_PATH ?? './data/analytics.log';

export async function recordAnalyticsEvent(payload: unknown): Promise<{ ok: boolean; error?: string }> {
  const parsed = analyticsEventSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid analytics payload' };
  }

  const event = { ...parsed.data, createdAt: new Date().toISOString() };
  await mkdir(dirname(ANALYTICS_PATH), { recursive: true });
  await appendFile(ANALYTICS_PATH, `${JSON.stringify(event)}\n`, 'utf8');
  return { ok: true };
}
