import type { FlagParametersForType, InputParser } from "@stricli/core";
import { buildCommand } from "@stricli/core";

import {
  ISSUE_STATUSES,
  PRIORITY_LEVELS,
  createIssueFile,
  getProjectBySlug,
  type IssueStatus,
  type Priority,
} from "@aglit/sdk";

import type { AglitCliContext } from "../types";
import { requireWorkspaceRoot } from "../workspace";

interface NewFlags {
  status?: IssueStatus;
  priority?: Priority;
  project?: string;
  prefix?: string;
}

const statusParser: InputParser<IssueStatus> = (input: string) => {
  const value = input.toLowerCase();
  if ((ISSUE_STATUSES as readonly string[]).includes(value)) {
    return value as IssueStatus;
  }
  throw new Error(`Invalid status: ${input}`);
};

const priorityParser: InputParser<Priority> = (input: string) => {
  const value = input.toLowerCase();
  if ((PRIORITY_LEVELS as readonly string[]).includes(value)) {
    return value as Priority;
  }
  throw new Error(`Invalid priority: ${input}`);
};

const newFlags: FlagParametersForType<NewFlags, AglitCliContext> = {
  status: {
    kind: "parsed",
    parse: statusParser,
    brief: "Issue status",
    optional: true,
  },
  priority: {
    kind: "parsed",
    parse: priorityParser,
    brief: "Priority (none|low|medium|high)",
    optional: true,
  },
  project: {
    kind: "parsed",
    parse: String,
    brief: "Project slug",
    optional: true,
  },
  prefix: {
    kind: "parsed",
    parse: String,
    brief: "Issue key prefix",
    optional: true,
  },
};

export const newCommand = buildCommand({
  func: async function (this: AglitCliContext, flags: NewFlags, title: string) {
    const root = await requireWorkspaceRoot(this.cwd);
    let projectId: string | undefined;
    if (flags.project) {
      const project = await getProjectBySlug(root, flags.project);
      if (!project?.id) {
        throw new Error(`Project not found or missing id: ${flags.project}`);
      }
      projectId = project.id;
    }

    const issue = await createIssueFile(root, {
      title,
      status: flags.status,
      priority: flags.priority,
      projectId,
      prefix: flags.prefix,
    });

    this.process.stdout.write(`${issue.key} ${issue.path}\n`);
  },
  parameters: {
    flags: newFlags,
    positional: {
      kind: "tuple",
      parameters: [
        {
          brief: "Issue title",
          parse: String,
        },
      ],
    },
  },
  docs: {
    brief: "Create a new issue",
  },
});
