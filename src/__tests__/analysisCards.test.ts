import { describe, expect, it } from "vitest";
import type { DltDraw } from "../types/dlt";
import { calcCalendarEcho } from "../features/analysis/calculators/calendarEcho";
import { calcFunStats } from "../features/analysis/calculators/funStats";
import { calcMathTexture } from "../features/analysis/calculators/mathTexture";
import { calcNeighborEcho } from "../features/analysis/calculators/neighborEcho";
import { calcNumberMatrix } from "../features/analysis/calculators/numberMatrix";
import { calcShapeRhythm } from "../features/analysis/calculators/shapeRhythm";

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

  it("calculates calendar echoes", () => {
    const data = calcCalendarEcho([
      make("00010", [1, 5, 10, 20, 30], [1, 8], "2026-01-01"),
      make("00011", [2, 6, 11, 21, 31], [2, 9], "2026-02-11")
    ]);
    expect(data.monthRate).toBe(1);
    expect(data.dayRate).toBe(1);
    expect(data.dayBackRate).toBe(0.5);
    expect(data.monthRows.find((item) => item.month === 1)?.front).toBe(1);
  });

  it("builds math texture metrics", () => {
    const data = calcMathTexture(draws);
    expect(data.metrics.map((item) => item.label)).toContain("均匀熵");
    expect(data.metrics.map((item) => item.label)).toContain("尾数熵");
  });

  it("builds shape rhythm rows", () => {
    const data = calcShapeRhythm(draws);
    expect(data.gapRows[0].count).toBeGreaterThan(0);
    expect(data.oddRows[0].count).toBeGreaterThan(0);
    expect(data.zoneRows[0].label).toContain("低区");
  });
});

function make(issue: string, front: number[], back: number[], date = "2026-01-01"): DltDraw {
  return { issue, front, back, date, source: "test", importedAt: "2026-01-01T00:00:00.000Z" };
}
