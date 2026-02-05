import * as path from "node:path";

import { ISSUE_SCHEMA, PROJECT_SCHEMA, type IssueStatus, type Priority } from "./constants";
import { resolveIssuePrefix } from "./config";
import { atomicWriteText, ensureLayout, listIssueFiles, listProjectFiles } from "./io";
import { issuePath, projectPath } from "./paths";
import { generateId } from "./uid";
import { renderFrontmatter } from "./frontmatter";
import { withLock } from "./lock";

export interface CreateIssueFileInput {
  title: string;
  status?: IssueStatus;
  priority?: Priority;
  projectId?: string;
  prefix?: string;
}

export interface CreateIssueFileResult {
  key: string;
  path: string;
  id: string;
}

export interface CreateProjectFileInput {
  title: string;
  status?: IssueStatus;
  priority?: Priority;
  slug?: string;
}

export interface CreateProjectFileResult {
  slug: string;
  path: string;
  id: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function allocateIssueKey(rootDir: string | undefined, prefix: string): Promise<string> {
  const files = await listIssueFiles(rootDir);
  const pattern = new RegExp(`^${escapeRegExp(prefix)}-(\\d+)$`);
  let max = 0;
  for (const filePath of files) {
    const key = path.basename(filePath, ".md");
    const match = key.match(pattern);
    if (!match) continue;
    const value = Number(match[1]);
    if (Number.isFinite(value) && value > max) {
      max = value;
    }
  }
  return `${prefix}-${max + 1}`;
}

function normalizeSlug(value: string): string {
  const trimmed = value.trim().toLowerCase();
  const slug = trimmed
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
  return slug || "project";
}

async function allocateProjectSlug(
  rootDir: string | undefined,
  title: string,
  inputSlug?: string,
): Promise<string> {
  const base = normalizeSlug(inputSlug ?? title);
  const files = await listProjectFiles(rootDir);
  const existing = new Set(files.map((file) => path.basename(file, ".md").toLowerCase()));
  if (!existing.has(base)) {
    return base;
  }

  let counter = 2;
  while (existing.has(`${base}-${counter}`)) {
    counter += 1;
  }
  return `${base}-${counter}`;
}

function issueTemplate(input: {
  title: string;
  id: string;
  status: IssueStatus;
  priority: Priority;
  projectId?: string;
}): string {
  const frontmatter = renderFrontmatter(
    {
      schema: ISSUE_SCHEMA,
      id: input.id,
      status: input.status,
      priority: input.priority,
      ...(input.projectId ? { projectId: input.projectId } : {}),
    },
    ["schema", "id", "status", "priority", "projectId"],
  );

  return [
    frontmatter,
    "",
    `# ${input.title.trim()}`,
    "",
    "## Description",
    "",
    "## Acceptance",
    "",
    "## Constraints",
    "",
    "## Plan",
    "",
    "## Verification",
    "",
  ].join("\n");
}

function projectTemplate(input: {
  title: string;
  id: string;
  status: IssueStatus;
  priority: Priority;
}): string {
  const frontmatter = renderFrontmatter(
    {
      schema: PROJECT_SCHEMA,
      id: input.id,
      status: input.status,
      priority: input.priority,
    },
    ["schema", "id", "status", "priority"],
  );

  return [
    frontmatter,
    "",
    `# ${input.title.trim()}`,
    "",
    "## Description",
    "",
    "## Scope",
    "",
    "## Milestones",
    "",
    "## Notes",
    "",
  ].join("\n");
}

export async function createIssueFile(
  rootDir: string | undefined,
  input: CreateIssueFileInput,
): Promise<CreateIssueFileResult> {
  if (!input.title?.trim()) {
    throw new Error("Issue title is required");
  }

  return withLock(rootDir, async () => {
    await ensureLayout(rootDir);
    const prefix = await resolveIssuePrefix(rootDir, input.prefix);
    const key = await allocateIssueKey(rootDir, prefix);
    const id = generateId();
    const status = input.status ?? "inbox";
    const priority = input.priority ?? "none";

    const projectId = input.projectId?.trim() || undefined;
    const content = issueTemplate({
      title: input.title,
      id,
      status,
      priority,
      projectId,
    });

    const filePath = issuePath(rootDir, key);
    await atomicWriteText(filePath, content);
    return { key, path: filePath, id };
  });
}

export async function createProjectFile(
  rootDir: string | undefined,
  input: CreateProjectFileInput,
): Promise<CreateProjectFileResult> {
  if (!input.title?.trim()) {
    throw new Error("Project title is required");
  }

  return withLock(rootDir, async () => {
    await ensureLayout(rootDir);
    const slug = await allocateProjectSlug(rootDir, input.title, input.slug);
    const id = generateId();
    const status = input.status ?? "inbox";
    const priority = input.priority ?? "none";

    const content = projectTemplate({
      title: input.title,
      id,
      status,
      priority,
    });

    const filePath = projectPath(rootDir, slug);
    await atomicWriteText(filePath, content);
    return { slug, path: filePath, id };
  });
}
