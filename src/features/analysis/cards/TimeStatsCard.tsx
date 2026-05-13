import { EChart } from "../../../charts/EChart";
import { barOption } from "../../../charts/options";
import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcTimeStats } from "../calculators/timeStats";

export function TimeStatsCard({ draws }: { draws: DltDraw[] }) {
  const data = calcTimeStats(draws);
  return (
    <StatCard title="时间维度" subtitle="按月份和星期观察开奖分布" accent="#0891b2">
      <EChart
        height={220}
        option={barOption(data.byMonth.map((item) => item.label), data.byMonth.map((item) => item.value), "#0891b2")}
      />
      <div className="weekday-row">
        {data.byWeekday.map((item) => <span key={item.label}>{item.label}<b>{item.value}</b></span>)}
      </div>
    </StatCard>
  );
}
