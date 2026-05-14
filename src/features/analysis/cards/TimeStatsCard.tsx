import type { EChartsOption } from "echarts";
import { EChart } from "../../../charts/EChart";
import { NumberBall } from "../../../components/NumberBall";
import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcTimeStats } from "../calculators/timeStats";

export function TimeStatsCard({ draws }: { draws: DltDraw[] }) {
  const data = calcTimeStats(draws);
  const chartRows = [...data.front.slice(0, 5), ...data.front.slice(-5)];
  return (
    <StatCard title="趋势迁移" subtitle={`比较近 ${data.shortCount} 期与近 ${data.longCount} 期，观察号码热度变化。`} accent="#0891b2">
      <EChart height={220} option={migrationOption(chartRows)} />
      <p className="card-note">正数表示近期比长期更活跃，负数表示近期降温。它是频率变化，不是预测。</p>
      <div className="two-column">
        <MigrationList title="前区升温" rows={data.front.slice(0, 6)} tone="front" />
        <MigrationList title="前区降温" rows={data.front.slice(-6).reverse()} tone="muted" />
        <MigrationList title="后区升温" rows={data.back.slice(0, 4)} tone="back" />
        <MigrationList title="后区降温" rows={data.back.slice(-4).reverse()} tone="muted" />
      </div>
    </StatCard>
  );
}

function MigrationList({ title, rows, tone }: { title: string; rows: MigrationRow[]; tone: "front" | "back" | "muted" }) {
  return (
    <div className="migration-list">
      <strong>{title}</strong>
      {rows.map((row) => (
        <div className="migration-row" key={row.num}>
          <NumberBall num={row.num} tone={tone} />
          <b>{formatDelta(row.delta)}</b>
          <small>近30期 {row.shortCount} 次</small>
        </div>
      ))}
    </div>
  );
}

function migrationOption(rows: MigrationRow[]): EChartsOption {
  return {
    grid: { left: 42, right: 18, top: 24, bottom: 30 },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: rows.map((row) => String(row.num).padStart(2, "0")) },
    yAxis: { type: "value", splitLine: { lineStyle: { color: "#e5e7eb" } } },
    series: [{
      type: "bar",
      data: rows.map((row) => Number((row.delta * 100).toFixed(1))),
      itemStyle: { color: (params) => Number(params.value) >= 0 ? "#dc2626" : "#64748b", borderRadius: [4, 4, 0, 0] }
    }]
  };
}

function formatDelta(delta: number) {
  const value = Math.round(delta * 100);
  return `${value >= 0 ? "+" : ""}${value}%`;
}

interface MigrationRow {
  num: number;
  shortCount: number;
  delta: number;
}
