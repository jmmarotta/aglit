import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { createProjectFile, listProjectHeaders } from "../src/index.ts";
import { cleanupTempRoot, createTempRoot } from "./helpers.ts";

describe("create/list projects", () => {
  let rootDir: string;

  beforeEach(async () => {
    rootDir = await createTempRoot();
  });

  afterEach(async () => {
    await cleanupTempRoot(rootDir);
  });

  it("derives slug from title", async () => {
    const first = await createProjectFile(rootDir, { title: "Major Refactor" });
    const second = await createProjectFile(rootDir, { title: "Major Refactor" });

    expect(first.slug).toBe("major-refactor");
    expect(second.slug).toBe("major-refactor-2");
  });

  it("lists projects", async () => {
    await createProjectFile(rootDir, { title: "One" });
    await createProjectFile(rootDir, { title: "Two" });

    const projects = await listProjectHeaders(rootDir);
    expect(projects).toHaveLength(2);
  });
});
