import type { DltDraw } from "../../../types/dlt";

export function calcTimeStats(draws: DltDraw[]) {
  const byYear = new Map<string, number>();
  const byMonth = new Map<string, number>();
  const byWeekday = new Map<string, number>();

  for (const draw of draws) {
    const date = new Date(draw.date);
    add(byYear, draw.date.slice(0, 4));
    add(byMonth, draw.date.slice(5, 7));
    add(byWeekday, ["日", "一", "二", "三", "四", "五", "六"][date.getDay()]);
  }

  return {
    byYear: [...byYear.entries()].map(([label, value]) => ({ label, value })),
    byMonth: [...byMonth.entries()].map(([label, value]) => ({ label: `${label}月`, value })),
    byWeekday: [...byWeekday.entries()].map(([label, value]) => ({ label: `周${label}`, value }))
  };
}

function add(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) || 0) + 1);
}
