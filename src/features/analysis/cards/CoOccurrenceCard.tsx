import type { CSSProperties } from "react";
import { NumberBall } from "../../../components/NumberBall";
import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcCoOccurrence } from "../calculators/coOccurrence";

export function CoOccurrenceCard({ draws }: { draws: DltDraw[] }) {
  const data = calcCoOccurrence(draws);
  const topFront = data.frontPairs[0];
  const topBack = data.backPairs[0];
  return (
    <StatCard title="组合共现" subtitle="观察哪些号码经常在同一期一起出现。" accent="#ea580c">
      <div className="co-hero">
        {topFront && <TopPair label="前区最强对子" pair={topFront.pair} value={topFront.value} tone="front" />}
        {topBack && <TopPair label="后区最强搭配" pair={topBack.pair} value={topBack.value} tone="back" />}
      </div>
      <div className="co-columns">
        <PairList title="前区高频对子" rows={data.frontPairs} max={data.frontMax} color="#ea580c" />
        <PairList title="后区高频搭配" rows={data.backPairs} max={data.backMax} color="#2563eb" />
      </div>
      <p className="card-note">前区对子来自同一期 5 个前区号两两组合；后区搭配来自同一期 2 个后区号。</p>
    </StatCard>
  );
}

function TopPair({ label, pair, value, tone }: { label: string; pair: string; value: number; tone: "front" | "back" }) {
  return (
    <div className={`co-top co-top--${tone}`}>
      <span>{label}</span>
      <strong><PairBalls pair={pair} tone={tone} /></strong>
      <b>{value} 次</b>
    </div>
  );
}

function PairList({ title, rows, max, color }: { title: string; rows: Array<{ pair: string; value: number }>; max: number; color: string }) {
  return (
    <div className="co-pair-list">
      <strong>{title}</strong>
      <div>
        {rows.map((row) => (
          <div className="co-pair-row" key={row.pair}>
            <span><PairBalls pair={row.pair} tone={color === "#2563eb" ? "back" : "front"} /></span>
            <i><mark style={{ width: `${Math.max(8, (row.value / max) * 100)}%`, "--bar-color": color } as CSSProperties} /></i>
            <b>{row.value} 次</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function PairBalls({ pair, tone }: { pair: string; tone: "front" | "back" }) {
  return (
    <span className="co-balls">
      {pair.split(" ").map((num) => <NumberBall key={num} num={Number(num)} tone={tone} />)}
    </span>
  );
}
