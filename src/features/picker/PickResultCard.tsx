import type { CSSProperties } from "react";
import { NumberBallGroup } from "../../components/NumberBall";
import type { PickResult } from "../../types/dlt";

const scoreLabels = [
  ["balance", "均衡"],
  ["heat", "热度"],
  ["omission", "遗漏"],
  ["texture", "纹理"],
  ["mystery", "玄学"]
] as const;

export function PickResultCard({ item, index }: { item: PickResult; index: number }) {
  return (
    <article className="pick-result-card reveal" style={{ "--delay": index } as CSSProperties}>
      <div className="pick-result-card__head">
        <div>
          <span>{item.strategy}</span>
          <strong>{item.omen}</strong>
        </div>
        {item.mode === "compound" && <b>{item.compoundCount} 注组合</b>}
      </div>
      <div className="pick-balls">
        <NumberBallGroup nums={item.front} />
        <NumberBallGroup nums={item.back} tone="back" />
      </div>
      <div className="pick-tags">{item.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="pick-profile">
        <span>{item.profile?.shape}</span>
        <span>{item.profile?.hotCold}</span>
        <span>{item.profile?.omission}</span>
        <span>{item.profile?.math}</span>
        <span>{item.profile?.back}</span>
      </div>
      <div className="pick-score-grid">
        {scoreLabels.map(([key, label]) => {
          const value = item.score?.[key] || 0;
          return <div key={key}><span>{label}</span><i><mark style={{ width: `${value}%` }} /></i><b>{value}</b></div>;
        })}
      </div>
      <p>{item.reason}</p>
    </article>
  );
}
