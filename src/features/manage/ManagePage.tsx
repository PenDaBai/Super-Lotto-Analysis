import { useMemo, useState } from "react";
import { SectionHeader } from "../../components/SectionHeader";
import { parseCsvDraws, parseJsonDraws, parseMarkdownDraws, toMarkdown } from "../../data/importers";
import { saveLocalDraws } from "../../data/localStore";
import { validateDraws } from "../../data/validation";
import type { DltDraw } from "../../types/dlt";
import { downloadText } from "../../utils/download";

interface ManagePageProps {
  draws: DltDraw[];
  localDraws: DltDraw[];
  onLocalDraws: (draws: DltDraw[]) => void;
}

export function ManagePage({ draws, localDraws, onLocalDraws }: ManagePageProps) {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const validation = useMemo(() => validateDraws(draws), [draws]);

  function importText(kind: "md" | "csv" | "json") {
    try {
      const parsed = kind === "md" ? parseMarkdownDraws(input) : kind === "csv" ? parseCsvDraws(input) : parseJsonDraws(input);
      const merged = mergeByIssue(localDraws, parsed);
      saveLocalDraws(merged);
      onLocalDraws(merged);
      setMessage(`已导入 ${parsed.length} 条到浏览器本地存储。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "导入失败");
    }
  }

  return (
    <div className="page-stack">
      <SectionHeader title="数据管理" desc="浏览器内更新保存到本地存储，真实项目数据由脚本导入、导出和同步。" />
      <div className="manage-grid">
        <section className="panel">
          <h3>数据健康报告</h3>
          <p>当前合并数据：{draws.length} 期，本地新增/覆盖：{localDraws.length} 期。</p>
          <p className={validation.ok ? "ok-text" : "error-text"}>{validation.ok ? "校验通过" : "发现错误"}</p>
          {[...validation.errors, ...validation.warnings].slice(0, 12).map((item) => <p className="card-note" key={item}>{item}</p>)}
          <div className="button-row">
            <button type="button" onClick={() => downloadText("dlt-draws.json", JSON.stringify(draws, null, 2))}>导出 JSON</button>
            <button type="button" onClick={() => downloadText("dlt-history.md", toMarkdown(draws), "text/markdown")}>导出 Markdown</button>
          </div>
        </section>
        <section className="panel">
          <h3>批量导入</h3>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="粘贴 Markdown 表格、CSV 或 JSON" />
          <div className="button-row">
            <button type="button" onClick={() => importText("md")}>导入 Markdown</button>
            <button type="button" onClick={() => importText("csv")}>导入 CSV</button>
            <button type="button" onClick={() => importText("json")}>导入 JSON</button>
          </div>
          {message && <p className="card-note">{message}</p>}
        </section>
        <section className="panel">
          <h3>脚本同步</h3>
          <p><strong>平时更新只需要执行这一条：</strong></p>
          <code>npm run sync:dlt</code>
          <p className="card-note">它会自动读取官方历史接口，并从本地最新期开始补齐缺失数据。</p>
          <p><strong>如果很久没更新，断档较多：</strong></p>
          <code>npm run sync:dlt -- --limit=200</code>
          <p className="card-note">`limit` 表示向官方拉最近多少期。断档越久，数值可以越大。</p>
          <p><strong>可选检查，不是每次必须：</strong></p>
          <code>npm run data:validate</code>
          <p className="card-note">用于确认数据格式和最新元数据是否正常。`data:import-md` 和 `data:export-md` 只在导入/导出 Markdown 时使用。</p>
        </section>
      </div>
    </div>
  );
}

function mergeByIssue(base: DltDraw[], incoming: DltDraw[]) {
  const map = new Map(base.map((draw) => [draw.issue, draw]));
  for (const draw of incoming) map.set(draw.issue, { ...draw, source: "local-storage" });
  return [...map.values()].sort((a, b) => a.issue.localeCompare(b.issue));
}
