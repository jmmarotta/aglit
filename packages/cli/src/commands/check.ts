import * as path from "node:path";

import { buildCommand } from "@stricli/core";

import { checkWorkspace } from "@aglit/sdk";

import type { AglitCliContext } from "../types";
import { requireWorkspaceRoot } from "../workspace";

export const checkCommand = buildCommand({
  func: async function (this: AglitCliContext) {
    const root = await requireWorkspaceRoot(this.cwd);
    const report = await checkWorkspace(root);

    const lines: string[] = [];
    lines.push(`issues: ${report.issues}`);
    lines.push(`projects: ${report.projects}`);
    lines.push(`problems: ${report.problems.length}`);

    if (report.problems.length) {
      lines.push("");
      for (const problem of report.problems) {
        const relative = path.relative(root, problem.filePath) || problem.filePath;
        lines.push(`- [${problem.level}] ${relative}: ${problem.message}`);
      }
    }

    this.process.stdout.write(`${lines.join("\n")}\n`);
  },
  parameters: {},
  docs: {
    brief: "Validate AGLIT state",
  },
});
