import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as path from "node:path";

import { cleanupTempRoot, createTempRoot, fileExists, readJson, runCli } from "./helpers";

describe("aglit init", () => {
  let rootDir: string;

  beforeEach(async () => {
    rootDir = await createTempRoot();
  });

  afterEach(async () => {
    await cleanupTempRoot(rootDir);
  });

  it("requires prefix on init", async () => {
    const result = await runCli(["init"], rootDir);
    expect(result.stderr).toContain("Issue prefix required");
  });

  it("persists prefix when provided", async () => {
    const result = await runCli(["init", "--prefix", "AGL"], rootDir);
    expect(result.error).toBeUndefined();

    const config = await readJson<{ issuePrefix: string }>(
      path.join(rootDir, ".aglit", "config.json")
    );
    expect(config.issuePrefix).toBe("AGL");
    expect(await fileExists(path.join(rootDir, ".aglit", "issues"))).toBe(true);
    expect(await fileExists(path.join(rootDir, ".aglit", "projects"))).toBe(true);
  });
});
