import * as path from "node:path";

import { ISSUE_STATUSES, PRIORITY_LEVELS, type IssueStatus, type Priority } from "./constants";
import { tryRenderMarkdown } from "./bun";
import { getString, parseFrontmatter } from "./frontmatter";

export interface IssueHeader {
  key: string;
  id?: string;
  status: IssueStatus;
  priority: Priority;
  projectId?: string;
  title: string;
  path: string;
  schema?: string;
}

export interface ProjectHeader {
  slug: string;
  id?: string;
  status: IssueStatus;
  priority: Priority;
  title: string;
  path: string;
  schema?: string;
}

function normalizeStatus(value?: string): IssueStatus {
  if (value && (ISSUE_STATUSES as readonly string[]).includes(value)) {
    return value as IssueStatus;
  }
  return "inbox";
}

function normalizePriority(value?: string): Priority {
  if (value && (PRIORITY_LEVELS as readonly string[]).includes(value)) {
    return value as Priority;
  }
  return "none";
}

function extractTitle(body: string): string | null {
  let title: string | null = null;
  const usedMarkdown = tryRenderMarkdown(body, {
    heading: (children, info) => {
      if (!title && info.level === 1) {
        const text = String(children).trim();
        if (text) {
          title = text;
        }
      }
      return "";
    },
  });
  if (!usedMarkdown) {
    const match = body.match(/^#\s+(.+)$/m);
    if (match?.[1]) {
      return match[1].trim();
    }
  }
  return title;
}

export function parseIssueHeader(filePath: string, text: string): IssueHeader {
  const key = path.basename(filePath, ".md");
  const { data, body } = parseFrontmatter(text);
  const schema = getString(data, "schema");
  const status = normalizeStatus(getString(data, "status"));
  const priority = normalizePriority(getString(data, "priority"));
  const title = extractTitle(body) ?? key;

  return {
    key,
    id: getString(data, "id"),
    status,
    priority,
    projectId: getString(data, "projectId"),
    title,
    path: filePath,
    schema,
  };
}

export function parseProjectHeader(filePath: string, text: string): ProjectHeader {
  const slug = path.basename(filePath, ".md");
  const { data, body } = parseFrontmatter(text);
  const schema = getString(data, "schema");
  const status = normalizeStatus(getString(data, "status"));
  const priority = normalizePriority(getString(data, "priority"));
  const title = extractTitle(body) ?? slug;

  return {
    slug,
    id: getString(data, "id"),
    status,
    priority,
    title,
    path: filePath,
    schema,
  };
}
