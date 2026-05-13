import { EChart } from "../../../charts/EChart";
import { barOption } from "../../../charts/options";
import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcFunStats } from "../calculators/funStats";

export function FunStatsCard({ draws }: { draws: DltDraw[] }) {
  const data = calcFunStats(draws);
  const tails = Object.entries(data.tail).sort((a, b) => b[1] - a[1]);
  return (
    <StatCard title="趣味玄学" subtitle="把常见民间选号偏好做成可读指标，仅供娱乐。" accent="#be123c">
      <div className="fun-grid">
        <FunItem title="生日号占比" value={`${Math.round(data.birthdayRate * 100)}%`} tip="前区号码中 01-31 的占比。喜欢用生日选号的人会关注它。" />
        <FunItem title="出现连号的期数" value={`${Math.round(data.consecutiveRate * 100)}%`} tip="至少出现一组相邻前区号码的期数占比。" />
        <FunItem title="出现同尾的期数" value={`${Math.round(data.sameTailRate * 100)}%`} tip="前区至少两个号码尾数相同，如 03 和 23。" />
        <FunItem title="冷热差值" value={data.hotColdScore} tip="当前区间最热前区号和最冷前区号的出现次数差。" />
      </div>
      <EChart height={190} option={barOption(tails.map(([tail]) => `尾${tail}`), tails.map(([, count]) => count), "#be123c")} />
      <p className="card-note">尾数图展示前区号码个位数分布，比如尾 8 包含 08、18、28。</p>
    </StatCard>
  );
}

function FunItem({ title, value, tip }: { title: string; value: string | number; tip: string }) {
  return (
    <div className="insight-card" title={tip}>
      <span>{title}</span>
      <strong>{value}</strong>
      <em className="hint">{tip}</em>
    </div>
  );
}
