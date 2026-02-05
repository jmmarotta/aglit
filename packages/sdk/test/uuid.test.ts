import { describe, expect, it } from "bun:test";

import { generateId } from "../src/index.ts";

const UUID_V7_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("generateId", () => {
  it("generates a UUIDv7", () => {
    const id = generateId();
    expect(id).toMatch(UUID_V7_REGEX);
  });
});
