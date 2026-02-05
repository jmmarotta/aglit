import type { FlagParametersForType, InputParser } from "@stricli/core";
import { buildCommand } from "@stricli/core";

import {
  ISSUE_STATUSES,
  getBoardView,
  getProjectBySlug,
  listIssueHeaders,
  renderBoard,
  renderList,
  type IssueStatus,
} from "@aglit/sdk";

import type { AglitCliContext } from "../types";
import { requireWorkspaceRoot } from "../workspace";

type GroupMode = "status" | "none";

interface ListFlags {
  status?: IssueStatus;
  project?: string;
  group?: GroupMode;
}

const statusParser: InputParser<IssueStatus> = (input: string) => {
  const value = input.toLowerCase();
  if ((ISSUE_STATUSES as readonly string[]).includes(value)) {
    return value as IssueStatus;
  }
  throw new Error(`Invalid status: ${input}`);
};

const groupParser: InputParser<GroupMode> = (input: string) => {
  const value = input.toLowerCase();
  if (value === "status" || value === "none") {
    return value as GroupMode;
  }
  throw new Error(`Invalid group: ${input}`);
};

const listFlags: FlagParametersForType<ListFlags, AglitCliContext> = {
  status: {
    kind: "parsed",
    parse: statusParser,
    brief: "Filter by status",
    optional: true,
  },
  project: {
    kind: "parsed",
    parse: String,
    brief: "Filter by project slug",
    optional: true,
  },
  group: {
    kind: "parsed",
    parse: groupParser,
    brief: "Group by status or none",
    optional: true,
  },
};

export const listCommand = buildCommand({
  func: async function (this: AglitCliContext, flags: ListFlags) {
    const root = await requireWorkspaceRoot(this.cwd);
    let projectId: string | undefined;
    if (flags.project) {
      const project = await getProjectBySlug(root, flags.project);
      if (!project?.id) {
        throw new Error(`Project not found or missing id: ${flags.project}`);
      }
      projectId = project.id;
    }

    const group = flags.group ?? "status";
    if (group === "none") {
      const headers = await listIssueHeaders(root, {
        status: flags.status,
        projectId,
      });
      const summaries = headers.map((issue) => ({
        key: issue.key,
        title: issue.title,
        status: issue.status,
        priority: issue.priority,
        projectId: issue.projectId,
      }));
      this.process.stdout.write(`${renderList(summaries)}\n`);
      return;
    }

    const view = await getBoardView(root, {
      status: flags.status,
      projectId,
    });
    this.process.stdout.write(`${renderBoard(view)}\n`);
  },
  parameters: {
    flags: listFlags,
  },
  docs: {
    brief: "List issues",
  },
});
