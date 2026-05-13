import { DATA_PATH, META_PATH, readJson, validateDraws } from "./dlt-utils.mjs";

const draws = readJson(DATA_PATH);
const meta = readJson(META_PATH);
const result = validateDraws(draws);
const latest = [...draws].sort((a, b) => a.issue.localeCompare(b.issue)).at(-1);

if (meta.count !== draws.length) {
  result.errors.push(`元数据总期数 ${meta.count} 与数据 ${draws.length} 不一致`);
}
if (latest && (meta.latestIssue !== latest.issue || meta.latestDate !== latest.date)) {
  result.errors.push(`元数据最新期 ${meta.latestIssue}/${meta.latestDate} 与数据 ${latest.issue}/${latest.date} 不一致`);
}
if (draws.length !== 2869) {
  result.errors.push(`当前基础数据应为 2869 条，实际 ${draws.length} 条`);
}
if (!latest || latest.issue !== "26051" || latest.date !== "2026-05-11") {
  result.errors.push("当前基础数据最新记录应为 26051 / 2026-05-11");
}

if (result.errors.length) {
  console.error(result.errors.join("\n"));
  process.exit(1);
}

console.log(`Data ok: ${draws.length} draws, latest ${latest.issue} / ${latest.date}`);
