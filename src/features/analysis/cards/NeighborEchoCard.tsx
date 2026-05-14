import { NumberBall } from "../../../components/NumberBall";
import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcNeighborEcho } from "../calculators/neighborEcho";

export function NeighborEchoCard({ draws }: { draws: DltDraw[] }) {
  const data = calcNeighborEcho(draws);
  return (
    <StatCard title="邻号回声" subtitle="观察上一期号码的相邻号码，是否在下一期被带出来。" accent="#9333ea">
      <div className="echo-summary">
        <Metric label="邻号出现率" value={`${Math.round(data.echoHitRate * 100)}%`} tip="相邻两期中，下一期至少出现 1 个上一期邻号的比例。" />
        <Metric label="重号出现率" value={`${Math.round(data.repeatHitRate * 100)}%`} tip="相邻两期中，下一期至少出现 1 个上一期原号码的比例。" />
        <Metric label="平均邻号数" value={data.avgEcho} tip="每个相邻期过渡中，下一期平均出现多少个上一期邻号。" />
      </div>
      <strong className="echo-section-title">邻号回声 Top</strong>
      <div className="echo-top">
        {data.echoTop.map((item, index) => <span className={index < 3 ? "hot" : ""} key={item.num}><NumberBall num={item.num} tone={index < 3 ? "front" : "muted"} /><b>{item.count} 次</b></span>)}
      </div>
      <strong className="echo-section-title">最近 10 期回声</strong>
      <div className="echo-list">
        {data.recent.map((item) => (
          <div className={item.echoCount >= 3 ? "strong" : ""} key={item.issue}>
            <b>{item.issue}</b>
            <span><em style={{ width: `${Math.min(100, item.echoCount * 24)}%` }} /><i>邻号 {item.echoCount} 个</i></span>
            <small>重号 {item.repeats.length} 个</small>
          </div>
        ))}
      </div>
      <p className="card-note">邻号指上一期号码的左右相邻号，例如 18 的邻号是 17 和 19。</p>
    </StatCard>
  );
}

function Metric({ label, value, tip }: { label: string; value: string | number; tip: string }) {
  return <div className="echo-metric" title={tip}><span>{label}</span><strong>{value}</strong><em>{tip}</em></div>;
}
