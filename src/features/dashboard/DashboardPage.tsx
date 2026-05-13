import { Activity, Database, Search, Sparkles } from "lucide-react";
import { NumberBallGroup } from "../../components/NumberBall";
import { SectionHeader } from "../../components/SectionHeader";
import { getLatestDraw } from "../../domain/numbers";
import type { DltDraw, DltMeta } from "../../types/dlt";

interface DashboardPageProps {
  draws: DltDraw[];
  meta: DltMeta;
  onTab: (tab: string) => void;
}

export function DashboardPage({ draws, meta, onTab }: DashboardPageProps) {
  const latest = getLatestDraw(draws);
  return (
    <div className="page-stack">
      <SectionHeader title="大乐透玄学研究所" desc="查询、分析、数据管理和娱乐选号集中在一个本地网页里。" />
      <section className="hero-panel">
        <div>
          <span className="eyebrow">最新开奖</span>
          <h1>{latest?.issue} 期</h1>
          <p>{latest?.date} · 当前数据 {draws.length} 期 · 基础元数据 {meta.count} 期</p>
          {latest && <div className="hero-balls"><NumberBallGroup nums={latest.front} /><NumberBallGroup nums={latest.back} tone="back" /></div>}
        </div>
      </section>
      <div className="quick-grid">
        <Quick icon={<Search />} title="查历史号码" text="按期号、日期、号码检索。" onClick={() => onTab("query")} />
        <Quick icon={<Activity />} title="看分析卡片" text="冷热、遗漏、结构、共现和趣味观察。" onClick={() => onTab("analysis")} />
        <Quick icon={<Sparkles />} title="娱乐选号" text="按策略生成并展示依据。" onClick={() => onTab("picker")} />
        <Quick icon={<Database />} title="管数据" text="导入、导出、校验和同步说明。" onClick={() => onTab("manage")} />
      </div>
    </div>
  );
}

function Quick({ icon, title, text, onClick }: { icon: React.ReactNode; title: string; text: string; onClick: () => void }) {
  return (
    <button className="quick-card" type="button" onClick={onClick}>
      {icon}
      <strong>{title}</strong>
      <span>{text}</span>
    </button>
  );
}
