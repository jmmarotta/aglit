export const AGLIT_DIRNAME = ".aglit";
export const ISSUES_DIRNAME = "issues";
export const PROJECTS_DIRNAME = "projects";
export const CONFIG_FILENAME = "config.json";
export const LOCK_FILENAME = ".lock";

export const CONFIG_SCHEMA = "aglit.config.v1";
export const ISSUE_SCHEMA = "aglit.issue.md.v1";
export const PROJECT_SCHEMA = "aglit.project.md.v1";

export const ISSUE_STATUSES = [
  "inbox",
  "planned",
  "active",
  "blocked",
  "done",
  "canceled",
] as const;

export const PRIORITY_LEVELS = ["none", "low", "medium", "high"] as const;

export type IssueStatus = (typeof ISSUE_STATUSES)[number];
export type Priority = (typeof PRIORITY_LEVELS)[number];
