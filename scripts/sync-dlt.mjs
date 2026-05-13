import {
  DATA_PATH,
  META_PATH,
  buildMeta,
  normalizeDraw,
  readJson,
  validateDraws,
  writeJson
} from "./dlt-utils.mjs";

const SOURCE_URL = "https://datachart.500.com/dlt/history/history.shtml";
const draws = readJson(DATA_PATH);

try {
  const remote = await fetchRemoteDraws();
  const known = new Set(draws.map((draw) => draw.issue));
  const additions = remote.filter((draw) => !known.has(draw.issue));

  if (!additions.length) {
    console.log("No new draws found.");
    process.exit(0);
  }

  const merged = [...draws, ...additions].sort((a, b) => a.issue.localeCompare(b.issue));
  const result = validateDraws(merged);
  if (!result.ok) throw new Error(result.errors.join("\n"));

  writeJson(DATA_PATH, merged);
  writeJson(META_PATH, buildMeta(merged, SOURCE_URL));
  console.log(`Synced ${additions.length} new draws.`);
} catch (error) {
  console.error(`Sync failed: ${error.message}`);
  console.error("远端可能启用了安全拦截。可先使用页面导入或手动更新，再运行 npm run data:validate。");
  process.exit(1);
}

async function fetchRemoteDraws() {
  const response = await fetch(SOURCE_URL, {
    headers: {
      "accept": "text/html,application/xhtml+xml",
      "user-agent": "Mozilla/5.0 DLT local sync"
    }
  });
  const html = await response.text();
  if (!response.ok || /请求已被站点的安全策略拦截|Restricted Access/.test(html)) {
    throw new Error(`500.com blocked the request (${response.status})`);
  }
  const rows = [...html.matchAll(/<tr[^>]*>\s*<td[^>]*>(\d{5})<\/td>\s*<td[^>]*>(\d{2})<\/td>\s*<td[^>]*>(\d{2})<\/td>\s*<td[^>]*>(\d{2})<\/td>\s*<td[^>]*>(\d{2})<\/td>\s*<td[^>]*>(\d{2})<\/td>\s*<td[^>]*>(\d{2})<\/td>\s*<td[^>]*>(\d{2})<\/td>[\s\S]*?(\d{4}-\d{2}-\d{2})/g)];
  if (!rows.length) throw new Error("No draw rows parsed from remote HTML");
  return rows.map((match) => normalizeDraw({
    issue: match[1],
    front: match.slice(2, 7).map(Number),
    back: match.slice(7, 9).map(Number),
    date: match[9],
    source: SOURCE_URL
  }));
}
