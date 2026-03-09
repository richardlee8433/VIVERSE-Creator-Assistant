import type { PathId } from '@/lib/session/types';
import type { DocEntry } from '@/lib/docs/registry';

const stageOrder = ['intro', 'setup', 'first_build', 'publish', 'troubleshoot'];

export function byPath(path: PathId, docs: DocEntry[]): DocEntry[] {
  return docs.filter((doc) => doc.pathTags.includes(path));
}

export function stageRank(doc: DocEntry): number {
  const first = doc.taskStages[0] ?? 'troubleshoot';
  const rank = stageOrder.indexOf(first);
  return rank === -1 ? stageOrder.length : rank;
}
