import * as fs from "node:fs/promises";

import { ensureLayout } from "./io";
import { lockPath } from "./paths";

const DEFAULT_LOCK_TTL_MS = 30_000;

export interface LockOptions {
  ttlMs?: number;
}

async function acquireLock(rootDir?: string, options?: LockOptions): Promise<void> {
  const ttlMs = options?.ttlMs ?? DEFAULT_LOCK_TTL_MS;
  const path = lockPath(rootDir);
  await ensureLayout(rootDir);

  try {
    const handle = await fs.open(path, "wx");
    try {
      const payload = {
        pid: process.pid,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + ttlMs).toISOString(),
      };
      await handle.writeFile(`${JSON.stringify(payload)}\n`, "utf8");
    } finally {
      await handle.close();
    }
    return;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }

  const stat = await fs.stat(path);
  const isStale = Date.now() - stat.mtimeMs > ttlMs;
  if (isStale) {
    await fs.unlink(path);
    return acquireLock(rootDir, options);
  }

  throw new Error(`AGLIT lock already held at ${path}`);
}

async function releaseLock(rootDir?: string): Promise<void> {
  try {
    await fs.unlink(lockPath(rootDir));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return;
    }
    throw error;
  }
}

export async function withLock<T>(
  rootDir: string | undefined,
  fn: () => Promise<T>,
  options?: LockOptions,
): Promise<T> {
  await acquireLock(rootDir, options);
  try {
    return await fn();
  } finally {
    await releaseLock(rootDir);
  }
}
