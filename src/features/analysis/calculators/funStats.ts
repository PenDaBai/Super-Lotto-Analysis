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
  const consecutiveRate = draws.filter((draw) => draw.front.some((num, index) => index > 0 && num === draw.front[index - 1] + 1)).length / Math.max(draws.length, 1);
  const sameTailRate = draws.filter((draw) => new Set(draw.front.map((num) => num % 10)).size < draw.front.length).length / Math.max(draws.length, 1);
  const hot = frequency(draws, "front").sort((a, b) => b.count - a.count).slice(0, 5);
  const cold = frequency(draws, "front").sort((a, b) => a.count - b.count).slice(0, 5);
  return { tail, birthdayRate, consecutiveRate, sameTailRate, hotColdScore: hot[0]?.count - cold[0]?.count || 0 };
}
