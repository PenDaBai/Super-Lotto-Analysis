import { EChart } from "../../../charts/EChart";
import { barOption } from "../../../charts/options";
import { NumberBall } from "../../../components/NumberBall";
import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcTimeStats } from "../calculators/timeStats";

export function TimeStatsCard({ draws }: { draws: DltDraw[] }) {
  const data = calcTimeStats(draws);
  const months = [...data.byMonth].sort((a, b) => Number.parseInt(a.label) - Number.parseInt(b.label));
  return (
    <StatCard title="时间维度" subtitle="按开奖日期看月份/星期分布，并附带各月份常见号码。" accent="#0891b2">
      <EChart height={210} option={barOption(months.map((item) => item.label), months.map((item) => item.value), "#0891b2")} />
      <p className="card-note">柱子表示当前区间里开奖日期落在这个月份的期数，不是某个数字的出现次数。</p>
      <div className="month-grid">
        {months.slice(0, 12).map((item) => (
          <div className="month-card" key={item.label} title="该月份内出现次数最多的前区和后区号码">
            <b>{item.label}</b>
            <span>{item.value} 期</span>
            <span>前区常见 <NumberBall num={item.topFront.num} /></span>
            <span>后区常见 <NumberBall num={item.topBack.num} tone="back" /></span>
          </div>
        ))}
      </div>
      <div className="weekday-row">
        {data.byWeekday.map((item) => <span key={item.label}>{item.label}<b>{item.value} 期</b></span>)}
      </div>
    </StatCard>
  );
}
