import { describe, expect, it } from "vitest";
import type { DltDraw } from "../types/dlt";
import { buildPickerProfile } from "../features/picker/pickerProfile";
import { makePick, validatePickOptions, type PickOptions } from "../features/picker/pickerStrategies";

const draws: DltDraw[] = [
  make("00001", [1, 5, 10, 20, 30], [1, 8]),
  make("00002", [2, 6, 11, 21, 31], [2, 9]),
  make("00003", [3, 6, 12, 22, 32], [2, 10]),
  make("00004", [4, 7, 13, 24, 35], [5, 11])
];

const baseOptions: PickOptions = {
  strategy: "compass",
  mode: "single",
  preference: "auto",
  excludeFront: [],
  excludeBack: [],
  fixedFront: [],
  fixedBack: [],
  frontCount: 6,
  backCount: 3
};

describe("picker", () => {
  it("builds an analysis profile", () => {
    const profile = buildPickerProfile(draws, new Date("2026-05-14T00:00:00"));
    expect(profile.hotFront).toContain(6);
    expect(profile.targetZones).toHaveLength(3);
    expect(profile.calendar.month).toBe(5);
  });

  it("generates valid single picks with profile and scores", () => {
    const pick = makePick(draws, { ...baseOptions, fixedFront: [8], fixedBack: [3] });
    expect(pick.front).toHaveLength(5);
    expect(pick.back).toHaveLength(2);
    expect(pick.front).toContain(8);
    expect(pick.back).toContain(3);
    expect(new Set(pick.front).size).toBe(5);
    expect(pick.profile?.shape).toBeTruthy();
    expect(pick.score?.balance).toBeGreaterThanOrEqual(0);
  });

  it("generates compound picks and validates constraints", () => {
    const options = { ...baseOptions, mode: "compound" as const, frontCount: 7, backCount: 3, excludeFront: [1, 2], excludeBack: [1] };
    const pick = makePick(draws, options);
    expect(pick.front).toHaveLength(7);
    expect(pick.back).toHaveLength(3);
    expect(pick.compoundCount).toBe(63);
    expect(pick.front.some((num) => options.excludeFront.includes(num))).toBe(false);
  });

  it("reports invalid fixed and excluded number conflicts", () => {
    const errors = validatePickOptions({ ...baseOptions, fixedFront: [8], excludeFront: [8] });
    expect(errors.join(" ")).toContain("冲突");
  });
});

function make(issue: string, front: number[], back: number[]): DltDraw {
  return { issue, front, back, date: "2026-01-01", source: "test", importedAt: "2026-01-01T00:00:00.000Z" };
}
