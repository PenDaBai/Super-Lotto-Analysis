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
  mode?: "single" | "compound";
  compoundCount?: number;
  omen?: string;
  tags?: string[];
  profile?: {
    shape: string;
    hotCold: string;
    omission: string;
    math: string;
    back: string;
  };
  score?: {
    balance: number;
    heat: number;
    omission: number;
    texture: number;
    mystery: number;
  };
  summary?: {
    sum: number;
    span: number;
    oddEven: string;
    bigSmall: string;
    zones: string;
  };
}
