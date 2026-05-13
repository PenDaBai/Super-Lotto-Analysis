import type { DltDraw } from "../../../types/dlt";

export function calcTimeStats(draws: DltDraw[]) {
  const byYear = new Map<string, number>();
  const byMonth = new Map<string, DltDraw[]>();
  const byWeekday = new Map<string, number>();

  for (const draw of draws) {
    const date = new Date(draw.date);
    add(byYear, draw.date.slice(0, 4));
    addDraw(byMonth, draw.date.slice(5, 7), draw);
    add(byWeekday, ["日", "一", "二", "三", "四", "五", "六"][date.getDay()]);
  }

  return {
    byYear: [...byYear.entries()].map(([label, value]) => ({ label, value })),
    byMonth: [...byMonth.entries()].map(([label, rows]) => ({
      label: `${label}月`,
      value: rows.length,
      topFront: topNumber(rows.flatMap((draw) => draw.front)),
      topBack: topNumber(rows.flatMap((draw) => draw.back))
    })),
    byWeekday: [...byWeekday.entries()].map(([label, value]) => ({ label: `周${label}`, value }))
  };
}

function add(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) || 0) + 1);
}

function addDraw(map: Map<string, DltDraw[]>, key: string, draw: DltDraw) {
  map.set(key, [...(map.get(key) || []), draw]);
}

function topNumber(nums: number[]) {
  const counts = nums.reduce<Record<number, number>>((acc, num) => {
    acc[num] = (acc[num] || 0) + 1;
    return acc;
  }, {});
  const [num, count] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || ["0", 0];
  return { num: Number(num), count };
}
