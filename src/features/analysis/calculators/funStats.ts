import type { DltDraw } from "../../../types/dlt";
import { frequency } from "../../../domain/stats";

export function calcFunStats(draws: DltDraw[]) {
  const allFront = draws.flatMap((draw) => draw.front);
  const tail = allFront.reduce<Record<string, number>>((acc, num) => {
    const key = String(num % 10);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const birthdayRate = allFront.filter((num) => num <= 31).length / Math.max(allFront.length, 1);
  const hot = frequency(draws, "front").sort((a, b) => b.count - a.count).slice(0, 5);
  const cold = frequency(draws, "front").sort((a, b) => a.count - b.count).slice(0, 5);
  return { tail, birthdayRate, hotColdScore: hot[0]?.count - cold[0]?.count || 0 };
}
