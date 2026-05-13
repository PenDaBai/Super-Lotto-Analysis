import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcCoOccurrence } from "../calculators/coOccurrence";

export function CoOccurrenceCard({ draws }: { draws: DltDraw[] }) {
  const data = calcCoOccurrence(draws);
  return (
    <StatCard title="组合共现" subtitle="号码对子共同出现次数" accent="#ea580c">
      <div className="two-column">
        <PairList title="前区高频对子" rows={data.frontPairs} />
        <PairList title="后区搭配" rows={data.backPairs} />
      </div>
    </StatCard>
  );
}

function PairList({ title, rows }: { title: string; rows: Array<{ pair: string; value: number }> }) {
  return (
    <div className="pair-list">
      <strong>{title}</strong>
      {rows.map((row) => <span key={row.pair}>{row.pair}<b>{row.value} 次</b></span>)}
    </div>
  );
}
