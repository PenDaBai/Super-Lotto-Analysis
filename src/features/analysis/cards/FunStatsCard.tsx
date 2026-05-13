import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcFunStats } from "../calculators/funStats";

export function FunStatsCard({ draws }: { draws: DltDraw[] }) {
  const data = calcFunStats(draws);
  const tails = Object.entries(data.tail).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return (
    <StatCard title="趣味玄学" subtitle="尾数、生日号和冷热差，仅供娱乐" accent="#be123c">
      <div className="metric-strip">
        <div className="metric"><span>生日号占比</span><strong>{Math.round(data.birthdayRate * 100)}%</strong></div>
        <div className="metric"><span>冷热差值</span><strong>{data.hotColdScore}</strong></div>
      </div>
      <div className="tail-list">
        {tails.map(([tail, count]) => <span key={tail}>尾 {tail}<b>{count} 次</b></span>)}
      </div>
      <p className="card-note">这是满足好奇心的观察，不代表未来开奖倾向。</p>
    </StatCard>
  );
}
