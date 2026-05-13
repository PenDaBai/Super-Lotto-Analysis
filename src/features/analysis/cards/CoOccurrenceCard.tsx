import type { CSSProperties } from "react";
import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcCoOccurrence } from "../calculators/coOccurrence";

export function CoOccurrenceCard({ draws }: { draws: DltDraw[] }) {
  const data = calcCoOccurrence(draws);
  return (
    <StatCard title="组合共现" subtitle="观察哪些号码经常在同一期一起出现。" accent="#ea580c">
      <div className="two-column">
        <PairList title="前区高频对子" rows={data.frontPairs} max={data.frontMax} color="#ea580c" />
        <PairList title="后区高频搭配" rows={data.backPairs} max={data.backMax} color="#2563eb" />
      </div>
      <p className="card-note">共现只说明历史同期开出次数，不代表它们未来更容易一起出现。</p>
    </StatCard>
  );
}

function PairList({ title, rows, max, color }: { title: string; rows: Array<{ pair: string; value: number }>; max: number; color: string }) {
  return (
    <div className="pair-list">
      <strong>{title}</strong>
      <div className="bar-list">
        {rows.map((row) => (
          <div className="bar-row" key={row.pair}>
            <div className="bar-row__head"><span>{row.pair}</span><b>{row.value} 次</b></div>
            <div className="bar-track"><span style={{ width: `${Math.max(8, (row.value / max) * 100)}%`, "--bar-color": color } as CSSProperties} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
