import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as path from "node:path";

import { ensureAglit, getConfig, resolveIssuePrefix, setConfig } from "../src/index.ts";
import { cleanupTempRoot, createTempRoot, fileExists } from "./helpers.ts";

describe("workspace + config", () => {
  let rootDir: string;

  beforeEach(async () => {
    rootDir = await createTempRoot();
  });

  afterEach(async () => {
    await cleanupTempRoot(rootDir);
  });

  it("creates layout without config", async () => {
    await ensureAglit(rootDir);

    expect(await fileExists(path.join(rootDir, ".aglit"))).toBe(true);
    expect(await fileExists(path.join(rootDir, ".aglit", "issues"))).toBe(true);
    expect(await fileExists(path.join(rootDir, ".aglit", "projects"))).toBe(true);
    expect(await fileExists(path.join(rootDir, ".aglit", "config.json"))).toBe(
      false
    );
  });

  it("requires explicit prefix", async () => {
    await expect(resolveIssuePrefix(rootDir)).rejects.toThrow("Issue prefix not set");
  });

  it("normalizes and persists custom prefix", async () => {
    const prefix = await resolveIssuePrefix(rootDir, "agl");
    expect(prefix).toBe("AGL");

    const config = await getConfig(rootDir);
    expect(config?.issuePrefix).toBe("AGL");
  });

  it("rejects invalid prefix", async () => {
    await expect(resolveIssuePrefix(rootDir, "1x")).rejects.toThrow(
      "issuePrefix"
    );
  });

  it("accepts config without schema", async () => {
    await setConfig(rootDir, { issuePrefix: "ISU" });
    const config = await getConfig(rootDir);
    expect(config?.issuePrefix).toBe("ISU");
  });
});
