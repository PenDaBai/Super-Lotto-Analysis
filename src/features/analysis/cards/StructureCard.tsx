import { EChart } from "../../../charts/EChart";
import { barOption, lineOption } from "../../../charts/options";
import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcStructureStats } from "../calculators/structureStats";

export function StructureCard({ draws }: { draws: DltDraw[] }) {
  const data = calcStructureStats(draws);
  const topOdd = data.oddItems[0];
  const topBig = data.bigItems[0];
  return (
    <StatCard title="结构分布" subtitle="看一注号码的形态，不看单个号码。" accent="#0f766e">
      <div className="metric-strip">
        <Metric label="平均和值" value={data.avgSum} tip="前区 5 个号码相加的平均值。" />
        <Metric label="平均跨度" value={data.avgSpan} tip="前区最大号减最小号，越大代表号码拉得越开。" />
        <Metric label="连号强度" value={data.avgConsecutive} tip="平均每期出现多少组相邻号码，如 08-09。" />
      </div>
      <EChart height={210} option={lineOption(data.sumTrend.map((item) => item.issue), data.sumTrend.map((item) => item.value))} />
      <div className="explain-grid">
        <MiniChart title="奇偶比例" tip="3:2 表示 3 个奇数、2 个偶数。" items={data.oddItems} />
        <MiniChart title="大小比例" tip="大号按 18-35，小号按 01-17。" items={data.bigItems} />
      </div>
      <p className="card-note">当前区间最常见：{topOdd?.label || "-"}，{topBig?.label || "-"}。</p>
    </StatCard>
  );
}

function Metric({ label, value, tip }: { label: string; value: number; tip: string }) {
  return <div className="metric" title={tip}><span>{label}</span><strong>{value}</strong><em className="hint">{tip}</em></div>;
}

function MiniChart({ title, tip, items }: { title: string; tip: string; items: Array<{ label: string; count: number }> }) {
  const shown = items.slice(0, 5);
  return (
    <div className="insight-card" title={tip}>
      <strong>{title}</strong>
      <span>{tip}</span>
      <EChart height={150} option={barOption(shown.map((item) => item.label), shown.map((item) => item.count), "#0f766e")} />
    </div>
  );
}
