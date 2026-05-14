import type { DltDraw } from "../../../types/dlt";

interface EchoHit {
  issue: string;
  date: string;
  month: number;
  day: number;
  monthFront: boolean;
  monthBack: boolean;
  dayFront: boolean;
  dayBack: boolean;
}

export function calcCalendarEcho(draws: DltDraw[]) {
  const hits = draws.map(toEchoHit);
  const monthAny = hits.filter((item) => item.monthFront || item.monthBack).length;
  const dayAny = hits.filter((item) => item.dayFront || item.dayBack).length;
  const dayBackEligible = hits.filter((item) => item.day <= 12).length;
  const dayBackHits = hits.filter((item) => item.dayBack).length;
  const doubleEcho = hits.filter((item) => (item.monthFront || item.monthBack) && (item.dayFront || item.dayBack)).length;
  return {
    monthRate: ratio(monthAny, hits.length),
    dayRate: ratio(dayAny, hits.length),
    dayBackRate: ratio(dayBackHits, dayBackEligible),
    doubleRate: ratio(doubleEcho, hits.length),
    monthRows: buildMonthRows(hits),
    dayRows: buildDayRows(hits),
    recent: [...hits].reverse().filter(hasAnyEcho).slice(0, 8)
  };
}

function toEchoHit(draw: DltDraw): EchoHit {
  const date = new Date(`${draw.date}T00:00:00`);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return {
    issue: draw.issue,
    date: draw.date,
    month,
    day,
    monthFront: draw.front.includes(month),
    monthBack: draw.back.includes(month),
    dayFront: draw.front.includes(day),
    dayBack: day <= 12 && draw.back.includes(day)
  };
}

function buildMonthRows(hits: EchoHit[]) {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const rows = hits.filter((item) => item.month === month);
    const front = rows.filter((item) => item.monthFront).length;
    const back = rows.filter((item) => item.monthBack).length;
    return { month, total: rows.length, front, back, rate: ratio(front + back, rows.length * 2) };
  });
}

function buildDayRows(hits: EchoHit[]) {
  return Array.from({ length: 31 }, (_, index) => {
    const day = index + 1;
    const rows = hits.filter((item) => item.day === day);
    const front = rows.filter((item) => item.dayFront).length;
    const back = rows.filter((item) => item.dayBack).length;
    return { day, total: rows.length, front, back, score: front + back };
  }).filter((item) => item.total > 0).sort((a, b) => b.score - a.score || a.day - b.day).slice(0, 8);
}

function hasAnyEcho(hit: EchoHit) {
  return hit.monthFront || hit.monthBack || hit.dayFront || hit.dayBack;
}

function ratio(value: number, total: number) {
  return total ? value / total : 0;
}
