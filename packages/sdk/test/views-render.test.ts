import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import {
  ISSUE_STATUSES,
  createIssueFile,
  createProjectFile,
  getBoardView,
  getProjectsView,
  renderBoard,
  renderList,
  setConfig,
} from "../src/index.ts";
import { cleanupTempRoot, createTempRoot } from "./helpers.ts";

describe("views + render", () => {
  let rootDir: string;

  beforeEach(async () => {
    rootDir = await createTempRoot();
    await setConfig(rootDir, { issuePrefix: "ISU" });
  });

  afterEach(async () => {
    await cleanupTempRoot(rootDir);
  });

  it("builds board view groups", async () => {
    const planned = await createIssueFile(rootDir, {
      title: "Planned",
      status: "planned",
      priority: "low",
    });
    const active = await createIssueFile(rootDir, {
      title: "Active",
      status: "active",
      priority: "high",
    });

    const view = await getBoardView(rootDir);
    expect(view.groups).toHaveLength(ISSUE_STATUSES.length);

    const activeGroup = view.groups.find((group) => group.status === "active");
    expect(activeGroup?.issues[0]?.key).toBe(active.key);

    const plannedGroup = view.groups.find((group) => group.status === "planned");
    expect(plannedGroup?.issues[0]?.key).toBe(planned.key);
  });

  it("renders board and list", async () => {
    const issue = await createIssueFile(rootDir, {
      title: "Render",
      status: "active",
    });

    const board = renderBoard(await getBoardView(rootDir));
    expect(board).toContain("active (1)");
    expect(board).toContain(issue.key);

    const list = renderList([
      {
        key: issue.key,
        title: "Render",
        status: "active",
        priority: "none",
      },
    ]);
    expect(list).toContain(issue.key);
  });

  it("renders projects view counts", async () => {
    const project = await createProjectFile(rootDir, {
      title: "Major Refactor",
      status: "active",
    });
    await createIssueFile(rootDir, {
      title: "One",
      projectId: project.id,
    });
    await createIssueFile(rootDir, {
      title: "Two",
      projectId: project.id,
    });

    const view = await getProjectsView(rootDir);
    expect(view.projects[0]?.issueCount).toBe(2);
  });
});
