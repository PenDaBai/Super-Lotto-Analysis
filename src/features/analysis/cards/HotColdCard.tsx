import { useState } from "react";
import { EChart } from "../../../charts/EChart";
import { barOption } from "../../../charts/options";
import { NumberBall } from "../../../components/NumberBall";
import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcHotCold } from "../calculators/hotCold";

type HotColdView = "frontHot" | "frontCold" | "backHot" | "backCold";

export function HotColdCard({ draws }: { draws: DltDraw[] }) {
  const [active, setActive] = useState<HotColdView>("frontHot");
  const data = calcHotCold(draws);
  const activeItems = data[active];
  return (
    <StatCard title="冷热号码" subtitle="点击下方分组切换图表，热号是出现多，冷号是出现少。" accent="#dc2626">
      <EChart
        height={220}
        option={barOption(activeItems.map((item) => String(item.num).padStart(2, "0")), activeItems.map((item) => item.count), viewColors[active])}
      />
      <p className="card-note">当前图表：{viewLabels[active]}。</p>
      <div className="mini-grid">
        <List title="前区热号" active={active === "frontHot"} items={data.frontHot.slice(0, 5)} tone="front" onClick={() => setActive("frontHot")} />
        <List title="前区冷号" active={active === "frontCold"} items={data.frontCold.slice(0, 5)} tone="muted" onClick={() => setActive("frontCold")} />
        <List title="后区热号" active={active === "backHot"} items={data.backHot} tone="back" onClick={() => setActive("backHot")} />
        <List title="后区冷号" active={active === "backCold"} items={data.backCold} tone="muted" onClick={() => setActive("backCold")} />
      </div>
    </StatCard>
  );
}

const viewLabels: Record<HotColdView, string> = {
  frontHot: "前区热号",
  frontCold: "前区冷号",
  backHot: "后区热号",
  backCold: "后区冷号"
};

const viewColors: Record<HotColdView, string> = {
  frontHot: "#dc2626",
  frontCold: "#64748b",
  backHot: "#2563eb",
  backCold: "#94a3b8"
};

function List({ title, items, tone, active, onClick }: ListProps) {
  return (
    <button className={`mini-list mini-list--button ${active ? "active" : ""}`} type="button" onClick={onClick}>
      <strong>{title}</strong>
      {items.map((item) => (
        <span key={item.num}><NumberBall num={item.num} tone={tone} /> {item.count} 次</span>
      ))}
    </button>
  );
}

interface ListProps {
  title: string;
  items: Array<{ num: number; count: number }>;
  tone: "front" | "back" | "muted";
  active: boolean;
  onClick: () => void;
}
