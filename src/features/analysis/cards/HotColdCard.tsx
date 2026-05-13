import { EChart } from "../../../charts/EChart";
import { barOption } from "../../../charts/options";
import { NumberBall } from "../../../components/NumberBall";
import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcHotCold } from "../calculators/hotCold";

export function HotColdCard({ draws }: { draws: DltDraw[] }) {
  const data = calcHotCold(draws);
  return (
    <StatCard title="冷热号码" subtitle="按当前区间统计出现频率" accent="#dc2626">
      <EChart
        height={220}
        option={barOption(data.frontHot.map((item) => String(item.num).padStart(2, "0")), data.frontHot.map((item) => item.count), "#dc2626")}
      />
      <div className="mini-grid">
        <List title="前区热号" items={data.frontHot.slice(0, 5)} tone="front" />
        <List title="前区冷号" items={data.frontCold.slice(0, 5)} tone="muted" />
        <List title="后区热号" items={data.backHot} tone="back" />
        <List title="后区冷号" items={data.backCold} tone="muted" />
      </div>
    </StatCard>
  );
}

function List({ title, items, tone }: { title: string; items: Array<{ num: number; count: number }>; tone: "front" | "back" | "muted" }) {
  return (
    <div className="mini-list">
      <strong>{title}</strong>
      {items.map((item) => (
        <span key={item.num}><NumberBall num={item.num} tone={tone} /> {item.count} 次</span>
      ))}
    </div>
  );
}
