import type { DltDraw } from "../types/dlt";
import { validateDraws } from "./validation";

const KEY = "dlt-local-draws";

export function loadLocalDraws() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as DltDraw[] : [];
  } catch {
    return [];
  }
}

export function saveLocalDraws(draws: DltDraw[]) {
  const result = validateDraws(draws);
  if (!result.ok) throw new Error(result.errors.join("\n"));
  localStorage.setItem(KEY, JSON.stringify(draws));
}

export function mergeDraws(base: DltDraw[], local: DltDraw[]) {
  const map = new Map(base.map((draw) => [draw.issue, draw]));
  for (const draw of local) map.set(draw.issue, draw);
  return [...map.values()].sort((a, b) => a.issue.localeCompare(b.issue));
}
