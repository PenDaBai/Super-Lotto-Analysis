import { describe, expect, it } from "vitest";
import { parseMarkdownDraws } from "../data/importers";

describe("parseMarkdownDraws", () => {
  it("parses markdown table rows", () => {
    const rows = parseMarkdownDraws("| 26051 | 13 18 28 32 33 | 02 11 | 2026-05-11 |");
    expect(rows).toHaveLength(1);
    expect(rows[0].issue).toBe("26051");
    expect(rows[0].front).toEqual([13, 18, 28, 32, 33]);
  });
});
