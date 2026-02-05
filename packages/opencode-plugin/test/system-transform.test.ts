import { describe, expect, it } from "bun:test";

import AglitPlugin from "../src/index.ts";

describe("system prompt transform", () => {
  it("appends protocol to output.system array", async () => {
    const plugin = await AglitPlugin({} as never);
    const output: { system?: string[] } = { system: [] };

    await plugin["experimental.chat.system.transform"]?.(
      { system: "" } as never,
      output as never
    );

    expect(Array.isArray(output.system)).toBe(true);
    expect(output.system?.length).toBe(1);
    expect(output.system?.[0]).toContain("AGLIT protocol");
  });

  it("appends when output.system already populated", async () => {
    const plugin = await AglitPlugin({} as never);
    const output: { system?: string[] } = { system: ["Existing"] };

    await plugin["experimental.chat.system.transform"]?.(
      { system: "" } as never,
      output as never
    );

    expect(output.system?.[0]).toBe("Existing");
    expect(output.system?.[1]).toContain("AGLIT protocol");
  });
});
