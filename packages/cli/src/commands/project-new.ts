import type { FlagParametersForType, InputParser } from "@stricli/core";
import { buildCommand } from "@stricli/core";

import {
  ISSUE_STATUSES,
  PRIORITY_LEVELS,
  createProjectFile,
  type IssueStatus,
  type Priority,
} from "@aglit/sdk";

import type { AglitCliContext } from "../types";
import { requireWorkspaceRoot } from "../workspace";

interface ProjectNewFlags {
  status?: IssueStatus;
  priority?: Priority;
  slug?: string;
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

const projectNewFlags: FlagParametersForType<ProjectNewFlags, AglitCliContext> = {
  status: {
    kind: "parsed",
    parse: statusParser,
    brief: "Project status",
    optional: true,
  },
  priority: {
    kind: "parsed",
    parse: priorityParser,
    brief: "Priority (none|low|medium|high)",
    optional: true,
  },
  slug: {
    kind: "parsed",
    parse: String,
    brief: "Project slug (optional override)",
    optional: true,
  },
};

export const projectNewCommand = buildCommand({
  func: async function (this: AglitCliContext, flags: ProjectNewFlags, title: string) {
    const root = await requireWorkspaceRoot(this.cwd);
    const project = await createProjectFile(root, {
      title,
      status: flags.status,
      priority: flags.priority,
      slug: flags.slug,
    });
    this.process.stdout.write(`${project.slug} ${project.path}\n`);
  },
  parameters: {
    flags: projectNewFlags,
    positional: {
      kind: "tuple",
      parameters: [
        {
          brief: "Project title",
          parse: String,
        },
      ],
    },
  },
  docs: {
    brief: "Create a new project",
  },
});
