/**
 * FilteringEngine tests.
 * @see specs/phase_4_1_filtering_engine.md — Test Strategy
 */

const { applyFilters, validateFilters } = require("../../src/filtering/FilteringEngine");
const { PlayDuration, FirstPlayComplexity } = require("../../src/domain/types");

function game(overrides = {}) {
  return {
    id: "g1",
    title: "Game",
    description: "Desc",
    minPlayers: 2,
    maxPlayers: 4,
    playDuration: PlayDuration.MEDIUM,
    ageRecommendation: "AGE_10_PLUS",
    firstPlayComplexity: FirstPlayComplexity.MEDIUM,
    categories: ["Strategy"],
    mechanics: ["Dice"],
    awards: [],
    favorite: false,
    archived: false,
    images: [{ id: "i1" }],
    ...overrides,
  };
}

describe("FilteringEngine", () => {
  describe("applyFilters", () => {
    it("returns copy of games when filters empty or absent", () => {
      const games = [game({ id: "a" }), game({ id: "b" })];
      expect(applyFilters(games, {})).toHaveLength(2);
      expect(applyFilters(games, null)).toHaveLength(2);
      expect(games).toHaveLength(2);
    });

    it("preserves input order", () => {
      const games = [game({ id: "a" }), game({ id: "b" }), game({ id: "c" })];
      const filtered = applyFilters(games, { playDuration: { values: [PlayDuration.MEDIUM] } });
      expect(filtered.map((g) => g.id)).toEqual(["a", "b", "c"]);
    });

    it("does not mutate input list", () => {
      const games = [game({ id: "a" })];
      const copy = games.slice();
      applyFilters(games, { playDuration: { values: [PlayDuration.LONG] } });
      expect(games).toEqual(copy);
    });

    it("filters by player count (numeric range)", () => {
      const games = [
        game({ id: "a", minPlayers: 2, maxPlayers: 4 }),
        game({ id: "b", minPlayers: 5, maxPlayers: 6 }),
      ];
      const result = applyFilters(games, { playerCount: { minPlayers: 2, maxPlayers: 4 } });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("a");
    });

    it("filters by play duration (OR within values)", () => {
      const games = [
        game({ id: "a", playDuration: PlayDuration.SHORT }),
        game({ id: "b", playDuration: PlayDuration.LONG }),
      ];
      const result = applyFilters(games, {
        playDuration: { values: [PlayDuration.SHORT, PlayDuration.MEDIUM] },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("a");
    });

    it("filters by firstPlayComplexity (OR within values)", () => {
      const games = [
        game({ id: "a", firstPlayComplexity: FirstPlayComplexity.LOW }),
        game({ id: "b", firstPlayComplexity: FirstPlayComplexity.HIGH }),
      ];
      const result = applyFilters(games, {
        firstPlayComplexity: { values: [FirstPlayComplexity.LOW] },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("a");
    });

    it("filters by categories (OR within values)", () => {
      const games = [
        game({ id: "a", categories: ["Strategy"] }),
        game({ id: "b", categories: ["Party"] }),
      ];
      const result = applyFilters(games, { categories: { values: ["Strategy", "Euro"] } });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("a");
    });

    it("filters by mechanics (OR within values)", () => {
      const games = [
        game({ id: "a", mechanics: ["Dice"] }),
        game({ id: "b", mechanics: ["Cards"] }),
      ];
      const result = applyFilters(games, { mechanics: { values: ["Dice"] } });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("a");
    });

    it("filters by hasAwards when true", () => {
      const games = [
        game({ id: "a", awards: [{ name: "Award" }] }),
        game({ id: "b", awards: [] }),
      ];
      const result = applyFilters(games, { hasAwards: true });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("a");
    });

    it("filters by favoriteOnly when true", () => {
      const games = [game({ id: "a", favorite: true }), game({ id: "b", favorite: false })];
      const result = applyFilters(games, { favoriteOnly: true });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("a");
    });

    it("combines filters with AND", () => {
      const games = [
        game({
          id: "a",
          playDuration: PlayDuration.MEDIUM,
          firstPlayComplexity: FirstPlayComplexity.LOW,
        }),
        game({
          id: "b",
          playDuration: PlayDuration.MEDIUM,
          firstPlayComplexity: FirstPlayComplexity.HIGH,
        }),
      ];
      const result = applyFilters(games, {
        playDuration: { values: [PlayDuration.MEDIUM] },
        firstPlayComplexity: { values: [FirstPlayComplexity.LOW] },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("a");
    });

    it("returns empty array when no games match", () => {
      const games = [game({ playDuration: PlayDuration.SHORT })];
      const result = applyFilters(games, { playDuration: { values: [PlayDuration.LONG] } });
      expect(result).toEqual([]);
    });

    it("returns empty array for empty input", () => {
      expect(applyFilters([], { playDuration: { values: [PlayDuration.MEDIUM] } })).toEqual([]);
    });

    it("throws when filter has empty values", () => {
      expect(() => applyFilters([game()], { playDuration: { values: [] } })).toThrow(/EMPTY_FILTER_VALUES|empty values/);
    });

    it("throws when filter has invalid enum value", () => {
      expect(() =>
        applyFilters([game()], { playDuration: { values: ["INVALID"] } })
      ).toThrow(/INVALID_FILTER_VALUE|Invalid value/);
    });
  });

  describe("validateFilters", () => {
    it("returns empty array for absent filters", () => {
      expect(validateFilters({})).toEqual([]);
      expect(validateFilters(null)).toEqual([]);
    });

    it("returns error for playDuration with empty values", () => {
      const errors = validateFilters({ playDuration: { values: [] } });
      expect(errors.some((e) => e.code === "EMPTY_FILTER_VALUES" && e.filterName === "playDuration")).toBe(true);
    });

    it("returns error for categories with empty values", () => {
      const errors = validateFilters({ categories: { values: [] } });
      expect(errors.some((e) => e.code === "EMPTY_FILTER_VALUES" && e.filterName === "categories")).toBe(true);
    });
  });
});
