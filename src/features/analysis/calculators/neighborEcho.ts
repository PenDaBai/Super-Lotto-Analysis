import type { DltDraw } from "../../../types/dlt";

export function calcNeighborEcho(draws: DltDraw[]) {
  const rows = [...draws].sort((a, b) => a.issue.localeCompare(b.issue));
  const transitions = rows.slice(1).map((draw, index) => {
    const prev = rows[index];
    const frontNeighbors = neighbors(prev.front, 1, 35);
    const backNeighbors = neighbors(prev.back, 1, 12);
    const frontEcho = draw.front.filter((num) => frontNeighbors.has(num) && !prev.front.includes(num));
    const backEcho = draw.back.filter((num) => backNeighbors.has(num) && !prev.back.includes(num));
    const repeats = [...draw.front.filter((num) => prev.front.includes(num)), ...draw.back.filter((num) => prev.back.includes(num))];
    return { issue: draw.issue, frontEcho, backEcho, repeats, echoCount: frontEcho.length + backEcho.length };
  });
  const echoTop = topEcho(transitions.flatMap((item) => [...item.frontEcho, ...item.backEcho]));
  return {
    transitions,
    recent: transitions.slice(-10).reverse(),
    echoHitRate: ratio(transitions.filter((item) => item.echoCount > 0).length, transitions.length),
    repeatHitRate: ratio(transitions.filter((item) => item.repeats.length > 0).length, transitions.length),
    avgEcho: ratio(transitions.reduce((sum, item) => sum + item.echoCount, 0), transitions.length),
    echoTop
  };
}

function neighbors(nums: number[], min: number, max: number) {
  const set = new Set<number>();
  for (const num of nums) {
    if (num - 1 >= min) set.add(num - 1);
    if (num + 1 <= max) set.add(num + 1);
  }
  return set;
}

function topEcho(nums: number[]) {
  const counts = nums.reduce<Record<number, number>>((acc, num) => {
    acc[num] = (acc[num] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).map(([num, count]) => ({ num: Number(num), count })).sort((a, b) => b.count - a.count).slice(0, 8);
}

function ratio(value: number, total: number) {
  return total ? Number((value / total).toFixed(2)) : 0;
}
