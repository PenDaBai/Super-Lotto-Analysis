import { describe, expect, it } from "vitest";
import type { DltDraw } from "../types/dlt";
import { frequency, omission, structure } from "../domain/stats";

const draws: DltDraw[] = [
  make("00001", [1, 2, 3, 4, 5], [1, 2]),
  make("00002", [1, 6, 7, 8, 9], [2, 3]),
  make("00003", [10, 11, 12, 13, 14], [4, 5])
];

describe("stats", () => {
  it("calculates frequency", () => {
    expect(frequency(draws, "front").find((item) => item.num === 1)?.count).toBe(2);
  });

  it("calculates current omission", () => {
    expect(omission(draws, "front").find((item) => item.num === 1)?.current).toBe(1);
  });

  it("calculates structure", () => {
    expect(structure(draws)[0].frontSum).toBe(15);
    expect(structure(draws)[0].consecutive).toBe(4);
  });
});

function make(issue: string, front: number[], back: number[]): DltDraw {
  return { issue, front, back, date: "2026-01-01", source: "test", importedAt: "2026-01-01T00:00:00.000Z" };
}
