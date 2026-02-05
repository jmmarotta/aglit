import type { FlagParametersForType } from "@stricli/core";
import { buildCommand } from "@stricli/core";

import { ensureAglit, getConfig, setConfig } from "@aglit/sdk";

import type { AglitCliContext } from "../types";
import { findWorkspaceRoot } from "../workspace";

interface InitFlags {
  prefix?: string;
}

const initFlags: FlagParametersForType<InitFlags, AglitCliContext> = {
  prefix: {
    kind: "parsed",
    parse: String,
    brief: "Issue key prefix",
    optional: true,
  },
};

export const initCommand = buildCommand({
  func: async function (this: AglitCliContext, flags: InitFlags) {
    const root = (await findWorkspaceRoot(this.cwd)) ?? this.cwd;
    await ensureAglit(root);
    if (flags.prefix) {
      await setConfig(root, { issuePrefix: flags.prefix, schema: "aglit.config.v1" });
    } else {
      const config = await getConfig(root);
      if (!config) {
        throw new Error("Issue prefix required. Run `aglit init --prefix ABC`.");
      }
    }
    this.process.stdout.write(`Initialized AGLIT at ${root}\n`);
  },
  parameters: {
    flags: initFlags,
  },
  docs: {
    brief: "Initialize AGLIT in this workspace",
  },
});
