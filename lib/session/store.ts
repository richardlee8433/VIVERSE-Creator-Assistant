import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname } from 'node:path';
import type { SessionRecord } from '@/lib/session/types';

type SessionIndex = Record<string, SessionRecord>;

export interface SessionStore {
  create(session: Omit<SessionRecord, 'sessionId' | 'createdAt'>): Promise<SessionRecord>;
  get(sessionId: string): Promise<SessionRecord | null>;
}

function resolveStorePath(): string {
  return process.env.SESSION_STORE_PATH ?? './data/sessions.json';
}

async function ensureFile(path: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  try {
    await readFile(path, 'utf8');
  } catch {
    await writeFile(path, JSON.stringify({}, null, 2), 'utf8');
  }
}

export class FileSessionStore implements SessionStore {
  constructor(private readonly filePath = resolveStorePath()) {}

  private async readAll(): Promise<SessionIndex> {
    await ensureFile(this.filePath);
    const raw = await readFile(this.filePath, 'utf8');
    return JSON.parse(raw) as SessionIndex;
  }

  private async writeAll(data: SessionIndex): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async create(session: Omit<SessionRecord, 'sessionId' | 'createdAt'>): Promise<SessionRecord> {
    const sessionId = randomUUID();
    const createdAt = new Date().toISOString();
    const record: SessionRecord = { ...session, sessionId, createdAt };
    const all = await this.readAll();
    all[sessionId] = record;
    await this.writeAll(all);
    return record;
  }

  async get(sessionId: string): Promise<SessionRecord | null> {
    const all = await this.readAll();
    return all[sessionId] ?? null;
  }
}

export function getSessionStore(): SessionStore {
  return new FileSessionStore();
}
