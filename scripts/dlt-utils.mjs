import fs from "node:fs";
import path from "node:path";

export const ROOT = process.cwd();
export const MD_PATH = path.join(ROOT, "dlt_history_FULL.md");
export const DATA_PATH = path.join(ROOT, "data", "dlt-draws.json");
export const META_PATH = path.join(ROOT, "data", "dlt-meta.json");
export const EXPORT_MD_PATH = path.join(ROOT, "data", "dlt-history-export.md");

export function parseMarkdown(text) {
  const rowPattern = /^\|\s*(\d{5})\s*\|\s*([\d\s]+)\s*\|\s*([\d\s]+)\s*\|\s*(\d{4}-\d{2}-\d{2})\s*\|$/gm;
  return [...text.matchAll(rowPattern)].map((match) => normalizeDraw({
    issue: match[1],
    front: splitNums(match[2]),
    back: splitNums(match[3]),
    date: match[4],
    source: "dlt_history_FULL.md"
  }));
}

export function splitNums(value) {
  return String(value).trim().split(/\s+/).filter(Boolean).map(Number);
}

export function normalizeDraw(draw) {
  return {
    issue: String(draw.issue).padStart(5, "0"),
    date: String(draw.date),
    front: [...draw.front].map(Number).sort((a, b) => a - b),
    back: [...draw.back].map(Number).sort((a, b) => a - b),
    source: draw.source || "manual",
    importedAt: draw.importedAt || new Date().toISOString()
  };
}

export function validateDraws(draws) {
  const errors = [];
  const issues = new Set();
  const sorted = [...draws].sort((a, b) => a.issue.localeCompare(b.issue));

  for (const draw of draws) {
    validateOne(draw, errors);
    if (issues.has(draw.issue)) errors.push(`重复期号：${draw.issue}`);
    issues.add(draw.issue);
  }

  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index - 1].date > sorted[index].date) {
      errors.push(`日期顺序异常：${sorted[index - 1].issue} 晚于 ${sorted[index].issue}`);
    }
  }

  return { ok: errors.length === 0, errors };
}

function validateOne(draw, errors) {
  if (!/^\d{5}$/.test(draw.issue)) errors.push(`期号格式错误：${draw.issue}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draw.date) || Number.isNaN(Date.parse(draw.date))) {
    errors.push(`日期格式错误：${draw.issue} ${draw.date}`);
  }
  validateNums(draw.issue, "前区", draw.front, 5, 1, 35, errors);
  validateNums(draw.issue, "后区", draw.back, 2, 1, 12, errors);
}

function validateNums(issue, label, nums, count, min, max, errors) {
  if (!Array.isArray(nums) || nums.length !== count) {
    errors.push(`${issue} ${label}数量错误`);
    return;
  }
  const unique = new Set(nums);
  if (unique.size !== nums.length) errors.push(`${issue} ${label}存在重复号码`);
  for (const num of nums) {
    if (!Number.isInteger(num) || num < min || num > max) {
      errors.push(`${issue} ${label}号码越界：${num}`);
    }
  }
}

export function buildMeta(draws, source) {
  const sorted = [...draws].sort((a, b) => a.issue.localeCompare(b.issue));
  const latest = sorted.at(-1);
  return {
    version: 1,
    count: sorted.length,
    latestIssue: latest?.issue || "",
    latestDate: latest?.date || "",
    source,
    generatedAt: new Date().toISOString()
  };
}

export function toMarkdown(draws, meta = buildMeta(draws, "data/dlt-draws.json")) {
  const sorted = [...draws].sort((a, b) => a.issue.localeCompare(b.issue));
  const rows = sorted.map((draw) => (
    `| ${draw.issue} | ${formatNums(draw.front)} | ${formatNums(draw.back)} | ${draw.date} |`
  ));
  return [
    "# 体彩大乐透历史中奖号码",
    "",
    `共 **${meta.count}** 期 | 数据来源：${meta.source} | 统计区间：${sorted[0]?.date || ""} ~ ${meta.latestDate}`,
    "",
    "| 期号 | 前区 | 后区 | 开奖日期 |",
    "|------|------|------|----------|",
    ...rows,
    ""
  ].join("\n");
}

export function formatNums(nums) {
  return nums.map((num) => String(num).padStart(2, "0")).join(" ");
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
