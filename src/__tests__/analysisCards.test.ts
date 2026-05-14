import { describe, expect, it } from "vitest";
import type { DltDraw } from "../types/dlt";
import { calcFunStats } from "../features/analysis/calculators/funStats";
import { calcNeighborEcho } from "../features/analysis/calculators/neighborEcho";
import { calcNumberMatrix } from "../features/analysis/calculators/numberMatrix";

const draws: DltDraw[] = [
  make("00001", [1, 5, 10, 20, 30], [1, 8]),
  make("00002", [2, 6, 11, 21, 31], [2, 9]),
  make("00003", [3, 6, 12, 22, 32], [2, 10])
];

describe("new analysis calculators", () => {
  it("builds number matrix counts", () => {
    const data = calcNumberMatrix(draws);
    expect(data.front.find((item) => item.num === 6)?.count).toBe(2);
    expect(data.back.find((item) => item.num === 2)?.count).toBe(2);
  });

  it("calculates neighbor echo transitions", () => {
    const data = calcNeighborEcho(draws);
    expect(data.transitions).toHaveLength(2);
    expect(data.transitions[0].echoCount).toBeGreaterThan(0);
    expect(data.echoHitRate).toBeGreaterThan(0);
  });

  it("builds fun stats portrait and scores", () => {
    const data = calcFunStats(draws);
    expect(data.scores.map((item) => item.label)).toContain("后区贴近");
    expect(data.portrait.title).toBeTruthy();
    expect(Object.keys(data.tail)).toHaveLength(10);
  });
});

function make(issue: string, front: number[], back: number[]): DltDraw {
  return { issue, front, back, date: "2026-01-01", source: "test", importedAt: "2026-01-01T00:00:00.000Z" };
}
