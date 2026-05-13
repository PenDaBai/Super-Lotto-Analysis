import type { DltDraw, ValidationResult } from "../types/dlt";

export function validateDraws(draws: DltDraw[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const issues = new Set<string>();

  for (const draw of draws) {
    validateDraw(draw, errors);
    if (issues.has(draw.issue)) errors.push(`重复期号：${draw.issue}`);
    issues.add(draw.issue);
  }

  const sorted = [...draws].sort((a, b) => a.issue.localeCompare(b.issue));
  if (sorted.length && sorted.at(-1)?.date !== [...sorted].sort((a, b) => a.date.localeCompare(b.date)).at(-1)?.date) {
    warnings.push("期号顺序与日期顺序可能不完全一致，请检查数据来源。");
  }

  return { ok: errors.length === 0, errors, warnings };
}

export function validateDraw(draw: DltDraw, errors: string[] = []) {
  if (!/^\d{5}$/.test(draw.issue)) errors.push(`期号格式错误：${draw.issue}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draw.date) || Number.isNaN(Date.parse(draw.date))) {
    errors.push(`日期格式错误：${draw.issue}`);
  }
  checkArea(draw.issue, "前区", draw.front, 5, 1, 35, errors);
  checkArea(draw.issue, "后区", draw.back, 2, 1, 12, errors);
  return errors;
}

function checkArea(issue: string, label: string, nums: number[], count: number, min: number, max: number, errors: string[]) {
  if (nums.length !== count) errors.push(`${issue} ${label}数量错误`);
  if (new Set(nums).size !== nums.length) errors.push(`${issue} ${label}存在重复号码`);
  if (nums.some((num) => !Number.isInteger(num) || num < min || num > max)) {
    errors.push(`${issue} ${label}号码越界`);
  }
}
