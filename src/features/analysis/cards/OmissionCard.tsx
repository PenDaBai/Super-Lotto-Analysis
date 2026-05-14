import type { CSSProperties } from "react";
import { NumberBall } from "../../../components/NumberBall";
import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcOmissionStats } from "../calculators/omissionStats";

export function OmissionCard({ draws }: { draws: DltDraw[] }) {
  const data = calcOmissionStats(draws);
  const frontMax = Math.max(...data.front.map((item) => item.current), 1);
  const backMax = Math.max(...data.back.map((item) => item.current), 1);
  const topFront = data.front[0];
  const topBack = data.back[0];
  return (
    <StatCard title="遗漏观察" subtitle="当前遗漏越高，代表越久未出现" accent="#7c3aed">
      <div className="omission-hero">
        <Metric label="前区最久未出" item={topFront} tone="front" />
        <Metric label="后区最久未出" item={topBack} tone="back" />
      </div>
      <div className="omission-columns">
        <OmissionList title="前区遗漏榜" rows={data.front.slice(0, 8)} tone="front" max={frontMax} />
        <OmissionList title="后区遗漏榜" rows={data.back.slice(0, 6)} tone="back" max={backMax} />
      </div>
    </StatCard>
  );
}

function Metric({ label, item, tone }: { label: string; item?: { num: number; current: number }; tone: "front" | "back" }) {
  if (!item) return null;
  return (
    <div className={`omission-metric omission-metric--${tone}`}>
      <span>{label}</span>
      <NumberBall num={item.num} tone={tone} />
      <strong>{item.current} 期</strong>
    </div>
  );
}

function OmissionList({ title, rows, tone, max }: { title: string; rows: Array<{ num: number; current: number; max: number; average: number }>; tone: "front" | "back"; max: number }) {
  return (
    <section className="omission-list">
      <strong>{title}</strong>
      {rows.map((item) => <OmissionRow key={`${tone}-${item.num}`} item={item} tone={tone} max={max} />)}
    </section>
  );
}

function OmissionRow({ item, tone, max }: { item: { num: number; current: number; max: number; average: number }; tone: "front" | "back"; max: number }) {
  return (
    <div className="omission-row">
      <NumberBall num={item.num} tone={tone} />
      <div>
        <span>当前 {item.current} 期</span>
        <i><mark style={{ width: `${Math.max(8, item.current / max * 100)}%` } as CSSProperties} /></i>
      </div>
      <small>最大 {item.max} · 均值 {item.average.toFixed(1)}</small>
    </div>
  );
}
