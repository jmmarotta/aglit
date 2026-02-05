import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import {
  checkWorkspace,
  createIssueFile,
  createProjectFile,
  setConfig,
} from "../src/index.ts";
import { cleanupTempRoot, createTempRoot } from "./helpers.ts";

describe("check", () => {
  let rootDir: string;

  beforeEach(async () => {
    rootDir = await createTempRoot();
    await setConfig(rootDir, { issuePrefix: "ISU" });
  });

  afterEach(async () => {
    await cleanupTempRoot(rootDir);
  });

  it("reports clean workspace", async () => {
    const project = await createProjectFile(rootDir, { title: "Major Refactor" });
    await createIssueFile(rootDir, { title: "One", projectId: project.id });

    const report = await checkWorkspace(rootDir);
    expect(report.problems).toHaveLength(0);
    expect(report.issues).toBe(1);
    expect(report.projects).toBe(1);
  });
});
