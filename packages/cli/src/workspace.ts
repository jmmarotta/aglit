import * as fs from "node:fs/promises";
import * as path from "node:path";

const AGLIT_DIR = ".aglit";

async function exists(dirPath: string): Promise<boolean> {
  try {
    await fs.access(dirPath);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

export async function findWorkspaceRoot(startDir: string): Promise<string | null> {
  let current = path.resolve(startDir);

  while (true) {
    if (await exists(path.join(current, AGLIT_DIR))) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

export async function requireWorkspaceRoot(startDir: string): Promise<string> {
  const root = await findWorkspaceRoot(startDir);
  if (!root) {
    throw new Error("AGLIT not initialized. Run `aglit init`.");
  }
  return root;
}
