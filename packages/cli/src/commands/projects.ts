import type { FlagParametersForType, InputParser } from "@stricli/core";
import { buildCommand } from "@stricli/core";

import { ISSUE_STATUSES, getProjectsView, renderProjects, type IssueStatus } from "@aglit/sdk";

import type { AglitCliContext } from "../types";
import { requireWorkspaceRoot } from "../workspace";

interface ProjectsFlags {
  status?: IssueStatus;
}

const statusParser: InputParser<IssueStatus> = (input: string) => {
  const value = input.toLowerCase();
  if ((ISSUE_STATUSES as readonly string[]).includes(value)) {
    return value as IssueStatus;
  }
  throw new Error(`Invalid status: ${input}`);
};

const projectsFlags: FlagParametersForType<ProjectsFlags, AglitCliContext> = {
  status: {
    kind: "parsed",
    parse: statusParser,
    brief: "Filter by status",
    optional: true,
  },
};

export const projectsCommand = buildCommand({
  func: async function (this: AglitCliContext, flags: ProjectsFlags) {
    const root = await requireWorkspaceRoot(this.cwd);
    const view = await getProjectsView(root, { status: flags.status });
    this.process.stdout.write(`${renderProjects(view)}\n`);
  },
  parameters: {
    flags: projectsFlags,
  },
  docs: {
    brief: "List projects",
  },
});
