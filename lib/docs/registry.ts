import docData from '@/data/docs-registry.json';
import type { PathId } from '@/lib/session/types';

export type DocEntry = {
  id: string;
  title: string;
  url: string;
  sourceUrl?: string;
  pathTags: PathId[];
  audienceLevels: string[];
  taskStages: string[];
  contentType: string;
  summary: string;
  priority: number;
};

export function loadDocsRegistry(): DocEntry[] {
  return (docData.docs ?? []) as DocEntry[];
}
