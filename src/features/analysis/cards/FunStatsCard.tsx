import type { CSSProperties } from "react";
import { StatCard } from "../../../components/StatCard";
import type { DltDraw } from "../../../types/dlt";
import { calcFunStats } from "../calculators/funStats";

export function FunStatsCard({ draws }: { draws: DltDraw[] }) {
  const data = calcFunStats(draws);
  const tails = Object.entries(data.tail).sort((a, b) => b[1] - a[1]);
  const maxTail = Math.max(...tails.map(([, count]) => count), 1);
  return (
    <StatCard title="趣味玄学" subtitle="把当前区间的数据气质做成娱乐画像。" accent="#be123c">
      <div className="fun-persona">
        <div>
          <span className="fun-kicker">当前区间气质</span>
          <strong>{data.portrait.title}</strong>
          <p>{data.portrait.desc}</p>
        </div>
        <div className="fun-tail-pair" title="前区个位尾数的出现强弱">
          <span>旺尾 <HelpDot text="前区个位数里出现次数最多的尾数。例如旺尾 3，代表 03、13、23、33 这一类尾数在当前区间更常见。" /> <b>{data.topTail?.num ?? "-"}</b></span>
          <span>静尾 <HelpDot text="前区个位数里出现次数最少的尾数。它只是当前区间的统计结果，不是推荐或预测。" /> <b>{data.quietTail?.num ?? "-"}</b></span>
          <span>后区旺尾 <HelpDot text="后区号码也按个位数统计。因为后区只有 01-12，所以这个只作为轻量观察。" /> <b>{data.topBackTail?.num ?? "-"}</b></span>
        </div>
      </div>
      <h4 className="fun-section-title">前区趣味评分（百分值）</h4>
      <div className="fun-score-list">
        {data.frontScores.map((item) => <ScoreBar key={item.label} {...item} />)}
      </div>
      <h4 className="fun-section-title">后区趣味评分（百分值）</h4>
      <div className="fun-score-list fun-score-list--back">
        {data.backScores.map((item) => <ScoreBar key={item.label} {...item} />)}
      </div>
      <div className="fun-snippets">
        {data.snippets.map((item) => (
          <div key={item.label} title={item.tip}>
            <span>{item.label} <HelpDot text={item.tip} /></span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      <h4 className="fun-section-title">尾数气场</h4>
      <div className="tail-aura">
        {tails.map(([tail, count], index) => (
          <div key={tail} className={index < 5 ? "tail-aura__item--hot" : "tail-aura__item--quiet"} style={tailStyle(count, maxTail)}>
            <b>尾{tail}</b>
            <small>{count} 次</small>
            <span className="tail-aura__mark" />
          </div>
        ))}
      </div>
    </StatCard>
  );
}

function ScoreBar({ label, value, tip, detail }: { label: string; value: number; tip: string; detail: string }) {
  return (
    <div className="fun-score" title={tip}>
      <div className="fun-score__head">
        <span>{label} <HelpDot text={tip} /></span>
        <b>{value}分</b>
      </div>
      <em>当前数据：{detail}</em>
      <div className="fun-score__bar"><span style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function HelpDot({ text }: { text: string }) {
  return <i className="fun-help" title={text} aria-label={text}>?</i>;
}

function tailStyle(count: number, maxTail: number) {
  const power = count / maxTail;
  return {
    "--tail-alpha": String(0.08 + power * 0.2),
    "--tail-width": `${Math.max(22, power * 100)}%`
  } as CSSProperties;
}
