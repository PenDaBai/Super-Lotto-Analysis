import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcNumberMatrix } from "../calculators/numberMatrix";

export function NumberMatrixCard({ draws }: { draws: DltDraw[] }) {
  const data = calcNumberMatrix(draws);
  return (
    <StatCard title="号码矩阵" subtitle="把号码按位置铺成热力图，颜色越深表示当前区间出现越多。" accent="#16a34a">
      <Matrix title="前区 01-35" columns={7} rows={data.front} tone="front" />
      <Matrix title="后区 01-12" columns={4} rows={data.back} tone="back" />
      <p className="card-note">悬停可看出现次数、当前遗漏和平均遗漏。矩阵跟随上方区间切换。</p>
    </StatCard>
  );
}

function Matrix({ title, columns, rows, tone }: MatrixProps) {
  return (
    <div className="matrix-block">
      <strong>{title}</strong>
      <div className="number-matrix" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {rows.map((row) => (
          <span
            className={`matrix-cell matrix-cell--${tone}`}
            key={row.num}
            style={{ opacity: 0.28 + row.intensity * 0.72 }}
            title={`${pad(row.num)}：出现 ${row.count} 次；当前遗漏 ${row.current} 期；平均遗漏 ${row.average.toFixed(1)} 期`}
          >
            {pad(row.num)}
          </span>
        ))}
      </div>
    </div>
  );
}

function pad(num: number) {
  return String(num).padStart(2, "0");
}

interface MatrixProps {
  title: string;
  columns: number;
  tone: "front" | "back";
  rows: Array<{ num: number; count: number; current: number; average: number; intensity: number }>;
}
