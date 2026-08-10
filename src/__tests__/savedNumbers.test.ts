import { describe, expect, it } from "vitest";
import { normalizeNumberSelection, sameNumberSelection } from "../features/query/savedNumbers";

describe("saved query numbers", () => {
  it("normalizes and validates a compound selection", () => {
    expect(normalizeNumberSelection({ front: [17, 1, 6, 15, 14, 6], back: [3, 2] })).toEqual({
      front: [1, 6, 14, 15, 17],
      back: [2, 3]
    });
  });

  it("rejects incomplete or out-of-range selections", () => {
    expect(normalizeNumberSelection({ front: [1, 2, 3, 4], back: [1, 2] })).toBeNull();
    expect(normalizeNumberSelection({ front: [1, 2, 3, 4, 36], back: [1, 2] })).toBeNull();
  });

  it("compares normalized selections", () => {
    expect(sameNumberSelection(
      { front: [1, 6, 14, 15, 17], back: [2, 3] },
      { front: [1, 6, 14, 15, 17], back: [2, 3] }
    )).toBe(true);
  });
});
