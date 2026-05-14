import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcShapeRhythm } from "../calculators/shapeRhythm";

export function ShapeRhythmCard({ draws }: { draws: DltDraw[] }) {
  const data = calcShapeRhythm(draws);
  const maxGap = Math.max(...data.gapRows.map((item) => item.count), 1);
  return (
    <StatCard title="形态节奏" subtitle="把间距、奇偶、大小、三区拆开看，寻找更高频、更直观的形态。" accent="#0891b2">
      <div className="shape-summary">
        <Metric label="间距样本" value={`${data.totalGaps} 个`} tip="每期前区 5 个号排序后，会产生 4 个相邻间距。" />
        <Metric label="平均间距" value={data.avgGap.toFixed(2)} tip="每期 4 个相邻间距的平均值，再对当前区间求平均。" />
      </div>
      <section className="shape-gap-panel">
        <strong>间距节奏 Top</strong>
        <div className="shape-gap-grid">
          {data.gapRows.map((item) => (
            <div key={item.gap}>
              <b>差 {item.gap}</b>
              <span>{item.count} 次</span>
              <small>{Math.round(item.rate * 100)}%</small>
              <i><mark style={{ width: `${Math.max(8, item.count / maxGap * 100)}%` }} /></i>
            </div>
          ))}
        </div>
      </section>
      <div className="shape-columns">
        <ShapeGroup title="奇偶形态" rows={data.oddRows} />
        <ShapeGroup title="大小形态" rows={data.bigRows} />
        <ShapeGroup title="三区形态" rows={data.zoneRows} />
      </div>
    </StatCard>
  );
}

function ShapeGroup({ title, rows }: { title: string; rows: Array<{ label: string; detail: string; count: number; rate: number }> }) {
  return (
    <section className="shape-group">
      <strong>{title}</strong>
      <div>
        {rows.map((item) => (
          <span key={item.label} title={item.detail}>
            <b>{item.label}</b>
            <em>{item.count} 期 · {Math.round(item.rate * 100)}%</em>
            <i><mark style={{ width: `${Math.max(8, item.rate * 100)}%` }} /></i>
          </span>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value, tip }: { label: string; value: string; tip: string }) {
  return <div title={tip}><span>{label}</span><strong>{value}</strong><em>{tip}</em></div>;
}
