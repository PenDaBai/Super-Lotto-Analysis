import { useMemo, useState } from "react";
import { BarChart3, Database, Home, Search, Sparkles } from "lucide-react";
import { Disclaimer } from "./components/Disclaimer";
import { baseDraws, baseMeta } from "./data/staticData";
import { loadLocalDraws, mergeDraws } from "./data/localStore";
import { AnalysisPage } from "./features/analysis/AnalysisPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { ManagePage } from "./features/manage/ManagePage";
import { PickerPage } from "./features/picker/PickerPage";
import { QueryPage } from "./features/query/QueryPage";

const tabs = [
  { key: "home", label: "首页", icon: Home },
  { key: "query", label: "查询", icon: Search },
  { key: "analysis", label: "分析", icon: BarChart3 },
  { key: "picker", label: "选号", icon: Sparkles },
  { key: "manage", label: "数据", icon: Database }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [localDraws, setLocalDraws] = useState(() => loadLocalDraws());
  const draws = useMemo(() => mergeDraws(baseDraws, localDraws), [localDraws]);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <strong>DLT Lab</strong>
          <span>大乐透玄学研究所</span>
        </div>
        <nav>
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} className={activeTab === key ? "active" : ""} onClick={() => setActiveTab(key)} type="button">
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </aside>
      <main>
        <Disclaimer />
        {activeTab === "home" && <DashboardPage draws={draws} meta={baseMeta} onTab={setActiveTab} />}
        {activeTab === "query" && <QueryPage draws={draws} />}
        {activeTab === "analysis" && <AnalysisPage draws={draws} />}
        {activeTab === "picker" && <PickerPage draws={draws} />}
        {activeTab === "manage" && <ManagePage draws={draws} localDraws={localDraws} onLocalDraws={setLocalDraws} />}
      </main>
    </div>
  );
}
