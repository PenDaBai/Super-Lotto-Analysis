import type { DltDraw } from "../../../types/dlt";
import { countHits, getLatestDraw } from "../../../domain/numbers";

export function calcSimilarityStats(draws: DltDraw[]) {
  const latest = getLatestDraw(draws);
  if (!latest) return { latest: undefined, rows: [] };
  const rows = draws
    .filter((draw) => draw.issue !== latest.issue)
    .map((draw) => ({
      draw,
      frontHits: countHits(draw.front, latest.front),
      backHits: countHits(draw.back, latest.back)
    }))
    .sort((a, b) => (b.frontHits + b.backHits) - (a.frontHits + a.backHits))
    .slice(0, 8);
  return { latest, rows };
}
