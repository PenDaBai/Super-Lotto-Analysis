import type { DltDraw } from "../types/dlt";

export const FRONT_RANGE = Array.from({ length: 35 }, (_, index) => index + 1);
export const BACK_RANGE = Array.from({ length: 12 }, (_, index) => index + 1);

export function formatNumber(num: number) {
  return String(num).padStart(2, "0");
}

export function formatNums(nums: number[]) {
  return nums.map(formatNumber).join(" ");
}

export function uniqueSorted(nums: number[]) {
  return [...new Set(nums.map(Number))].sort((a, b) => a - b);
}

export function parseNumberInput(value: string) {
  return value
    .split(/[,\s，、|]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map(Number)
    .filter((num) => Number.isInteger(num));
}

export function drawKey(front: number[], back: number[]) {
  return `${formatNums(uniqueSorted(front))} | ${formatNums(uniqueSorted(back))}`;
}

export function getLatestDraw(draws: DltDraw[]) {
  return [...draws].sort((a, b) => a.issue.localeCompare(b.issue)).at(-1);
}

export function getRangeDraws(draws: DltDraw[], count: number | "all") {
  const sorted = [...draws].sort((a, b) => a.issue.localeCompare(b.issue));
  return count === "all" ? sorted : sorted.slice(-count);
}

export function countHits(source: number[], target: number[]) {
  const set = new Set(target);
  return source.filter((num) => set.has(num)).length;
}
