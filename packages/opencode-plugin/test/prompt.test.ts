import { describe, expect, it } from "bun:test";

import { buildAglitProtocol } from "../src/prompt.ts";

describe("buildAglitProtocol", () => {
  it("includes core rules", () => {
    const text = buildAglitProtocol();
    expect(text).toContain("AGLIT protocol");
    expect(text).toContain(".aglit/issues");
    expect(text).toContain("aglit list");
    expect(text).toContain("aglit project new");
    expect(text).toContain("projectId");
    expect(text).toContain("priority");
    expect(text).toContain("issuePrefix");
  });
});
