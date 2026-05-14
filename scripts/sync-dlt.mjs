import {
  DATA_PATH,
  META_PATH,
  buildMeta,
  normalizeDraw,
  readJson,
  validateDraws,
  writeJson
} from "./dlt-utils.mjs";

const HISTORY_URL = "https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry";
const DEFAULT_LIMIT = Number.parseInt(getArg("limit") || "", 10) || 100;
const draws = readJson(DATA_PATH);

try {
  const latestLocal = [...draws].sort((a, b) => a.issue.localeCompare(b.issue)).at(-1);
  if (!latestLocal) throw new Error("本地数据为空，不能增量同步。");

  const history = await fetchOfficialHistory(DEFAULT_LIMIT);
  const latestRemote = history.at(-1);
  if (!latestRemote) throw new Error("官方历史接口没有返回大乐透数据。");

  const missing = history.filter((draw) => Number(draw.issue) > Number(latestLocal.issue));
  if (!missing.length) {
    console.log(`No new draws found. Latest local draw is already ${latestLocal.issue}; official latest is ${latestRemote.issue}.`);
    process.exit(0);
  }

  const firstMissing = Number(missing[0].issue);
  const expectedFirst = Number(latestLocal.issue) + 1;
  if (firstMissing !== expectedFirst) {
    throw new Error(`本地最新 ${latestLocal.issue}，接口只拉到 ${missing[0].issue} 起。请加大 --limit，例如 npm run sync:dlt -- --limit=200。`);
  }

  const merged = [...draws, ...missing].sort((a, b) => a.issue.localeCompare(b.issue));
  const result = validateDraws(merged);
  if (!result.ok) throw new Error(result.errors.join("\n"));

  writeJson(DATA_PATH, merged);
  writeJson(META_PATH, buildMeta(merged, HISTORY_URL));
  console.log(`Synced ${missing.length} draws: ${missing[0].issue} -> ${missing.at(-1).issue}`);
} catch (error) {
  console.error(`Sync failed: ${error.message}`);
  console.error("处理断档：加大 --limit 重试；如果断档超过官方接口可返回范围，再使用 Markdown/JSON 导入补齐。");
  process.exit(1);
}

async function fetchOfficialHistory(limit) {
  const url = `${HISTORY_URL}?gameNo=85&provinceId=0&isVerify=1&termLimits=${limit}`;
  const response = await fetch(url, {
    headers: {
      "accept": "application/json",
      "referer": "https://m.lottery.gov.cn/zst/dlt/?tt_force_outside=1",
      "user-agent": "Mozilla/5.0 DLT local sync"
    }
  });
  if (!response.ok) throw new Error(`官方历史接口请求失败：${response.status}`);

  const payload = await response.json();
  if (!payload.success || payload.errorCode !== "0" || !Array.isArray(payload.value?.list)) {
    throw new Error("官方历史接口返回格式不符合预期。");
  }

  return payload.value.list
    .map((item) => {
      const nums = String(item.lotteryDrawResult).trim().split(/\s+/).map(Number);
      return normalizeDraw({
        issue: item.lotteryDrawNum,
        date: item.lotteryDrawTime,
        front: nums.slice(0, 5),
        back: nums.slice(5, 7),
        source: HISTORY_URL
      });
    })
    .sort((a, b) => a.issue.localeCompare(b.issue));
}

function getArg(name) {
  const prefix = `--${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}
