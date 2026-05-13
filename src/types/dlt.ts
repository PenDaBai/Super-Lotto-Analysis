export type DrawSource = "dlt_history_FULL.md" | "manual" | "local-storage" | string;

export interface DltDraw {
  issue: string;
  date: string;
  front: number[];
  back: number[];
  source: DrawSource;
  importedAt: string;
}

export interface DltMeta {
  version: number;
  count: number;
  latestIssue: string;
  latestDate: string;
  source: string;
  generatedAt: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export interface RangeOption {
  key: string;
  label: string;
  count: number | "all" | "custom";
}

export interface PrizeResult {
  level: string;
  frontHits: number;
  backHits: number;
  description: string;
}

export interface PickResult {
  front: number[];
  back: number[];
  strategy: string;
  reason: string;
}
