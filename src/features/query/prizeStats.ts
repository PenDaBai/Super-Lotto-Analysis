import { evaluatePrize, type PrizeLevel, PRIZE_LEVELS } from "../../domain/rules";
import { countHits } from "../../domain/numbers";
import type { DltDraw, PrizeResult } from "../../types/dlt";

export interface PrizeHitRow {
  draw: DltDraw;
  prize: PrizeResult;
  complete: boolean;
}

export function calcPrizeHits(draws: DltDraw[], front: number[], back: number[]) {
  if (front.length < 5 || back.length < 2) return [];
  return draws.map((draw) => ({
    draw,
    prize: evaluateCompoundPrize(front, back, draw),
    complete: draw.front.every((num) => front.includes(num)) && draw.back.every((num) => back.includes(num))
  })).filter((row) => row.prize.level !== "未中奖").reverse();
}

function evaluateCompoundPrize(front: number[], back: number[], draw: DltDraw): PrizeResult {
  const frontHits = countHits(draw.front, front);
  const backHits = countHits(draw.back, back);
  return evaluatePrize(
    draw.front.slice(0, Math.max(frontHits, 0)),
    draw.back.slice(0, Math.max(backHits, 0)),
    draw.front,
    draw.back
  );
}

export function summarizePrizeHits(rows: PrizeHitRow[]) {
  return PRIZE_LEVELS.map((level) => ({
    level,
    count: rows.filter((row) => row.prize.level === level).length
  }));
}

export function filterPrizeHits(rows: PrizeHitRow[], levels: PrizeLevel[]) {
  const selected = new Set(levels);
  return rows.filter((row) => selected.has(row.prize.level as PrizeLevel));
}
