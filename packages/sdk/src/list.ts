import { listIssueFiles, listProjectFiles, readTextFile } from "./io";
import {
  parseIssueHeader,
  parseProjectHeader,
  type IssueHeader,
  type ProjectHeader,
} from "./headers";
import { type IssueStatus, type Priority } from "./constants";

export interface IssueListFilter {
  status?: IssueStatus;
  projectId?: string;
  limit?: number;
}

export interface ProjectListFilter {
  status?: IssueStatus;
  limit?: number;
}

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
  none: 3,
};

function keyNumber(key: string): number | null {
  const match = key.match(/-(\d+)$/);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function compareIssue(a: IssueHeader, b: IssueHeader): number {
  if (a.priority !== b.priority) {
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  }
  const aNum = keyNumber(a.key);
  const bNum = keyNumber(b.key);
  if (aNum !== null && bNum !== null && aNum !== bNum) {
    return aNum - bNum;
  }
  return a.key.localeCompare(b.key);
}

function compareProject(a: ProjectHeader, b: ProjectHeader): number {
  if (a.priority !== b.priority) {
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  }
  return a.slug.localeCompare(b.slug);
}

export async function listIssueHeaders(
  rootDir: string | undefined,
  filter: IssueListFilter = {},
): Promise<IssueHeader[]> {
  const files = await listIssueFiles(rootDir);
  const headers: IssueHeader[] = [];
  const projectId = filter.projectId?.trim();
  for (const filePath of files) {
    const text = await readTextFile(filePath);
    const header = parseIssueHeader(filePath, text);
    if (filter.status && header.status !== filter.status) {
      continue;
    }
    if (projectId && header.projectId !== projectId) {
      continue;
    }
    headers.push(header);
  }

  headers.sort(compareIssue);

  if (filter.limit && headers.length > filter.limit) {
    return headers.slice(0, filter.limit);
  }
  return headers;
}

export async function listProjectHeaders(
  rootDir: string | undefined,
  filter: ProjectListFilter = {},
): Promise<ProjectHeader[]> {
  const files = await listProjectFiles(rootDir);
  const headers: ProjectHeader[] = [];
  for (const filePath of files) {
    const text = await readTextFile(filePath);
    const header = parseProjectHeader(filePath, text);
    if (filter.status && header.status !== filter.status) {
      continue;
    }
    headers.push(header);
  }

  headers.sort(compareProject);

  if (filter.limit && headers.length > filter.limit) {
    return headers.slice(0, filter.limit);
  }
  return headers;
}

export async function getProjectBySlug(
  rootDir: string | undefined,
  slug: string,
): Promise<ProjectHeader | null> {
  const normalized = slug.trim().toLowerCase();
  const projects = await listProjectHeaders(rootDir);
  return projects.find((project) => project.slug.toLowerCase() === normalized) ?? null;
}
