import type { DltDraw } from "../../../types/dlt";

export function calcShapeRhythm(draws: DltDraw[]) {
  const totalGaps = draws.length * 4;
  const gapRows = topEntries(countBy(draws.flatMap((draw) => gaps(draw.front))), 10)
    .map(([gap, count]) => ({ gap: Number(gap), count, rate: ratio(count, totalGaps) }));
  const avgGap = average(draws.map((draw) => average(gaps(draw.front))));
  return {
    totalDraws: draws.length,
    totalGaps,
    avgGap,
    gapRows,
    oddRows: ratioRows(draws, oddShape, "奇偶", "奇数:偶数", 6),
    bigRows: ratioRows(draws, bigShape, "大小", "大号(18-35):小号(01-17)", 6),
    zoneRows: ratioRows(draws, zoneShape, "三区", "低区(01-12) / 中区(13-24) / 高区(25-35)", 8)
  };
}

function oddShape(draw: DltDraw) {
  const odd = draw.front.filter((num) => num % 2 === 1).length;
  return `${odd}:${5 - odd}`;
}

function bigShape(draw: DltDraw) {
  const big = draw.front.filter((num) => num >= 18).length;
  return `${big}:${5 - big}`;
}

function zoneShape(draw: DltDraw) {
  const zones = [0, 0, 0];
  draw.front.forEach((num) => { zones[num <= 12 ? 0 : num <= 24 ? 1 : 2] += 1; });
  return zones.join("-");
}

function ratioRows(draws: DltDraw[], getLabel: (draw: DltDraw) => string, type: string, detail: string, limit: number) {
  return topEntries(countBy(draws.map(getLabel)), limit).map(([label, count]) => ({
    type,
    label: type === "三区" ? zoneLabel(String(label)) : `${label} ${type}`,
    detail,
    count,
    rate: ratio(count, draws.length)
  }));
}

function zoneLabel(label: string) {
  const [low, mid, high] = label.split("-");
  return `低区${low} / 中区${mid} / 高区${high}`;
}

function gaps(nums: number[]) {
  return nums.slice(1).map((num, index) => num - nums[index]);
}

function countBy<T extends string | number>(items: T[]) {
  return items.reduce<Map<T, number>>((acc, item) => acc.set(item, (acc.get(item) || 0) + 1), new Map());
}

function topEntries<T extends string | number>(map: Map<T, number>, count: number) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]))).slice(0, count);
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function ratio(value: number, total: number) {
  return total ? value / total : 0;
}
