import { useMemo, useState } from "react";
import { NumberBallGroup } from "../../components/NumberBall";
import { SectionHeader } from "../../components/SectionHeader";
import type { PrizeLevel } from "../../domain/rules";
import { parseNumberInput, uniqueSorted } from "../../domain/numbers";
import type { DltDraw } from "../../types/dlt";
import { NumberPickPanel } from "./NumberPickPanel";
import { PrizeLevelFilter } from "./PrizeLevelFilter";
import { calcPrizeHits, filterPrizeHits, summarizePrizeHits } from "./prizeStats";

export function QueryPage({ draws }: { draws: DltDraw[] }) {
  const [keyword, setKeyword] = useState("");
  const [frontText, setFrontText] = useState("01 06 14 15 17");
  const [backText, setBackText] = useState("02 03");
  const [visibleLevels, setVisibleLevels] = useState<PrizeLevel[]>(["一等奖", "二等奖", "三等奖"]);
  const selectedFront = uniqueSorted(parseNumberInput(frontText)).filter((num) => num >= 1 && num <= 35);
  const selectedBack = uniqueSorted(parseNumberInput(backText)).filter((num) => num >= 1 && num <= 12);

  const rows = useMemo(() => {
    const kw = keyword.trim();
    return [...draws].reverse().filter((draw) => {
      if (!kw) return true;
      return draw.issue.includes(kw) || draw.date.includes(kw) || [...draw.front, ...draw.back].some((num) => String(num).padStart(2, "0") === kw);
    }).slice(0, 120);
  }, [draws, keyword]);

  const prizeRows = useMemo(() => calcPrizeHits(draws, selectedFront, selectedBack), [draws, selectedBack, selectedFront]);
  const prizeSummary = useMemo(() => summarizePrizeHits(prizeRows), [prizeRows]);
  const visiblePrizeRows = useMemo(() => filterPrizeHits(prizeRows, visibleLevels), [prizeRows, visibleLevels]);

  return (
    <div className="page-stack">
      <SectionHeader title="查询与中奖检查" desc="按期号、日期、号码检索，也可以检查一组号码历史命中情况。" />
      <div className="query-grid">
        <section className="panel">
          <h3>历史开奖</h3>
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="输入期号、日期或号码，如 26051 / 2026-05 / 08" />
          <div className="draw-list">
            {rows.map((draw) => <DrawRow key={draw.issue} draw={draw} />)}
          </div>
        </section>
        <section className="panel">
          <h3>我选的号码是否中过奖</h3>
          <div className="form-row"><label>前区</label><input value={frontText} onChange={(e) => setFrontText(e.target.value)} /></div>
          <div className="form-row"><label>后区</label><input value={backText} onChange={(e) => setBackText(e.target.value)} /></div>
          <NumberPickPanel front={selectedFront} back={selectedBack} onFront={setFrontText} onBack={setBackText} />
          <PrizeSummary rows={prizeSummary} />
          <PrizeLevelFilter selected={visibleLevels} onChange={setVisibleLevels} />
          <p className="card-note">按复式票最高奖级统计：共命中 {prizeRows.length} 次，当前筛选显示 {visiblePrizeRows.length} 次；完整覆盖开奖号码 {prizeRows.filter((row) => row.complete).length} 次。</p>
          <div className="draw-list compact">
            {visiblePrizeRows.slice(0, 80).map(({ draw, prize }) => (
              <div className="draw-row" key={draw.issue}>
                <span>{draw.issue}</span>
                <b>{prize.level}</b>
                <small>前 {prize.frontHits} / 后 {prize.backHits}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function PrizeSummary({ rows }: { rows: Array<{ level: PrizeLevel; count: number }> }) {
  return (
    <div className="prize-summary">
      {rows.map((item) => (
        <span key={item.level}>
          {item.level}
          <b>{item.count}</b>
        </span>
      ))}
    </div>
  );
}

function DrawRow({ draw }: { draw: DltDraw }) {
  return (
    <div className="draw-row">
      <span>{draw.issue}</span>
      <small>{draw.date}</small>
      <NumberBallGroup nums={draw.front} />
      <NumberBallGroup nums={draw.back} tone="back" />
    </div>
  );
}
