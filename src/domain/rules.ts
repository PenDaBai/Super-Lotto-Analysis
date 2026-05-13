import type { PrizeResult } from "../types/dlt";
import { countHits } from "./numbers";

const PRIZE_TABLE: Array<[number, number, string, string]> = [
  [5, 2, "一等奖", "前区 5 个 + 后区 2 个"],
  [5, 1, "二等奖", "前区 5 个 + 后区 1 个"],
  [5, 0, "三等奖", "前区 5 个"],
  [4, 2, "四等奖", "前区 4 个 + 后区 2 个"],
  [4, 1, "五等奖", "前区 4 个 + 后区 1 个"],
  [3, 2, "六等奖", "前区 3 个 + 后区 2 个"],
  [4, 0, "七等奖", "前区 4 个"],
  [3, 1, "八等奖", "前区 3 个 + 后区 1 个"],
  [2, 2, "八等奖", "前区 2 个 + 后区 2 个"],
  [3, 0, "九等奖", "前区 3 个"],
  [2, 1, "九等奖", "前区 2 个 + 后区 1 个"],
  [1, 2, "九等奖", "前区 1 个 + 后区 2 个"],
  [0, 2, "九等奖", "后区 2 个"]
];

export const PRIZE_LEVELS = ["一等奖", "二等奖", "三等奖", "四等奖", "五等奖", "六等奖", "七等奖", "八等奖", "九等奖"] as const;

export type PrizeLevel = typeof PRIZE_LEVELS[number];

export function evaluatePrize(
  selectedFront: number[],
  selectedBack: number[],
  drawFront: number[],
  drawBack: number[]
): PrizeResult {
  const frontHits = countHits(selectedFront, drawFront);
  const backHits = countHits(selectedBack, drawBack);
  const match = PRIZE_TABLE.find(([front, back]) => front === frontHits && back === backHits);

  return {
    level: match?.[2] ?? "未中奖",
    frontHits,
    backHits,
    description: match?.[3] ?? "未达到固定奖级条件"
  };
}

export function isCompleteMatch(front: number[], back: number[], drawFront: number[], drawBack: number[]) {
  return countHits(front, drawFront) === 5 && countHits(back, drawBack) === 2;
}
