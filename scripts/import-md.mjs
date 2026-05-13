import fs from "node:fs";
import {
  DATA_PATH,
  MD_PATH,
  META_PATH,
  buildMeta,
  parseMarkdown,
  validateDraws,
  writeJson
} from "./dlt-utils.mjs";

const markdown = fs.readFileSync(MD_PATH, "utf8");
const draws = parseMarkdown(markdown);
const result = validateDraws(draws);

if (!result.ok) {
  console.error(result.errors.join("\n"));
  process.exit(1);
}

writeJson(DATA_PATH, draws);
writeJson(META_PATH, buildMeta(draws, "dlt_history_FULL.md"));
console.log(`Imported ${draws.length} draws to data/dlt-draws.json`);
