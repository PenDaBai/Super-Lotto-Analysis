import fs from "node:fs";
import { DATA_PATH, EXPORT_MD_PATH, buildMeta, readJson, toMarkdown, validateDraws } from "./dlt-utils.mjs";

const draws = readJson(DATA_PATH);
const result = validateDraws(draws);

if (!result.ok) {
  console.error(result.errors.join("\n"));
  process.exit(1);
}

fs.writeFileSync(EXPORT_MD_PATH, toMarkdown(draws, buildMeta(draws, "data/dlt-draws.json")));
console.log(`Exported ${draws.length} draws to data/dlt-history-export.md`);
