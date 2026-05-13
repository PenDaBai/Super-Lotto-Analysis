import type { DltDraw, PickResult } from "../../types/dlt";
import { BACK_RANGE, FRONT_RANGE, uniqueSorted } from "../../domain/numbers";
import { frequency, omission } from "../../domain/stats";

export type PickStrategy = "random" | "balanced" | "hotCold" | "omission";

export function makePick(draws: DltDraw[], strategy: PickStrategy, excludes: number[], fixedFront: number[]): PickResult {
  const frontPool = FRONT_RANGE.filter((num) => !excludes.includes(num) && !fixedFront.includes(num));
  const front = uniqueSorted([...fixedFront.slice(0, 5), ...pickFront(draws, strategy, frontPool, 5 - fixedFront.length)]);
  const back = uniqueSorted(sample(BACK_RANGE, 2));
  return { front, back, strategy: label(strategy), reason: reason(strategy) };
}

function pickFront(draws: DltDraw[], strategy: PickStrategy, pool: number[], count: number) {
  if (strategy === "hotCold") {
    const ranked = frequency(draws, "front").sort((a, b) => b.count - a.count).map((item) => item.num).filter((num) => pool.includes(num));
    return sample([...ranked.slice(0, 12), ...ranked.slice(-10)], count);
  }
  if (strategy === "omission") {
    const ranked = omission(draws, "front").sort((a, b) => b.current - a.current).map((item) => item.num).filter((num) => pool.includes(num));
    return sample(ranked.slice(0, 18), count);
  }
  if (strategy === "balanced") return balanced(pool, count);
  return sample(pool, count);
}

function balanced(pool: number[], count: number) {
  const odd = sample(pool.filter((num) => num % 2 === 1), Math.ceil(count / 2));
  const even = sample(pool.filter((num) => num % 2 === 0), count - odd.length);
  return sample([...odd, ...even], count);
}

function sample(pool: number[], count: number) {
  const copy = [...pool];
  const result: number[] = [];
  while (copy.length && result.length < count) {
    result.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return result;
}

function label(strategy: PickStrategy) {
  return ({ random: "完全随机", balanced: "均衡选号", hotCold: "热冷混搭", omission: "遗漏回补" })[strategy];
}

function reason(strategy: PickStrategy) {
  return ({
    random: "不参考历史，完全随机抽取。",
    balanced: "尽量平衡奇偶和号码分布。",
    hotCold: "从当前区间热号和冷号中混合抽取。",
    omission: "偏向当前遗漏较长的前区号码。"
  })[strategy];
}
