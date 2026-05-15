import { BACK_RANGE, FRONT_RANGE, PRIMES, buildPickerProfile, classifyHeat, structureOf, type PickerProfile } from "./pickerProfile";
import { uniqueSorted } from "../../domain/numbers";
import type { DltDraw, PickResult } from "../../types/dlt";

export type PickStrategy = "random" | "balanced" | "hotCold" | "omission" | "texture" | "calendar" | "compass";
export type PickMode = "single" | "compound";
export type PickPreference = "auto" | "balance" | "hot" | "cold" | "omission" | "texture";

export interface PickOptions {
  strategy: PickStrategy;
  mode: PickMode;
  preference: PickPreference;
  excludeFront: number[];
  excludeBack: number[];
  fixedFront: number[];
  fixedBack: number[];
  frontCount: number;
  backCount: number;
}

export function makePick(draws: DltDraw[], options: PickOptions): PickResult {
  const profile = buildPickerProfile(draws);
  const frontCount = options.mode === "single" ? 5 : options.frontCount;
  const backCount = options.mode === "single" ? 2 : options.backCount;
  const front = buildNums(FRONT_RANGE, frontCount, options.fixedFront, options.excludeFront, (num) => frontWeight(num, profile, options));
  const back = buildNums(BACK_RANGE, backCount, options.fixedBack, options.excludeBack, (num) => backWeight(num, profile, options));
  return explainPick(front, back, profile, options);
}

export function validatePickOptions(options: PickOptions) {
  const errors: string[] = [];
  const frontCount = options.mode === "single" ? 5 : options.frontCount;
  const backCount = options.mode === "single" ? 2 : options.backCount;
  if (options.mode === "compound" && (frontCount < 6 || frontCount > 12 || backCount < 3 || backCount > 6)) errors.push("复式需要前区 6-12 个、后区 3-6 个。");
  if (options.fixedFront.length > Math.min(4, frontCount)) errors.push("前区定胆最多 4 个，且不能超过选号容量。");
  if (options.fixedBack.length > Math.min(1, backCount)) errors.push("后区定胆最多 1 个。");
  if (hasInvalid(options.fixedFront, FRONT_RANGE) || hasInvalid(options.excludeFront, FRONT_RANGE)) errors.push("前区号码必须在 01-35。");
  if (hasInvalid(options.fixedBack, BACK_RANGE) || hasInvalid(options.excludeBack, BACK_RANGE)) errors.push("后区号码必须在 01-12。");
  if (intersects(options.fixedFront, options.excludeFront)) errors.push("前区定胆和排除号冲突。");
  if (intersects(options.fixedBack, options.excludeBack)) errors.push("后区定胆和排除号冲突。");
  if (FRONT_RANGE.length - uniqueSorted([...options.excludeFront, ...options.fixedFront]).length + options.fixedFront.length < frontCount) errors.push("前区可选号码不足。");
  if (BACK_RANGE.length - uniqueSorted([...options.excludeBack, ...options.fixedBack]).length + options.fixedBack.length < backCount) errors.push("后区可选号码不足。");
  return errors;
}

function buildNums(range: number[], count: number, fixed: number[], excluded: number[], weight: (num: number) => number) {
  const nums = uniqueSorted(fixed).slice(0, count);
  const pool = range.filter((num) => !excluded.includes(num) && !nums.includes(num));
  while (nums.length < count && pool.length) {
    const picked = weightedPick(pool, weight);
    nums.push(picked);
    pool.splice(pool.indexOf(picked), 1);
  }
  return uniqueSorted(nums);
}

function frontWeight(num: number, profile: PickerProfile, options: PickOptions) {
  if (options.strategy === "random") return 1;
  const heat = profile.frontHeat[num] || 0;
  const omitted = profile.frontOmission[num] || 0;
  const shape = shapeFit(num, profile);
  const texture = textureFit(num, profile);
  const calendar = [profile.calendar.month, profile.calendar.day].includes(num) ? 1 : 0;
  const cold = profile.coldFront.includes(num) ? 1 : 0;
  const hot = profile.hotFront.includes(num) ? 1 : 0;
  const prefer = preferenceBoost(options.preference, { heat, omitted, shape, texture, hot, cold });
  if (options.strategy === "balanced") return 1 + shape * 3 + texture;
  if (options.strategy === "hotCold") return 1 + hot * 2.4 + cold * 1.5 + shape;
  if (options.strategy === "omission") return 1 + omitted * 3 + shape * 0.8;
  if (options.strategy === "texture") return 1 + texture * 3 + shape;
  if (options.strategy === "calendar") return 1 + calendar * 4 + shape + texture;
  return 1 + heat * 2.5 + omitted * 2 + shape * 2.5 + texture * 2 + calendar + prefer;
}

function backWeight(num: number, profile: PickerProfile, options: PickOptions) {
  if (options.strategy === "random") return 1;
  const heat = profile.backHeat[num] || 0;
  const omitted = profile.backOmission[num] || 0;
  const calendar = [profile.calendar.month, profile.calendar.backDay].includes(num) ? 1 : 0;
  const cold = profile.coldBack.includes(num) ? 0.8 : 0;
  const prefer = options.preference === "omission" ? omitted : options.preference === "hot" ? heat : options.preference === "cold" ? cold : 0;
  if (options.strategy === "hotCold") return 1 + heat * 3 + cold;
  if (options.strategy === "omission") return 1 + omitted * 3;
  if (options.strategy === "calendar") return 1 + calendar * 4 + heat;
  return 1 + heat * 3.5 + omitted * 2.5 + calendar * 1.5 + prefer;
}

function preferenceBoost(preference: PickPreference, values: Record<string, number>) {
  if (preference === "balance") return values.shape * 1.5;
  if (preference === "hot") return values.hot * 1.8;
  if (preference === "cold") return values.cold * 1.8;
  if (preference === "omission") return values.omitted * 1.8;
  if (preference === "texture") return values.texture * 1.8;
  return 0;
}

function shapeFit(num: number, profile: PickerProfile) {
  const oddFit = num % 2 === 1 ? profile.targetOdd / 5 : (5 - profile.targetOdd) / 5;
  const bigFit = num >= 18 ? profile.targetBig / 5 : (5 - profile.targetBig) / 5;
  const zone = num <= 12 ? 0 : num <= 24 ? 1 : 2;
  return (oddFit + bigFit + profile.targetZones[zone] / 5) / 3;
}

function textureFit(num: number, profile: PickerProfile) {
  const prime = PRIMES.has(num) ? Math.min(profile.primeAvg / 2, 1) : 0.45;
  const mod = profile.modCoverRate > 0.55 ? 0.75 : num % 3 === 0 ? 0.55 : 0.65;
  const center = Math.min(Math.abs(num - 18) / Math.max(profile.centerPull, 1), 1);
  const tailMax = Math.max(...Object.values(profile.tailCounts), 1);
  const tail = 1 - (profile.tailCounts[num % 10] || 0) / tailMax * 0.35;
  return (prime + mod + center + tail) / 4;
}

function explainPick(front: number[], back: number[], profile: PickerProfile, options: PickOptions): PickResult {
  const structure = structureOf(front);
  const heatCounts = front.reduce<Record<string, number>>((acc, num) => ({ ...acc, [classifyHeat(num, profile)]: (acc[classifyHeat(num, profile)] || 0) + 1 }), {});
  const highOmission = front.filter((num) => (profile.frontOmission[num] || 0) > 0.65).length;
  const scores = scorePick(front, back, profile);
  return {
    front,
    back,
    mode: options.mode,
    compoundCount: options.mode === "compound" ? combination(front.length, 5) * combination(back.length, 2) : 1,
    strategy: label(options.strategy),
    reason: reason(options.strategy),
    omen: omen(structure, scores),
    tags: [structure.oddEven, structure.bigSmall, structure.zones],
    summary: structure,
    profile: {
      shape: `${structure.oddEven} · ${structure.bigSmall} · ${structure.zones}`,
      hotCold: `热${heatCounts["热"] || 0} / 温${heatCounts["温"] || 0} / 冷${heatCounts["冷"] || 0}`,
      omission: `回补${highOmission}个高遗漏号`,
      math: `和值${structure.sum} · 跨度${structure.span}`,
      back: `后区${back.join(" ")} · 间距${back.length >= 2 ? back.at(-1)! - back[0] : 0}`
    },
    score: scores
  };
}

function scorePick(front: number[], back: number[], profile: PickerProfile) {
  const structure = structureOf(front);
  const odd = Number(structure.oddEven.split(":")[0]);
  const big = Number(structure.bigSmall.split(":")[0]);
  const balance = 100 - Math.round((Math.abs(odd - profile.targetOdd) + Math.abs(big - profile.targetBig)) * 14);
  const heat = Math.round(average(front.map((num) => profile.frontHeat[num] || 0)) * 100);
  const omitted = Math.round(average(front.map((num) => profile.frontOmission[num] || 0)) * 100);
  const texture = Math.round(average(front.map((num) => textureFit(num, profile))) * 100);
  const mystery = Math.round((front.filter((num) => [profile.calendar.month, profile.calendar.day].includes(num)).length + back.filter((num) => [profile.calendar.month, profile.calendar.backDay].includes(num)).length) * 25 + texture * 0.5);
  return { balance: clamp(balance), heat: clamp(heat), omission: clamp(omitted), texture: clamp(texture), mystery: clamp(mystery) };
}

function weightedPick(pool: number[], weight: (num: number) => number) {
  const total = pool.reduce((sum, num) => sum + Math.max(weight(num), 0.1), 0);
  let cursor = Math.random() * total;
  for (const num of pool) {
    cursor -= Math.max(weight(num), 0.1);
    if (cursor <= 0) return num;
  }
  return pool[0];
}

function hasInvalid(nums: number[], range: number[]) {
  return nums.some((num) => !range.includes(num));
}

function intersects(a: number[], b: number[]) {
  return a.some((num) => b.includes(num));
}

function combination(n: number, k: number) {
  if (n < k) return 0;
  let result = 1;
  for (let i = 1; i <= k; i += 1) result = result * (n - i + 1) / i;
  return Math.round(result);
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function label(strategy: PickStrategy) {
  return ({ random: "纯随机", balanced: "均衡形态", hotCold: "冷热混元", omission: "遗漏回响", texture: "数学纹理", calendar: "日历呼应", compass: "综合罗盘" })[strategy];
}

function reason(strategy: PickStrategy) {
  return ({
    random: "不参考历史，完全随机抽取。",
    balanced: "贴合当前区间高频形态。",
    hotCold: "按热号、温号、冷号混合抽取。",
    omission: "偏向当前遗漏较长的号码。",
    texture: "参考质数、模三、中心和尾数纹理。",
    calendar: "轻量引入当月号、当日号和后区日期号。",
    compass: "综合形态、冷热、遗漏、数学纹理和后区画像。"
  })[strategy];
}

function omen(structure: ReturnType<typeof structureOf>, score: PickResult["score"]) {
  if ((score?.balance || 0) >= 80) return "形态端正，热冷相济。";
  if (structure.span >= 24) return "两端开阔，号码拉弓。";
  if (structure.sum >= 100) return "和值高悬，气势偏盛。";
  return "三区有序，静待揭晓。";
}
