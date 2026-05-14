import type { DltDraw } from "../../../types/dlt";

const PRIMES = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]);

export function calcMathTexture(draws: DltDraw[]) {
  const frontFreq = range(35).map((num) => countIncludes(draws, "front", num));
  const tailFreq = range(10).map((tail) => draws.flatMap((draw) => draw.front).filter((num) => num % 10 === tail - 1).length);
  const signatures = countBy(draws.map(signature));
  const primeAvg = avg(draws.map((draw) => draw.front.filter((num) => PRIMES.has(num)).length));
  const modCoverRate = ratio(draws.filter((draw) => new Set(draw.front.map((num) => num % 3)).size === 3).length, draws.length);
  const centerPull = avg(draws.map((draw) => avg(draw.front.map((num) => Math.abs(num - 18)))));
  const freqEntropy = normalizedEntropy(frontFreq);
  const shapeEntropy = normalizedEntropy([...signatures.values()]);
  const tailEntropy = normalizedEntropy(tailFreq);
  return {
    metrics: [
      metric("均匀熵", freqEntropy, "H=-Σp·log(p)，再除以最大熵。越高代表当前区间号码分布越均匀。", `H/Hmax ${Math.round(freqEntropy)}%`),
      metric("形态熵", shapeEntropy, "把每期号码压成奇偶、大小、三区指纹后计算熵。越高代表形态越分散。", `指纹熵 ${Math.round(shapeEntropy)}%`),
      metric("尾数熵", tailEntropy, "把前区号码按个位尾数 0-9 分组后计算熵。越高代表尾数分布越均匀。", `尾数熵 ${Math.round(tailEntropy)}%`),
      metric("模三齐全率", modCoverRate * 100, "前区 5 个号同时覆盖除以 3 的余数 0、1、2 的期数占比。", pct(modCoverRate)),
      metric("质数密度", primeAvg / 5 * 100, "前区质数平均个数，按 5 个前区号折算成百分值。", `${primeAvg.toFixed(2)} 个/期`),
      metric("中心游离", Math.min(centerPull / 14, 1) * 100, "前区号码到中心点 18 的平均距离。越高代表越偏离中段。", centerPull.toFixed(2))
    ],
    portrait: buildPortrait(freqEntropy, shapeEntropy, tailEntropy, modCoverRate)
  };
}

function signature(draw: DltDraw) {
  const odd = draw.front.filter((num) => num % 2 === 1).length;
  const big = draw.front.filter((num) => num >= 18).length;
  const zones = [0, 0, 0];
  draw.front.forEach((num) => { zones[num <= 12 ? 0 : num <= 24 ? 1 : 2] += 1; });
  return `${odd}|${big}|${zones.join("")}`;
}

function buildPortrait(freqEntropy: number, shapeEntropy: number, tailEntropy: number, modCoverRate: number) {
  const tags = [
    freqEntropy >= 98 ? "分布很均匀" : "分布略有偏心",
    shapeEntropy >= 92 ? "形态很多变" : "形态更集中",
    tailEntropy >= 94 ? "尾数较均衡" : "尾数有偏心",
    modCoverRate >= 0.62 ? "余数三色齐" : "余数有偏色"
  ];
  return { title: tags.slice(0, 2).join(" · "), tags };
}

function metric(label: string, value: number, formula: string, detail: string) {
  return { label, value: Math.round(value), formula, detail };
}

function countBy<T extends string | number>(items: T[]) {
  return items.reduce<Map<T, number>>((acc, item) => acc.set(item, (acc.get(item) || 0) + 1), new Map());
}

function countIncludes(draws: DltDraw[], area: "front" | "back", num: number) {
  return draws.filter((draw) => draw[area].includes(num)).length;
}

function normalizedEntropy(counts: number[]) {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (!total || counts.length <= 1) return 0;
  const entropy = counts.reduce((sum, count) => count ? sum - (count / total) * Math.log2(count / total) : sum, 0);
  return entropy / Math.log2(counts.length) * 100;
}

function range(count: number) {
  return Array.from({ length: count }, (_, index) => index + 1);
}

function avg(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function ratio(value: number, total: number) {
  return total ? value / total : 0;
}

function pct(value: number) {
  return `${Math.round(value * 100)}%`;
}
