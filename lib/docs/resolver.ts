import type { PathId, RecommendedGuide } from '@/lib/session/types';
import { byPath, stageRank } from '@/lib/docs/filters';
import { loadDocsRegistry } from '@/lib/docs/registry';

function reasonForStage(stage: string): string {
  if (stage === 'intro') return 'Best overview to start your path quickly';
  if (stage === 'setup') return 'Best first setup step for your path';
  if (stage === 'first_build') return 'Most relevant first build milestone';
  if (stage === 'publish') return 'Useful when you are ready to share';
  return 'Helpful supporting guide for onboarding';
}

export function resolveRecommendedDocs(path: PathId): RecommendedGuide[] {
  const docs = byPath(path, loadDocsRegistry())
    .sort((a, b) => {
      const stageDiff = stageRank(a) - stageRank(b);
      if (stageDiff !== 0) return stageDiff;
      return b.priority - a.priority;
    })
    .slice(0, 5);

  return docs.map((doc) => ({
    id: doc.id,
    title: doc.title,
    url: `/guides/${doc.id}`,
    sourceUrl: doc.sourceUrl ?? doc.url,
    reason: reasonForStage(doc.taskStages[0] ?? ''),
    taskStage: doc.taskStages[0] ?? 'misc',
    summary: doc.summary,
  }));
}
