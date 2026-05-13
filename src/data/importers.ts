import type { DltDraw } from "../types/dlt";
import { uniqueSorted } from "../domain/numbers";

export function parseMarkdownDraws(text: string, source = "manual-md"): DltDraw[] {
  const pattern = /^\|\s*(\d{5})\s*\|\s*([\d\s]+)\s*\|\s*([\d\s]+)\s*\|\s*(\d{4}-\d{2}-\d{2})\s*\|$/gm;
  return [...text.matchAll(pattern)].map((match) => makeDraw(match[1], match[4], match[2], match[3], source));
}

export function parseCsvDraws(text: string, source = "manual-csv"): DltDraw[] {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const [issue, front, back, date] = line.split(/,|\t/).map((item) => item.trim());
    return makeDraw(issue, date, front, back, source);
  });
}

export function parseJsonDraws(text: string): DltDraw[] {
  const value = JSON.parse(text);
  const rows = Array.isArray(value) ? value : value.draws;
  if (!Array.isArray(rows)) throw new Error("JSON 必须是数组，或包含 draws 数组。");
  return rows.map((row) => ({
    ...row,
    front: uniqueSorted(row.front),
    back: uniqueSorted(row.back),
    importedAt: row.importedAt || new Date().toISOString()
  }));
}

export function toMarkdown(draws: DltDraw[]) {
  const rows = [...draws].sort((a, b) => a.issue.localeCompare(b.issue)).map((draw) => (
    `| ${draw.issue} | ${fmt(draw.front)} | ${fmt(draw.back)} | ${draw.date} |`
  ));
  return ["| 期号 | 前区 | 后区 | 开奖日期 |", "|------|------|------|----------|", ...rows].join("\n");
}

function makeDraw(issue: string, date: string, front: string, back: string, source: string): DltDraw {
  return {
    issue: String(issue).padStart(5, "0"),
    date,
    front: uniqueSorted(front.trim().split(/\s+/).map(Number)),
    back: uniqueSorted(back.trim().split(/\s+/).map(Number)),
    source,
    importedAt: new Date().toISOString()
  };
}

function fmt(nums: number[]) {
  return nums.map((num) => String(num).padStart(2, "0")).join(" ");
}
