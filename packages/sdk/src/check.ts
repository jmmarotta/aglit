import { ISSUE_SCHEMA, ISSUE_STATUSES, PRIORITY_LEVELS, PROJECT_SCHEMA } from "./constants";
import { getString, parseFrontmatter } from "./frontmatter";
import { listIssueFiles, listProjectFiles, readTextFile } from "./io";

export interface CheckProblem {
  filePath: string;
  message: string;
  level: "error" | "warning";
}

export interface CheckReport {
  problems: CheckProblem[];
  issues: number;
  projects: number;
}

const UUID_V7_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuidV7(value: string): boolean {
  return UUID_V7_REGEX.test(value);
}

function isValidStatus(value: string | undefined): boolean {
  return !!value && (ISSUE_STATUSES as readonly string[]).includes(value);
}

function isValidPriority(value: string | undefined): boolean {
  return !!value && (PRIORITY_LEVELS as readonly string[]).includes(value);
}

export async function checkWorkspace(rootDir?: string): Promise<CheckReport> {
  const problems: CheckProblem[] = [];
  const issueFiles = await listIssueFiles(rootDir);
  const projectFiles = await listProjectFiles(rootDir);

  const projectIds = new Map<string, string>();
  const issueIds = new Map<string, string>();

  for (const filePath of projectFiles) {
    const text = await readTextFile(filePath);
    const { data, hasFrontmatter, error } = parseFrontmatter(text);

    if (!hasFrontmatter) {
      problems.push({ filePath, message: "Missing frontmatter", level: "error" });
      continue;
    }

    if (error) {
      problems.push({
        filePath,
        message: `Frontmatter parse error: ${error.message}`,
        level: "error",
      });
      continue;
    }

    const schema = getString(data, "schema");
    if (schema !== PROJECT_SCHEMA) {
      problems.push({
        filePath,
        message: `Invalid schema (expected ${PROJECT_SCHEMA})`,
        level: "error",
      });
    }

    const id = getString(data, "id");
    if (!id) {
      problems.push({ filePath, message: "Missing id", level: "error" });
    } else if (!isUuidV7(id)) {
      problems.push({ filePath, message: "Invalid UUIDv7 id", level: "error" });
    } else if (projectIds.has(id)) {
      problems.push({
        filePath,
        message: `Duplicate project id (also in ${projectIds.get(id)})`,
        level: "error",
      });
    } else {
      projectIds.set(id, filePath);
    }

    const status = getString(data, "status");
    if (!isValidStatus(status)) {
      problems.push({ filePath, message: "Invalid or missing status", level: "error" });
    }

    const priority = getString(data, "priority");
    if (!isValidPriority(priority)) {
      problems.push({ filePath, message: "Invalid or missing priority", level: "error" });
    }
  }

  for (const filePath of issueFiles) {
    const text = await readTextFile(filePath);
    const { data, hasFrontmatter, error } = parseFrontmatter(text);

    if (!hasFrontmatter) {
      problems.push({ filePath, message: "Missing frontmatter", level: "error" });
      continue;
    }

    if (error) {
      problems.push({
        filePath,
        message: `Frontmatter parse error: ${error.message}`,
        level: "error",
      });
      continue;
    }

    const schema = getString(data, "schema");
    if (schema !== ISSUE_SCHEMA) {
      problems.push({
        filePath,
        message: `Invalid schema (expected ${ISSUE_SCHEMA})`,
        level: "error",
      });
    }

    const id = getString(data, "id");
    if (!id) {
      problems.push({ filePath, message: "Missing id", level: "error" });
    } else if (!isUuidV7(id)) {
      problems.push({ filePath, message: "Invalid UUIDv7 id", level: "error" });
    } else if (issueIds.has(id)) {
      problems.push({
        filePath,
        message: `Duplicate issue id (also in ${issueIds.get(id)})`,
        level: "error",
      });
    } else {
      issueIds.set(id, filePath);
    }

    const status = getString(data, "status");
    if (!isValidStatus(status)) {
      problems.push({ filePath, message: "Invalid or missing status", level: "error" });
    }

    const priority = getString(data, "priority");
    if (!isValidPriority(priority)) {
      problems.push({ filePath, message: "Invalid or missing priority", level: "error" });
    }

    const projectId = getString(data, "projectId");
    if (projectId && !isUuidV7(projectId)) {
      problems.push({
        filePath,
        message: "projectId is not a UUIDv7",
        level: "error",
      });
    } else if (projectId && !projectIds.has(projectId)) {
      problems.push({
        filePath,
        message: "projectId does not match any project",
        level: "warning",
      });
    }
  }

  return { problems, issues: issueFiles.length, projects: projectFiles.length };
}
