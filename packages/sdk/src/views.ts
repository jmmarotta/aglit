import { ISSUE_STATUSES, type IssueStatus, type Priority } from "./constants";
import {
  listIssueHeaders,
  listProjectHeaders,
  type IssueListFilter,
  type ProjectListFilter,
} from "./list";
import type { IssueHeader } from "./headers";

export interface IssueSummary {
  key: string;
  title: string;
  status: IssueStatus;
  priority: Priority;
  projectId?: string;
}

export interface BoardViewGroup {
  status: IssueStatus;
  issues: IssueSummary[];
}

export interface BoardView {
  groups: BoardViewGroup[];
}

export interface ProjectSummary {
  slug: string;
  title: string;
  status: IssueStatus;
  priority: Priority;
  issueCount: number;
  id?: string;
}

export interface ProjectsView {
  projects: ProjectSummary[];
}

function toIssueSummary(header: IssueHeader): IssueSummary {
  return {
    key: header.key,
    title: header.title,
    status: header.status,
    priority: header.priority,
    projectId: header.projectId,
  };
}

export async function getBoardView(
  rootDir: string | undefined,
  filter: IssueListFilter = {},
): Promise<BoardView> {
  const limited = await listIssueHeaders(rootDir, filter);

  const groups = ISSUE_STATUSES.map((status) => ({
    status,
    issues: [] as IssueSummary[],
  }));

  const groupMap = new Map<IssueStatus, IssueSummary[]>();
  for (const group of groups) {
    groupMap.set(group.status, group.issues);
  }

  for (const header of limited) {
    const list = groupMap.get(header.status);
    if (!list) continue;
    list.push(toIssueSummary(header));
  }

  return { groups };
}

export async function getProjectsView(
  rootDir: string | undefined,
  filter: ProjectListFilter = {},
): Promise<ProjectsView> {
  const projects = await listProjectHeaders(rootDir, filter);
  const issues = await listIssueHeaders(rootDir);
  const counts = new Map<string, number>();
  for (const issue of issues) {
    if (!issue.projectId) continue;
    counts.set(issue.projectId, (counts.get(issue.projectId) ?? 0) + 1);
  }

  const summaries = projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    status: project.status,
    priority: project.priority,
    issueCount: project.id ? (counts.get(project.id) ?? 0) : 0,
    id: project.id,
  }));

  return { projects: summaries };
}
