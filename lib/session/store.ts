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
  if (process.env.SESSION_STORE_PATH) return process.env.SESSION_STORE_PATH;
  return process.env.NODE_ENV === 'production' ? '/tmp/viverse-sessions.json' : './data/sessions.json';
}

class SessionStoreError extends Error {
  constructor(
    message: string,
    readonly stage: 'init' | 'read' | 'write' | 'create' | 'get',
    readonly filePath: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'SessionStoreError';
  }
}

async function ensureFile(path: string): Promise<void> {
  try {
    await mkdir(dirname(path), { recursive: true });
    await readFile(path, 'utf8');
  } catch (error) {
    try {
      await writeFile(path, JSON.stringify({}, null, 2), 'utf8');
    } catch (writeError) {
      throw new SessionStoreError(
        `Failed to initialize session store file at ${path}`,
        'init',
        path,
        writeError ?? error,
      );
    }
  }
}

export class FileSessionStore implements SessionStore {
  private warnedProduction = false;

  constructor(private readonly filePath = resolveStorePath()) {}

  private warnIfProductionFileStore(): void {
    if (process.env.NODE_ENV !== 'production' || this.warnedProduction) return;
    this.warnedProduction = true;
    console.warn(
      `[session-store] FileSessionStore is running in production with ${this.filePath}. ` +
        'Use a persistent external store for reliable multi-instance sessions.',
    );
  }

  private async readAll(): Promise<SessionIndex> {
    this.warnIfProductionFileStore();
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
      throw new SessionStoreError(
        `Failed to read session store file at ${this.filePath}`,
        'read',
        this.filePath,
        error,
      );
    }
  }

  private async writeAll(data: SessionIndex): Promise<void> {
    try {
      await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      throw new SessionStoreError(
        `Failed to write session store file at ${this.filePath}`,
        'write',
        this.filePath,
        error,
      );
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
      throw new SessionStoreError(
        `Failed to create session record in ${this.filePath}`,
        'create',
        this.filePath,
        error,
      );
    }
  }

  async get(sessionId: string): Promise<SessionRecord | null> {
    try {
      const all = await this.readAll();
      return all[sessionId] ?? null;
    } catch (error) {
      if (error instanceof SessionStoreError) throw error;
      throw new SessionStoreError(
        `Failed to load session record from ${this.filePath}`,
        'get',
        this.filePath,
        error,
      );
    }
  }
}

export function getSessionStore(): SessionStore {
  return new FileSessionStore();
}
