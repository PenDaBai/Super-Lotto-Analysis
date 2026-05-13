import { NumberBall } from "../../../components/NumberBall";
import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcOmissionStats } from "../calculators/omissionStats";

export function OmissionCard({ draws }: { draws: DltDraw[] }) {
  const data = calcOmissionStats(draws);
  return (
    <StatCard title="遗漏观察" subtitle="当前遗漏越高，代表越久未出现" accent="#7c3aed">
      <div className="rank-table">
        <Header />
        {data.front.slice(0, 8).map((item) => <Row key={`f-${item.num}`} item={item} tone="front" />)}
        {data.back.slice(0, 4).map((item) => <Row key={`b-${item.num}`} item={item} tone="back" />)}
      </div>
    </StatCard>
  );
}

function Header() {
  return <div className="rank-row rank-row--head"><span>号码</span><span>当前遗漏</span><span>最大</span><span>平均</span></div>;
}

function Row({ item, tone }: { item: { num: number; current: number; max: number; average: number }; tone: "front" | "back" }) {
  return (
    <div className="rank-row">
      <span><NumberBall num={item.num} tone={tone} /></span>
      <span>{item.current} 期</span>
      <span>{item.max}</span>
      <span>{item.average.toFixed(1)}</span>
    </div>
  );
}
