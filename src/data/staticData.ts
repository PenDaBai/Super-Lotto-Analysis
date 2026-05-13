import drawsJson from "../../data/dlt-draws.json";
import metaJson from "../../data/dlt-meta.json";
import type { DltDraw, DltMeta } from "../types/dlt";

export const baseDraws = drawsJson as DltDraw[];
export const baseMeta = metaJson as DltMeta;
