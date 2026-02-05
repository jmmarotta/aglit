import { ensureLayout } from "./io";

export async function ensureAglit(rootDir?: string): Promise<void> {
  await ensureLayout(rootDir);
}
