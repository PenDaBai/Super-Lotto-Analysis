import type { DltDraw } from "../../../types/dlt";
import { formatNums } from "../../../domain/numbers";

export function calcCoOccurrence(draws: DltDraw[]) {
  const frontPairs = new Map<string, number>();
  const backPairs = new Map<string, number>();

  for (const draw of draws) {
    collectPairs(draw.front, frontPairs);
    collectPairs(draw.back, backPairs);
  }

  return {
    frontPairs: topPairs(frontPairs, 10),
    backPairs: topPairs(backPairs, 8),
    frontMax: Math.max(...frontPairs.values()),
    backMax: Math.max(...backPairs.values())
  };
}

function collectPairs(nums: number[], map: Map<string, number>) {
  for (let i = 0; i < nums.length; i += 1) {
    for (let j = i + 1; j < nums.length; j += 1) {
      const key = formatNums([nums[i], nums[j]]);
      map.set(key, (map.get(key) || 0) + 1);
    }
  }
}

function topPairs(map: Map<string, number>, count: number) {
  return [...map.entries()]
    .map(([pair, value]) => ({ pair, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
}
