import type { DltDraw } from "../../../types/dlt";
import { omission } from "../../../domain/stats";

export function calcOmissionStats(draws: DltDraw[]) {
  const front = omission(draws, "front").sort((a, b) => b.current - a.current);
  const back = omission(draws, "back").sort((a, b) => b.current - a.current);
  return { front: front.slice(0, 10), back: back.slice(0, 6) };
}
