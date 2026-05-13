import { useState } from "react";
import { NumberBallGroup } from "../../components/NumberBall";
import { SectionHeader } from "../../components/SectionHeader";
import { parseNumberInput } from "../../domain/numbers";
import type { DltDraw, PickResult } from "../../types/dlt";
import { makePick, type PickStrategy } from "./pickerStrategies";

export function PickerPage({ draws }: { draws: DltDraw[] }) {
  const [strategy, setStrategy] = useState<PickStrategy>("balanced");
  const [excludeText, setExcludeText] = useState("");
  const [fixedText, setFixedText] = useState("");
  const [results, setResults] = useState<PickResult[]>([]);

  function generate() {
    const excludes = parseNumberInput(excludeText);
    const fixed = parseNumberInput(fixedText).slice(0, 5);
    setResults(Array.from({ length: 5 }, () => makePick(draws.slice(-100), strategy, excludes, fixed)));
  }

  return (
    <div className="page-stack">
      <SectionHeader title="娱乐选号" desc="基于随机、均衡、冷热、遗漏等策略生成号码。" />
      <section className="panel picker-panel">
        <div className="control-row">
          <select value={strategy} onChange={(e) => setStrategy(e.target.value as PickStrategy)}>
            <option value="random">完全随机</option>
            <option value="balanced">均衡选号</option>
            <option value="hotCold">热冷混搭</option>
            <option value="omission">遗漏回补</option>
          </select>
          <input value={excludeText} onChange={(e) => setExcludeText(e.target.value)} placeholder="排除号，如 01 02 03" />
          <input value={fixedText} onChange={(e) => setFixedText(e.target.value)} placeholder="定胆，如 08 19" />
          <button type="button" onClick={generate}>生成 5 注</button>
        </div>
        <div className="pick-list">
          {results.map((item, index) => (
            <div className="pick-row" key={`${item.front.join("-")}-${index}`}>
              <b>{item.strategy}</b>
              <NumberBallGroup nums={item.front} />
              <NumberBallGroup nums={item.back} tone="back" />
              <small>{item.reason} 仅供娱乐，不构成购彩建议。</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
