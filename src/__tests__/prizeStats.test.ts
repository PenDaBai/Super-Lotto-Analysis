import { describe, expect, it } from "vitest";
import type { DltDraw } from "../types/dlt";
import { calcPrizeHits, filterPrizeHits, summarizePrizeHits } from "../features/query/prizeStats";

const draws: DltDraw[] = [
  make("00001", [1, 2, 3, 4, 5], [1, 2]),
  make("00002", [1, 2, 3, 4, 5], [1, 9]),
  make("00003", [1, 2, 3, 4, 5], [8, 9]),
  make("00004", [1, 2, 8, 9, 10], [8, 9])
];

describe("prizeStats", () => {
  it("summarizes and filters prize levels", () => {
    const rows = calcPrizeHits(draws, [1, 2, 3, 4, 5], [1, 2]);
    const summary = summarizePrizeHits(rows);
    expect(summary.find((item) => item.level === "一等奖")?.count).toBe(1);
    expect(summary.find((item) => item.level === "二等奖")?.count).toBe(1);
    expect(summary.find((item) => item.level === "三等奖")?.count).toBe(1);
    expect(filterPrizeHits(rows, ["一等奖", "二等奖"])).toHaveLength(2);
  });

  it("supports compound tickets with more than 5+2 numbers", () => {
    const rows = calcPrizeHits(draws, [1, 2, 3, 4, 5, 6], [1, 2, 3]);
    expect(rows.find((row) => row.draw.issue === "00001")?.prize.level).toBe("一等奖");
    expect(rows.find((row) => row.draw.issue === "00001")?.complete).toBe(true);
  });
});

function make(issue: string, front: number[], back: number[]): DltDraw {
  return { issue, front, back, date: "2026-01-01", source: "test", importedAt: "2026-01-01T00:00:00.000Z" };
}
