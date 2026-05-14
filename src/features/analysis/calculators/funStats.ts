import { frequency } from "../../../domain/stats";
import type { DltDraw } from "../../../types/dlt";

interface FunScore {
  label: string;
  value: number;
  tip: string;
  detail: string;
}

export function calcFunStats(draws: DltDraw[]) {
  const allFront = draws.flatMap((draw) => draw.front);
  const allBack = draws.flatMap((draw) => draw.back);
  const birthdayRate = ratio(allFront.filter((num) => num <= 31).length, allFront.length);
  const consecutiveRate = ratio(draws.filter(hasConsecutive).length, draws.length);
  const sameTailRate = ratio(draws.filter(hasSameTail).length, draws.length);
  const symmetricRate = ratio(draws.filter(hasMirror).length, draws.length);
  const edgeRate = ratio(draws.filter(hasLowHighBridge).length, draws.length);
  const backCloseRate = ratio(draws.filter(hasCloseBack).length, draws.length);
  const backSameParityRate = ratio(draws.filter(hasBackSameParity).length, draws.length);
  const backEdgeRate = ratio(draws.filter(hasBackEdgeBridge).length, draws.length);
  const hot = frequency(draws, "front").sort((a, b) => b.count - a.count);
  const cold = frequency(draws, "front").sort((a, b) => a.count - b.count);
  const backHot = frequency(draws, "back").sort((a, b) => b.count - a.count);
  const backCold = frequency(draws, "back").sort((a, b) => a.count - b.count);
  const hotColdScore = hot[0]?.count - cold[0]?.count || 0;
  const backHotColdScore = backHot[0]?.count - backCold[0]?.count || 0;
  const tail = tailCounts(allFront);
  const backTail = tailCounts(allBack);
  const frontScores = [
    score("生日友好度", birthdayRate, "前区 01-31 的占比", pct(birthdayRate)),
    score("连号活跃度", consecutiveRate, "至少出现一组相邻号的期数占比", pct(consecutiveRate)),
    score("同尾感应", sameTailRate, "同尾号出现的期数占比", pct(sameTailRate)),
    score("镜像感", symmetricRate, "出现 01-35、02-34 这类镜像关系的期数占比", pct(symmetricRate)),
    score("边缘拉扯", edgeRate, "同一期同时出现低位号与高位号的期数占比", pct(edgeRate)),
    score("冷热分化", Math.min(hotColdScore / Math.max(draws.length * 0.2, 1), 1), "最热与最冷前区号的差距", `${hotColdScore} 次`)
  ];
  const backScores = [
    score("后区贴近", backCloseRate, "后区两个号码间距在 3 以内的期数占比", pct(backCloseRate)),
    score("后区同奇偶", backSameParityRate, "后区两个号码同为奇数或同为偶数的期数占比", pct(backSameParityRate)),
    score("后区两端感", backEdgeRate, "后区同时出现低位号 01-03 和高位号 10-12 的期数占比", pct(backEdgeRate)),
    score("后区冷热差", Math.min(backHotColdScore / Math.max(draws.length * 0.25, 1), 1), "最热与最冷后区号的出现次数差", `${backHotColdScore} 次`)
  ];
  const scores = [...frontScores, ...backScores];
  const tails = Object.entries(tail).map(([num, count]) => ({ num, count })).sort((a, b) => b.count - a.count);
  const backTails = Object.entries(backTail).map(([num, count]) => ({ num, count })).sort((a, b) => b.count - a.count);
  return {
    tail,
    backTail,
    birthdayRate,
    consecutiveRate,
    sameTailRate,
    symmetricRate,
    edgeRate,
    backCloseRate,
    backSameParityRate,
    backEdgeRate,
    hotColdScore,
    backHotColdScore,
    frontScores,
    backScores,
    scores,
    portrait: buildPortrait(scores),
    topTail: tails[0],
    quietTail: tails[tails.length - 1],
    topBackTail: backTails[0],
    quietBackTail: backTails[backTails.length - 1],
    snippets: buildSnippets(scores, tails)
  };
}

function tailCounts(nums: number[]) {
  const seed = Array.from({ length: 10 }, (_, tail) => [String(tail), 0] as const);
  return nums.reduce<Record<string, number>>((acc, num) => {
    const key = String(num % 10);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, Object.fromEntries(seed));
}

function hasConsecutive(draw: DltDraw) {
  return draw.front.some((num, index) => index > 0 && num === draw.front[index - 1] + 1);
}

function hasSameTail(draw: DltDraw) {
  return new Set(draw.front.map((num) => num % 10)).size < draw.front.length;
}

function hasMirror(draw: DltDraw) {
  return draw.front.some((num) => draw.front.includes(36 - num));
}

function hasLowHighBridge(draw: DltDraw) {
  return draw.front.some((num) => num <= 7) && draw.front.some((num) => num >= 29);
}

function hasCloseBack(draw: DltDraw) {
  return Math.abs(draw.back[1] - draw.back[0]) <= 3;
}

function hasBackSameParity(draw: DltDraw) {
  return draw.back[0] % 2 === draw.back[1] % 2;
}

function hasBackEdgeBridge(draw: DltDraw) {
  return draw.back.some((num) => num <= 3) && draw.back.some((num) => num >= 10);
}

function score(label: string, value: number, tip: string, detail: string) {
  return { label, value: Math.round(value * 100), tip, detail };
}

function buildPortrait(scores: FunScore[]) {
  const top = [...scores].sort((a, b) => b.value - a.value)[0];
  const titleMap: Record<string, string> = {
    生日友好度: "生日派对型",
    连号活跃度: "贴身连号型",
    同尾感应: "尾数结盟型",
    镜像感: "镜面对称型",
    边缘拉扯: "两端拉弓型",
    后区贴近: "后区贴贴型",
    冷热分化: "冷热拉扯型"
  };
  return {
    title: titleMap[top?.label] || "气质均衡型",
    desc: top ? `当前区间最突出的趣味特征是「${top.label}」，趣味分 ${top.value}/100。` : "当前区间没有明显偏向。"
  };
}

function buildSnippets(scores: FunScore[], tails: Array<{ num: string; count: number }>) {
  const scoreMap = Object.fromEntries(scores.map((item) => [item.label, item.value]));
  return [
    {
      label: "主旋律",
      value: highLabel(scoreMap["连号活跃度"], "连号戏份偏足", "号码各走各路"),
      tip: "看相邻号是否经常同场出现。"
    },
    {
      label: "尾数场",
      value: `旺尾 ${tails[0]?.num ?? "-"} / 静尾 ${tails[tails.length - 1]?.num ?? "-"}`,
      tip: "前区号码个位数的出现次数对比。"
    },
    {
      label: "号段感",
      value: highLabel(scoreMap["边缘拉扯"], "两端牵引强", "中段更安静"),
      tip: "看低位号和高位号是否常常同期开出。"
    },
    {
      label: "后区味道",
      value: highLabel(scoreMap["后区贴近"], "小间距更活跃", "距离拉开更多"),
      tip: "看后区两个号码是否常在近距离内。"
    }
  ];
}

function highLabel(value: number, high: string, low: string) {
  return value >= 50 ? high : low;
}

function ratio(value: number, total: number) {
  return total ? value / total : 0;
}

function pct(value: number) {
  return `${Math.round(value * 100)}%`;
}
