import { useEffect, useMemo, useRef, useState } from "react";
import { SectionHeader } from "../../components/SectionHeader";
import { getRangeDraws, parseNumberInput, uniqueSorted } from "../../domain/numbers";
import type { DltDraw, PickResult } from "../../types/dlt";
import { PickerControls, type PickerFormState } from "./PickerControls";
import { PickResultCard } from "./PickResultCard";
import { RitualStage } from "./RitualStage";
import { makePick, validatePickOptions, type PickOptions } from "./pickerStrategies";

const defaultState: PickerFormState = {
  strategy: "compass",
  range: "100",
  mode: "single",
  preference: "auto",
  count: 1,
  frontCount: 6,
  backCount: 3,
  excludeFront: "",
  excludeBack: "",
  fixedFront: "",
  fixedBack: ""
};

export function PickerPage({ draws }: { draws: DltDraw[] }) {
  const [state, setState] = useState(defaultState);
  const [results, setResults] = useState<PickResult[]>([]);
  const [rolling, setRolling] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [status, setStatus] = useState("选择策略后启动选号仪式。");
  const pendingRef = useRef<PickResult[]>([]);
  const timersRef = useRef<number[]>([]);
  const rangeDraws = useMemo(() => getRangeDraws(draws, state.range === "all" ? "all" : Number(state.range)), [draws, state.range]);
  const options = useMemo(() => toOptions(state), [state]);
  const errors = useMemo(() => validatePickOptions(options), [options]);

  useEffect(() => () => clearTimers(), []);

  function update(patch: Partial<PickerFormState>) {
    setState((current) => ({ ...current, ...patch }));
  }

  function generate() {
    if (errors.length) return;
    clearTimers();
    const picks = Array.from({ length: state.count }, () => makePick(rangeDraws, options));
    pendingRef.current = picks;
    setResults([]);
    setRolling(true);
    setActiveStep(0);
    setStatus("观测数据：读取当前区间画像。");
    schedule(260, () => { setActiveStep(1); setStatus("校准形态：匹配奇偶、大小、三区。"); });
    schedule(620, () => { setActiveStep(2); setStatus(state.count === 1 ? "洗牌落球：这一注正在成形。" : "封盘中：多注结果依次落位。"); });
    schedule(state.count === 1 ? 980 : 1380, reveal);
  }

  function reveal() {
    clearTimers();
    setActiveStep(3);
    setRolling(false);
    setResults(pendingRef.current);
    setStatus(pendingRef.current.length === 1 ? "揭晓签文：这一注已生成。" : "揭晓签文：结果签已生成。");
  }

  function schedule(delay: number, fn: () => void) {
    timersRef.current.push(window.setTimeout(fn, delay));
  }

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  return (
    <div className="page-stack">
      <SectionHeader title="娱乐选号" desc="基于分析画像、策略约束和选号仪式生成号码。" />
      <section className="panel picker-panel">
        <PickerControls disabled={rolling} state={state} errors={errors} onChange={update} onGenerate={generate} />
        <RitualStage activeStep={activeStep} rolling={rolling} status={status} onSkip={reveal} />
        <div className="ritual-results">
          {results.map((item, index) => <PickResultCard item={item} index={index} key={`${item.front.join("-")}-${item.back.join("-")}-${index}`} />)}
        </div>
      </section>
    </div>
  );
}

function toOptions(state: PickerFormState): PickOptions {
  return {
    strategy: state.strategy,
    mode: state.mode,
    preference: state.preference,
    excludeFront: clean(state.excludeFront),
    excludeBack: clean(state.excludeBack),
    fixedFront: clean(state.fixedFront),
    fixedBack: clean(state.fixedBack),
    frontCount: state.frontCount,
    backCount: state.backCount
  };
}

function clean(value: string) {
  return uniqueSorted(parseNumberInput(value));
}
