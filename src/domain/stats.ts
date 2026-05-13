import type { DltDraw } from "../types/dlt";
import { BACK_RANGE, FRONT_RANGE } from "./numbers";

export interface FrequencyItem {
  num: number;
  count: number;
  rate: number;
}

export function frequency(draws: DltDraw[], area: "front" | "back") {
  const range = area === "front" ? FRONT_RANGE : BACK_RANGE;
  const totalSlots = draws.length * (area === "front" ? 5 : 2);
  return range.map((num) => {
    const count = draws.reduce((sum, draw) => sum + (draw[area].includes(num) ? 1 : 0), 0);
    return { num, count, rate: totalSlots ? count / totalSlots : 0 };
  });
}

export function omission(draws: DltDraw[], area: "front" | "back") {
  const range = area === "front" ? FRONT_RANGE : BACK_RANGE;
  const newestFirst = [...draws].sort((a, b) => b.issue.localeCompare(a.issue));
  return range.map((num) => {
    const current = newestFirst.findIndex((draw) => draw[area].includes(num));
    const gaps = collectGaps([...newestFirst].reverse(), area, num);
    return {
      num,
      current: current < 0 ? draws.length : current,
      max: gaps.length ? Math.max(...gaps) : draws.length,
      average: gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : draws.length
    };
  });
}

function collectGaps(draws: DltDraw[], area: "front" | "back", num: number) {
  const gaps: number[] = [];
  let gap = 0;
  for (const draw of draws) {
    if (draw[area].includes(num)) {
      gaps.push(gap);
      gap = 0;
    } else {
      gap += 1;
    }
  }
  return gaps;
}

export function structure(draws: DltDraw[]) {
  return draws.map((draw) => {
    const frontSum = draw.front.reduce((sum, num) => sum + num, 0);
    const odd = draw.front.filter((num) => num % 2 === 1).length;
    const big = draw.front.filter((num) => num >= 18).length;
    const span = Math.max(...draw.front) - Math.min(...draw.front);
    const consecutive = draw.front.filter((num, index) => index > 0 && num === draw.front[index - 1] + 1).length;
    return { issue: draw.issue, frontSum, odd, even: 5 - odd, big, small: 5 - big, span, consecutive };
  });
}
