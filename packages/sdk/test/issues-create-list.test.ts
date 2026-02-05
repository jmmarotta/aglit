import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import {
  createIssueFile,
  listIssueHeaders,
  setConfig,
} from "../src/index.ts";
import { cleanupTempRoot, createTempRoot } from "./helpers.ts";

describe("create/list issues", () => {
  let rootDir: string;

  beforeEach(async () => {
    rootDir = await createTempRoot();
  });

  afterEach(async () => {
    await cleanupTempRoot(rootDir);
  });

  it("requires issue prefix", async () => {
    await expect(createIssueFile(rootDir, { title: "First" })).rejects.toThrow(
      "Issue prefix not set"
    );
  });

  it("allocates sequential keys with prefix", async () => {
    await setConfig(rootDir, { issuePrefix: "ABC" });
    const first = await createIssueFile(rootDir, { title: "First" });
    const second = await createIssueFile(rootDir, { title: "Second" });

    expect(first.key).toBe("ABC-1");
    expect(second.key).toBe("ABC-2");
  });

  it("lists issues", async () => {
    await setConfig(rootDir, { issuePrefix: "ISU" });
    await createIssueFile(rootDir, { title: "One" });
    await createIssueFile(rootDir, { title: "Two" });

    const issues = await listIssueHeaders(rootDir);
    expect(issues).toHaveLength(2);
  });
});
