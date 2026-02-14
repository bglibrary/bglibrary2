const { applySorting } = require("../../src/filtering/SortingEngine");
const { SORT_MODES } = require("../../src/filtering/sortingTypes");

describe("SortingEngine", () => {
  const games = [
    { id: "1", playDuration: 60, firstPlayComplexity: "LOW" },
    { id: "2", playDuration: 30, firstPlayComplexity: "HIGH" },
    { id: "3", playDuration: 90, firstPlayComplexity: "MEDIUM" },
    { id: "4", playDuration: null, firstPlayComplexity: null },
  ];

  test("should sort by duration ascending", () => {
    const sorted = applySorting(games, SORT_MODES.PLAY_DURATION_ASC);
    expect(sorted.map((g) => g.id)).toEqual(["2", "1", "3", "4"]);
  });

  test("should sort by duration descending", () => {
    const sorted = applySorting(games, SORT_MODES.PLAY_DURATION_DESC);
    expect(sorted.map((g) => g.id)).toEqual(["3", "1", "2", "4"]);
  });

  test("should sort by complexity ascending", () => {
    const sorted = applySorting(games, SORT_MODES.FIRST_PLAY_COMPLEXITY_ASC);
    // Note: Enum values are strings "LOW", "MEDIUM", "HIGH". Alphabetical order works for this test case.
    // HIGH, LOW, MEDIUM -> H, L, M
    expect(sorted.map((g) => g.id)).toEqual(["2", "1", "3", "4"]);
  });

  test("should throw on invalid sort mode", () => {
    expect(() => applySorting(games, "INVALID")).toThrow("Sort mode \"INVALID\" is not supported.");
  });

  test("should not mutate input list", () => {
    const input = [...games];
    applySorting(input, SORT_MODES.PLAY_DURATION_ASC);
    expect(input).toEqual(games);
  });
});
