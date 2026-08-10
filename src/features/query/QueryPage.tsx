import { useMemo, useState } from "react";
import { NumberBallGroup } from "../../components/NumberBall";
import { SectionHeader } from "../../components/SectionHeader";
import type { PrizeLevel } from "../../domain/rules";
import { formatNums, parseNumberInput, uniqueSorted } from "../../domain/numbers";
import type { DltDraw } from "../../types/dlt";
import { NumberPickPanel } from "./NumberPickPanel";
import { PrizeLevelFilter } from "./PrizeLevelFilter";
import { calcPrizeHits, filterPrizeHits, summarizePrizeHits } from "./prizeStats";
import { clearSavedNumberSet, loadSavedNumberSet, sameNumberSelection, saveNumberSet } from "./savedNumbers";
import { SavedNumbersBar } from "./SavedNumbersBar";

export function QueryPage({ draws }: { draws: DltDraw[] }) {
  const [keyword, setKeyword] = useState("");
  const [savedNumbers, setSavedNumbers] = useState(() => loadSavedNumberSet());
  const [frontText, setFrontText] = useState(() => formatNums(savedNumbers?.front ?? []));
  const [backText, setBackText] = useState(() => formatNums(savedNumbers?.back ?? []));
  const [visibleLevels, setVisibleLevels] = useState<PrizeLevel[]>(["一等奖", "二等奖", "三等奖"]);
  const [saveMessage, setSaveMessage] = useState("");
  const parsedFront = uniqueSorted(parseNumberInput(frontText));
  const parsedBack = uniqueSorted(parseNumberInput(backText));
  const selectedFront = parsedFront.filter((num) => num >= 1 && num <= 35);
  const selectedBack = parsedBack.filter((num) => num >= 1 && num <= 12);
  const hasInvalidNumber = parsedFront.some((num) => num < 1 || num > 35) || parsedBack.some((num) => num < 1 || num > 12);
  const canSave = selectedFront.length >= 5 && selectedBack.length >= 2 && !hasInvalidNumber;
  const isCurrentSaved = Boolean(
    savedNumbers && sameNumberSelection(savedNumbers, { front: selectedFront, back: selectedBack })
  );

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

  function updateFront(value: string) {
    setFrontText(value);
    setSaveMessage("");
  }

  function updateBack(value: string) {
    setBackText(value);
    setSaveMessage("");
  }

  function handleSave() {
    if (!canSave) {
      setSaveMessage("请先选择至少 5 个前区号码和 2 个后区号码，且号码不能越界。");
      return;
    }

    try {
      setSavedNumbers(saveNumberSet({ front: selectedFront, back: selectedBack }));
      setSaveMessage("已保存到当前浏览器。");
    } catch {
      setSaveMessage("保存失败，请检查浏览器是否允许本地存储。");
    }
  }

  function handleClearSaved() {
    clearSavedNumberSet();
    setSavedNumbers(null);
    setSaveMessage("已清除保存记录，当前号码仍保留。");
  }

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
          <div className="form-row"><label>前区</label><input placeholder="例如 01 06 14 15 17" value={frontText} onChange={(e) => updateFront(e.target.value)} /></div>
          <div className="form-row"><label>后区</label><input placeholder="例如 02 03" value={backText} onChange={(e) => updateBack(e.target.value)} /></div>
          <SavedNumbersBar saved={savedNumbers} isCurrent={isCurrentSaved} canSave={canSave} onSave={handleSave} onClear={handleClearSaved} />
          {saveMessage && <p className="card-note saved-number-message">{saveMessage}</p>}
          <NumberPickPanel front={selectedFront} back={selectedBack} onFront={updateFront} onBack={updateBack} />
          {selectedFront.length >= 5 && selectedBack.length >= 2 ? (
            <>
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
            </>
          ) : (
            <p className="card-note">请至少选择 5 个前区号码和 2 个后区号码，系统会统计历史命中奖级。</p>
          )}
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
