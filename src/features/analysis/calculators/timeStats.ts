import { frequency } from "../../../domain/stats";
import type { DltDraw } from "../../../types/dlt";

export function calcTimeStats(draws: DltDraw[]) {
  const sorted = [...draws].sort((a, b) => a.issue.localeCompare(b.issue));
  const longWindow = sorted.slice(-Math.min(100, sorted.length));
  const shortWindow = sorted.slice(-Math.min(30, sorted.length));
  return {
    front: migration(longWindow, shortWindow, "front"),
    back: migration(longWindow, shortWindow, "back"),
    longCount: longWindow.length,
    shortCount: shortWindow.length
  };
}

function migration(longWindow: DltDraw[], shortWindow: DltDraw[], area: "front" | "back") {
  const longMap = new Map(frequency(longWindow, area).map((item) => [item.num, item.count / Math.max(longWindow.length, 1)]));
  return frequency(shortWindow, area)
    .map((item) => {
      const shortRate = item.count / Math.max(shortWindow.length, 1);
      const longRate = longMap.get(item.num) || 0;
      return {
        num: item.num,
        shortCount: item.count,
        longRate,
        shortRate,
        delta: shortRate - longRate
      };
    })
    .sort((a, b) => b.delta - a.delta);
}
