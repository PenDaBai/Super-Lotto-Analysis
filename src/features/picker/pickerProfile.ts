import { BACK_RANGE, FRONT_RANGE } from "../../domain/numbers";
import { frequency, omission } from "../../domain/stats";
import type { DltDraw } from "../../types/dlt";

const PRIMES = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]);

export interface PickerProfile {
  draws: number;
  hotFront: number[];
  coldFront: number[];
  hotBack: number[];
  coldBack: number[];
  frontHeat: Record<number, number>;
  backHeat: Record<number, number>;
  frontOmission: Record<number, number>;
  backOmission: Record<number, number>;
  targetOdd: number;
  targetBig: number;
  targetZones: [number, number, number];
  primeAvg: number;
  modCoverRate: number;
  centerPull: number;
  tailCounts: Record<number, number>;
  calendar: { month: number; day: number; backDay?: number };
}

export function buildPickerProfile(draws: DltDraw[], now = new Date()) {
  const frontFreq = frequency(draws, "front").sort((a, b) => b.count - a.count);
  const backFreq = frequency(draws, "back").sort((a, b) => b.count - a.count);
  const frontOmission = omission(draws, "front");
  const backOmission = omission(draws, "back");
  return {
    draws: draws.length,
    hotFront: frontFreq.slice(0, 12).map((item) => item.num),
    coldFront: frontFreq.slice(-10).map((item) => item.num),
    hotBack: backFreq.slice(0, 5).map((item) => item.num),
    coldBack: backFreq.slice(-4).map((item) => item.num),
    frontHeat: scoreMap(frontFreq.map((item) => [item.num, item.count])),
    backHeat: scoreMap(backFreq.map((item) => [item.num, item.count])),
    frontOmission: scoreMap(frontOmission.map((item) => [item.num, item.current])),
    backOmission: scoreMap(backOmission.map((item) => [item.num, item.current])),
    targetOdd: topCount(draws.map((draw) => draw.front.filter((num) => num % 2 === 1).length)),
    targetBig: topCount(draws.map((draw) => draw.front.filter((num) => num >= 18).length)),
    targetZones: topZones(draws),
    primeAvg: average(draws.map((draw) => draw.front.filter((num) => PRIMES.has(num)).length)),
    modCoverRate: ratio(draws.filter((draw) => new Set(draw.front.map((num) => num % 3)).size === 3).length, draws.length),
    centerPull: average(draws.map((draw) => average(draw.front.map((num) => Math.abs(num - 18))))),
    tailCounts: countTails(draws.flatMap((draw) => draw.front)),
    calendar: calendarSignal(now)
  } satisfies PickerProfile;
}

export function classifyHeat(num: number, profile: PickerProfile) {
  if (profile.hotFront.includes(num)) return "热";
  if (profile.coldFront.includes(num)) return "冷";
  return "温";
}

export function structureOf(front: number[]) {
  const sorted = [...front].sort((a, b) => a - b);
  const odd = sorted.filter((num) => num % 2 === 1).length;
  const big = sorted.filter((num) => num >= 18).length;
  const zones = zoneCounts(sorted);
  return {
    sum: sorted.reduce((sum, num) => sum + num, 0),
    span: sorted.at(-1)! - sorted[0],
    oddEven: `${odd}:${sorted.length - odd}奇偶`,
    bigSmall: `${big}:${sorted.length - big}大小`,
    zones: `低${zones[0]}中${zones[1]}高${zones[2]}`
  };
}

export function zoneCounts(nums: number[]) {
  const zones: [number, number, number] = [0, 0, 0];
  nums.forEach((num) => { zones[num <= 12 ? 0 : num <= 24 ? 1 : 2] += 1; });
  return zones;
}

function scoreMap(entries: Array<[number, number]>) {
  const max = Math.max(...entries.map(([, value]) => value), 1);
  return Object.fromEntries(entries.map(([num, value]) => [num, value / max]));
}

function topCount(values: number[]) {
  return Number(topEntries(values)[0]?.[0] || 0);
}

function topZones(draws: DltDraw[]) {
  const key = String(topEntries(draws.map((draw) => zoneCounts(draw.front).join("-")))[0]?.[0] || "2-1-2");
  return key.split("-").map(Number) as [number, number, number];
}

function topEntries<T extends string | number>(values: T[]) {
  const map = values.reduce<Map<T, number>>((acc, value) => acc.set(value, (acc.get(value) || 0) + 1), new Map());
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function countTails(nums: number[]) {
  const counts = Object.fromEntries(Array.from({ length: 10 }, (_, tail) => [tail, 0]));
  nums.forEach((num) => { counts[num % 10] += 1; });
  return counts;
}

function calendarSignal(now: Date) {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return { month, day, backDay: day <= 12 ? day : undefined };
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function ratio(value: number, total: number) {
  return total ? value / total : 0;
}

export { BACK_RANGE, FRONT_RANGE, PRIMES };
