import type { CommandContext } from "@stricli/core";

export interface AglitCliContext extends CommandContext {
  cwd: string;
}
