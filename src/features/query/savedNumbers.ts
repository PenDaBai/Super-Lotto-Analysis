import { BACK_RANGE, FRONT_RANGE, uniqueSorted } from "../../domain/numbers";

const STORAGE_KEY = "dlt-query-saved-numbers";

export interface NumberSelection {
  front: number[];
  back: number[];
}

export interface SavedNumberSet extends NumberSelection {
  savedAt: string;
}

export function normalizeNumberSelection(value: unknown): NumberSelection | null {
  if (!isRecord(value)) return null;

  const front = normalizeNumbers(value.front, FRONT_RANGE);
  const back = normalizeNumbers(value.back, BACK_RANGE);
  if (!front || !back || front.length < 5 || back.length < 2) return null;

  return { front, back };
}

export function sameNumberSelection(left: NumberSelection, right: NumberSelection) {
  return left.front.join(",") === right.front.join(",") && left.back.join(",") === right.back.join(",");
}

export function loadSavedNumberSet(): SavedNumberSet | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    const selection = normalizeNumberSelection(parsed);
    if (!selection) return null;

    const savedAt = isRecord(parsed) && typeof parsed.savedAt === "string" ? parsed.savedAt : "";
    return { ...selection, savedAt };
  } catch {
    return null;
  }
}

export function saveNumberSet(selection: NumberSelection) {
  const normalized = normalizeNumberSelection(selection);
  if (!normalized) throw new Error("至少需要选择 5 个前区号码和 2 个后区号码。");

  const saved: SavedNumberSet = { ...normalized, savedAt: new Date().toISOString() };
  if (typeof window === "undefined") throw new Error("当前环境不支持浏览器本地存储。");
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return saved;
}

export function clearSavedNumberSet() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

function normalizeNumbers(value: unknown, range: number[]) {
  if (!Array.isArray(value) || !value.every((num) => Number.isInteger(num))) return null;
  const numbers = uniqueSorted(value as number[]);
  return numbers.every((num) => range.includes(num)) ? numbers : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
