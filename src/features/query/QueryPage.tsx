import { useMemo, useState } from "react";
import { NumberBallGroup } from "../../components/NumberBall";
import { SectionHeader } from "../../components/SectionHeader";
import { evaluatePrize, isCompleteMatch } from "../../domain/rules";
import { parseNumberInput, uniqueSorted } from "../../domain/numbers";
import type { DltDraw } from "../../types/dlt";

export function QueryPage({ draws }: { draws: DltDraw[] }) {
  const [keyword, setKeyword] = useState("");
  const [frontText, setFrontText] = useState("01 06 14 15 17");
  const [backText, setBackText] = useState("02 03");
  const selectedFront = uniqueSorted(parseNumberInput(frontText)).slice(0, 5);
  const selectedBack = uniqueSorted(parseNumberInput(backText)).slice(0, 2);

  const rows = useMemo(() => {
    const kw = keyword.trim();
    return [...draws].reverse().filter((draw) => {
      if (!kw) return true;
      return draw.issue.includes(kw) || draw.date.includes(kw) || [...draw.front, ...draw.back].some((num) => String(num).padStart(2, "0") === kw);
    }).slice(0, 120);
  }, [draws, keyword]);

  const prizeRows = useMemo(() => {
    if (selectedFront.length !== 5 || selectedBack.length !== 2) return [];
    return draws.map((draw) => ({
      draw,
      prize: evaluatePrize(selectedFront, selectedBack, draw.front, draw.back),
      complete: isCompleteMatch(selectedFront, selectedBack, draw.front, draw.back)
    })).filter((row) => row.prize.level !== "未中奖").reverse();
  }, [draws, selectedBack, selectedFront]);

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
          <p className="card-note">已找到 {prizeRows.length} 次历史固定奖级命中，完全一致 {prizeRows.filter((row) => row.complete).length} 次。</p>
          <div className="draw-list compact">
            {prizeRows.slice(0, 80).map(({ draw, prize }) => (
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
