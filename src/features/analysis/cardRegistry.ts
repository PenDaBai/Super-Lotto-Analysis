import type { ComponentType } from "react";
import type { DltDraw } from "../../types/dlt";
import { CoOccurrenceCard } from "./cards/CoOccurrenceCard";
import { FunStatsCard } from "./cards/FunStatsCard";
import { HotColdCard } from "./cards/HotColdCard";
import { NeighborEchoCard } from "./cards/NeighborEchoCard";
import { NumberMatrixCard } from "./cards/NumberMatrixCard";
import { OmissionCard } from "./cards/OmissionCard";
import { StructureCard } from "./cards/StructureCard";
import { TimeStatsCard } from "./cards/TimeStatsCard";

export interface AnalysisCardDefinition {
  id: string;
  title: string;
  Component: ComponentType<{ draws: DltDraw[]; allDraws: DltDraw[] }>;
}

export const analysisCards: AnalysisCardDefinition[] = [
  { id: "hot-cold", title: "冷热号码", Component: HotColdCard },
  { id: "matrix", title: "号码矩阵", Component: NumberMatrixCard },
  { id: "omission", title: "遗漏观察", Component: OmissionCard },
  { id: "structure", title: "结构分布", Component: StructureCard },
  { id: "co-occurrence", title: "组合共现", Component: CoOccurrenceCard },
  { id: "neighbor", title: "邻号回声", Component: NeighborEchoCard },
  { id: "time", title: "时间维度", Component: TimeStatsCard },
  { id: "fun", title: "趣味玄学", Component: FunStatsCard }
];
