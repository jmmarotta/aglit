import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { cleanupTempRoot, createTempRoot, runCli } from "./helpers";

describe("aglit check", () => {
  let rootDir: string;

  beforeEach(async () => {
    rootDir = await createTempRoot();
    await runCli(["init", "--prefix", "ISU"], rootDir);
    await runCli(["new", "One"], rootDir);
  });

  afterEach(async () => {
    await cleanupTempRoot(rootDir);
  });

  it("reports config and issue count", async () => {
    const result = await runCli(["check"], rootDir);
    expect(result.error).toBeUndefined();
    expect(result.stdout).toContain("issues: 1");
    expect(result.stdout).toContain("projects: 0");
    expect(result.stdout).toContain("problems: 0");
  });
});
