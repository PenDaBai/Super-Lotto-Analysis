import { Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
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
  const [rolling, setRolling] = useState(false);
  const [ritualText, setRitualText] = useState("选择策略后开始生成。");
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  function generate(count: 1 | 5) {
    const excludes = parseNumberInput(excludeText);
    const fixed = parseNumberInput(fixedText).slice(0, 5);
    setRolling(true);
    setResults([]);
    setRitualText(count === 1 ? "正在洗牌，准备揭晓这一注。" : "正在洗牌，5 注将依次揭晓。");

    timerRef.current = window.setTimeout(() => {
      setResults(Array.from({ length: count }, () => makePick(draws.slice(-100), strategy, excludes, fixed)));
      setRolling(false);
      setRitualText(count === 1 ? "这一注已生成，仅供娱乐。" : "5 注已生成，仅供娱乐。");
    }, count === 1 ? 850 : 1250);
  }

  return (
    <div className="page-stack">
      <SectionHeader title="娱乐选号" desc="基于随机、均衡、冷热、遗漏等策略生成号码。" />
      <section className="panel picker-panel">
        <div className={`picker-stage ${rolling ? "is-rolling" : ""}`}>
          <div className="picker-stage__content">
            <div className="picker-stage__title">
              <div>
                <h3>选号仪式台</h3>
                <p>选择策略、排除号和定胆，然后生成号码。</p>
              </div>
              <span className="ritual-status">{ritualText}</span>
            </div>
            <div className="ritual-orbit" aria-hidden="true">
              {[3, 8, 12, 19, 27, 6, 11].map((num) => <span key={num}>{String(num).padStart(2, "0")}</span>)}
            </div>
            <PickerControls
              disabled={rolling}
              strategy={strategy}
              excludeText={excludeText}
              fixedText={fixedText}
              onStrategy={setStrategy}
              onExclude={setExcludeText}
              onFixed={setFixedText}
              onGenerate={generate}
            />
          </div>
        </div>
        <div className="pick-list ritual-results">
          {results.map((item, index) => <PickRow item={item} index={index} key={`${item.front.join("-")}-${item.back.join("-")}-${index}`} />)}
        </div>
      </section>
    </div>
  );
}

function PickerControls({ disabled, strategy, excludeText, fixedText, onStrategy, onExclude, onFixed, onGenerate }: ControlsProps) {
  return (
    <>
      <div className="picker-controls">
        <select value={strategy} disabled={disabled} onChange={(e) => onStrategy(e.target.value as PickStrategy)}>
          <option value="random">完全随机</option>
          <option value="balanced">均衡选号</option>
          <option value="hotCold">热冷混搭</option>
          <option value="omission">遗漏回补</option>
        </select>
        <input value={excludeText} disabled={disabled} onChange={(e) => onExclude(e.target.value)} placeholder="排除号，如 01 02 03" />
        <input value={fixedText} disabled={disabled} onChange={(e) => onFixed(e.target.value)} placeholder="定胆，如 08 19" />
      </div>
      <div className="picker-actions">
        <button className="ritual-button primary" disabled={disabled} type="button" onClick={() => onGenerate(1)}><Sparkles size={18} />生成一注</button>
        <button className="ritual-button" disabled={disabled} type="button" onClick={() => onGenerate(5)}><Sparkles size={18} />生成 5 注</button>
      </div>
    </>
  );
}

function PickRow({ item, index }: { item: PickResult; index: number }) {
  return (
    <div className="pick-row reveal" style={{ "--delay": index } as CSSProperties}>
      <b>{item.strategy}</b>
      <NumberBallGroup nums={item.front} />
      <NumberBallGroup nums={item.back} tone="back" />
      <small>{item.reason} 仅供娱乐，不构成购彩建议。</small>
    </div>
  );
}

interface ControlsProps {
  disabled: boolean;
  strategy: PickStrategy;
  excludeText: string;
  fixedText: string;
  onStrategy: (value: PickStrategy) => void;
  onExclude: (value: string) => void;
  onFixed: (value: string) => void;
  onGenerate: (count: 1 | 5) => void;
}
