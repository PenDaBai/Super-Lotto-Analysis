import { NumberBallGroup } from "../../../components/NumberBall";
import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcSimilarityStats } from "../calculators/similarityStats";

export function SimilarityCard({ draws }: { draws: DltDraw[] }) {
  const data = calcSimilarityStats(draws);
  return (
    <StatCard title="历史相似" subtitle="与当前区间最新一期进行相似度比较" accent="#4f46e5">
      {data.latest && (
        <div className="latest-inline">
          <span>{data.latest.issue}</span>
          <NumberBallGroup nums={data.latest.front} />
          <NumberBallGroup nums={data.latest.back} tone="back" />
        </div>
      )}
      <div className="similar-list">
        {data.rows.map(({ draw, frontHits, backHits }) => (
          <div key={draw.issue}>
            <span>{draw.issue}</span>
            <b>前 {frontHits} / 后 {backHits}</b>
          </div>
        ))}
      </div>
    </StatCard>
  );
}
