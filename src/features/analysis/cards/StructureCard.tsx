import { EChart } from "../../../charts/EChart";
import { lineOption } from "../../../charts/options";
import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcStructureStats } from "../calculators/structureStats";

export function StructureCard({ draws }: { draws: DltDraw[] }) {
  const data = calcStructureStats(draws);
  return (
    <StatCard title="结构分布" subtitle="和值、跨度、奇偶、大小和连号观察" accent="#0f766e">
      <div className="metric-strip">
        <Metric label="平均和值" value={data.avgSum} />
        <Metric label="平均跨度" value={data.avgSpan} />
        <Metric label="平均连号" value={data.avgConsecutive} />
      </div>
      <EChart
        height={220}
        option={lineOption(data.sumTrend.map((item) => item.issue), data.sumTrend.map((item) => item.value))}
      />
      <p className="card-note">奇偶常见：{topBucket(data.oddBuckets)}；大小常见：{topBucket(data.bigBuckets)}</p>
    </StatCard>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}

function topBucket(bucket: Record<string, number>) {
  return Object.entries(bucket).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
}
