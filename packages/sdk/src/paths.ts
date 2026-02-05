import * as path from "node:path";

import {
  AGLIT_DIRNAME,
  CONFIG_FILENAME,
  ISSUES_DIRNAME,
  LOCK_FILENAME,
  PROJECTS_DIRNAME,
} from "./constants";

export function resolveRoot(rootDir?: string): string {
  return rootDir ?? process.cwd();
}

export function aglitDir(rootDir?: string): string {
  return path.join(resolveRoot(rootDir), AGLIT_DIRNAME);
}

export function issuesDir(rootDir?: string): string {
  return path.join(aglitDir(rootDir), ISSUES_DIRNAME);
}

export function projectsDir(rootDir?: string): string {
  return path.join(aglitDir(rootDir), PROJECTS_DIRNAME);
}

export function configPath(rootDir?: string): string {
  return path.join(aglitDir(rootDir), CONFIG_FILENAME);
}

export function lockPath(rootDir?: string): string {
  return path.join(aglitDir(rootDir), LOCK_FILENAME);
}

export function issuePath(rootDir: string | undefined, key: string): string {
  return path.join(issuesDir(rootDir), `${key}.md`);
}

export function projectPath(rootDir: string | undefined, slug: string): string {
  return path.join(projectsDir(rootDir), `${slug}.md`);
}
