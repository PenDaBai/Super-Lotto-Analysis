import { useMemo, useState } from "react";
import { RangeSelector } from "../../components/RangeSelector";
import { SectionHeader } from "../../components/SectionHeader";
import { getRangeDraws } from "../../domain/numbers";
import type { DltDraw, RangeOption } from "../../types/dlt";
import { analysisCards } from "./cardRegistry";

const ranges: RangeOption[] = [
  { key: "all", label: "全部", count: "all" },
  { key: "200", label: "近200期", count: 200 },
  { key: "100", label: "近100期", count: 100 },
  { key: "50", label: "近50期", count: 50 },
  { key: "30", label: "近30期", count: 30 },
  { key: "10", label: "近10期", count: 10 },
  { key: "custom", label: "自定义", count: "custom" }
];

export function AnalysisPage({ draws }: { draws: DltDraw[] }) {
  const [activeRange, setActiveRange] = useState("100");
  const [customCount, setCustomCount] = useState(80);
  const rangeDraws = useMemo(() => {
    const range = ranges.find((item) => item.key === activeRange);
    const count = range?.count === "custom" ? customCount : range?.count || "all";
    return getRangeDraws(draws, count === "all" ? "all" : Number(count));
  }, [activeRange, customCount, draws]);

  return (
    <div className="page-stack">
      <SectionHeader
        title="数据分析"
        desc="所有卡片都跟随下方区间切换，分析仅供娱乐。"
      />
      <div className="analysis-toolbar">
        <span className="analysis-toolbar__meta">当前分析 {rangeDraws.length} 期</span>
        <RangeSelector options={ranges} activeKey={activeRange} customCount={customCount} onChange={setActiveRange} onCustomCount={setCustomCount} />
      </div>
      <div className="analysis-grid">
        {analysisCards.map(({ id, Component }) => <Component key={id} draws={rangeDraws} allDraws={draws} />)}
      </div>
    </div>
  );
}
