import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname } from 'node:path';
import type { SessionRecord } from '@/lib/session/types';

type SessionIndex = Record<string, SessionRecord>;

type StoreOperation = 'create' | 'readAll' | 'writeAll' | 'ensureFile';
type StorePhase = 'init' | 'read' | 'write';

export class SessionStoreError extends Error {
  constructor(
    operation: StoreOperation,
    phase: StorePhase,
    filePath: string,
    cause: unknown,
  ) {
    const detail = cause instanceof Error ? `${cause.name}: ${cause.message}` : String(cause);
    super(`Session store error (operation=${operation}, phase=${phase}, path=${filePath}): ${detail}`);
    this.name = 'SessionStoreError';
    this.cause = cause;
  }
}

export interface SessionStore {
  create(session: Omit<SessionRecord, 'sessionId' | 'createdAt'>): Promise<SessionRecord>;
  get(sessionId: string): Promise<SessionRecord | null>;
}

function resolveStorePath(): string {
  return process.env.SESSION_STORE_PATH ?? './data/sessions.json';
}

async function ensureFile(path: string): Promise<void> {
  try {
    await mkdir(dirname(path), { recursive: true });
    try {
      await readFile(path, 'utf8');
    } catch {
      await writeFile(path, JSON.stringify({}, null, 2), 'utf8');
    }
  } catch (error) {
    throw new SessionStoreError('ensureFile', 'init', path, error);
  }
}

export class FileSessionStore implements SessionStore {
  constructor(private readonly filePath = resolveStorePath()) {}

  private async readAll(): Promise<SessionIndex> {
    try {
      await ensureFile(this.filePath);
      const raw = await readFile(this.filePath, 'utf8');

      try {
        return JSON.parse(raw) as SessionIndex;
      } catch {
        await this.writeAll({});
        return {};
      }
    } catch (error) {
      if (error instanceof SessionStoreError) throw error;
      throw new SessionStoreError('readAll', 'read', this.filePath, error);
    }
  }

  private async writeAll(data: SessionIndex): Promise<void> {
    try {
      await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      throw new SessionStoreError('writeAll', 'write', this.filePath, error);
    }
  }

  async create(session: Omit<SessionRecord, 'sessionId' | 'createdAt'>): Promise<SessionRecord> {
    try {
      const sessionId = randomUUID();
      const createdAt = new Date().toISOString();
      const record: SessionRecord = { ...session, sessionId, createdAt };
      const all = await this.readAll();
      all[sessionId] = record;
      await this.writeAll(all);
      return record;
    } catch (error) {
      if (error instanceof SessionStoreError) throw error;
      throw new SessionStoreError('create', 'write', this.filePath, error);
    }
  }

  async get(sessionId: string): Promise<SessionRecord | null> {
    const all = await this.readAll();
    return all[sessionId] ?? null;
  }
}

export function getSessionStore(): SessionStore {
  return new FileSessionStore();
}
