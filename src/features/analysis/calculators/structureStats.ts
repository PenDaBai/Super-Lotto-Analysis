import type { DltDraw } from "../../../types/dlt";
import { structure } from "../../../domain/stats";

export function calcStructureStats(draws: DltDraw[]) {
  const rows = structure(draws);
  const avg = (values: number[]) => values.reduce((a, b) => a + b, 0) / Math.max(values.length, 1);
  const oddBuckets = bucket(rows.map((row) => row.odd));
  const bigBuckets = bucket(rows.map((row) => row.big));
  return {
    avgSum: Math.round(avg(rows.map((row) => row.frontSum))),
    avgSpan: Math.round(avg(rows.map((row) => row.span))),
    avgConsecutive: Number(avg(rows.map((row) => row.consecutive)).toFixed(2)),
    oddItems: toItems(oddBuckets, "奇:偶"),
    bigItems: toItems(bigBuckets, "大:小"),
    sumTrend: rows.slice(-30).map((row) => ({ issue: row.issue, value: row.frontSum }))
  };
}

function bucket(values: number[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[`${value}:${5 - value}`] = (acc[`${value}:${5 - value}`] || 0) + 1;
    return acc;
  }, {});
}

function toItems(bucket: Record<string, number>, labelSuffix: string) {
  return Object.entries(bucket)
    .map(([label, count]) => ({ label: `${label} ${labelSuffix}`, count }))
    .sort((a, b) => b.count - a.count);
}
