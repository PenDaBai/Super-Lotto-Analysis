import { BACK_RANGE, FRONT_RANGE } from "../../../domain/numbers";
import { frequency, omission } from "../../../domain/stats";
import type { DltDraw } from "../../../types/dlt";

export function calcNumberMatrix(draws: DltDraw[]) {
  return {
    front: buildArea(draws, "front", FRONT_RANGE),
    back: buildArea(draws, "back", BACK_RANGE)
  };
}

function buildArea(draws: DltDraw[], area: "front" | "back", range: number[]) {
  const freq = new Map(frequency(draws, area).map((item) => [item.num, item]));
  const miss = new Map(omission(draws, area).map((item) => [item.num, item]));
  const max = Math.max(...[...freq.values()].map((item) => item.count), 1);
  return range.map((num) => ({
    num,
    count: freq.get(num)?.count || 0,
    current: miss.get(num)?.current || draws.length,
    average: miss.get(num)?.average || draws.length,
    intensity: (freq.get(num)?.count || 0) / max
  }));
}
