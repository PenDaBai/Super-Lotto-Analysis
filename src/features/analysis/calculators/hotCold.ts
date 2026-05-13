import type { DltDraw } from "../../../types/dlt";
import { frequency } from "../../../domain/stats";

export function calcHotCold(draws: DltDraw[]) {
  const front = frequency(draws, "front").sort((a, b) => b.count - a.count);
  const back = frequency(draws, "back").sort((a, b) => b.count - a.count);
  return {
    frontHot: front.slice(0, 8),
    frontCold: front.slice(-8).reverse(),
    backHot: back.slice(0, 5),
    backCold: back.slice(-5).reverse()
  };
}
