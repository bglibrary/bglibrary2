const { applyFilters, validateFilters } = require("../../src/filtering/FilteringEngine");
const { PLAY_DURATION, FIRST_PLAY_COMPLEXITY, CATEGORIES, MECHANICS } = require("../../src/domain/types");

describe("FilteringEngine", () => {
  const games = [
    {
      id: "1",
      minPlayers: 2,
      maxPlayers: 4,
      playDuration: PLAY_DURATION.MEDIUM,
      firstPlayComplexity: FIRST_PLAY_COMPLEXITY.LOW,
      categories: [CATEGORIES[0], CATEGORIES[1]],
      mechanics: [MECHANICS[0]],
      awards: [{ name: "Award1" }],
      favorite: true,
    },
    {
      id: "2",
      minPlayers: 3,
      maxPlayers: 5,
      playDuration: PLAY_DURATION.LONG,
      firstPlayComplexity: FIRST_PLAY_COMPLEXITY.MEDIUM,
      categories: [CATEGORIES[1]],
      mechanics: [MECHANICS[1]],
      awards: [],
      favorite: false,
    },
    {
      id: "3",
      minPlayers: 1,
      maxPlayers: 2,
      playDuration: PLAY_DURATION.SHORT,
      firstPlayComplexity: FIRST_PLAY_COMPLEXITY.HIGH,
      categories: [CATEGORIES[2]],
      mechanics: [MECHANICS[2]],
      awards: [{ name: "Award2" }],
      favorite: false,
    },
  ];

  describe("validateFilters", () => {
    test("should return no errors for valid filters", () => {
      const filters = {
        playerCount: { minPlayers: 2, maxPlayers: 5 },
        playDuration: { values: [PLAY_DURATION.MEDIUM] },
      };
      expect(validateFilters(filters)).toHaveLength(0);
    });

    test("should catch empty filter values for playDuration", () => {
      const filters = { playDuration: { values: [] } };
      const errors = validateFilters(filters);
      expect(errors).toContainEqual(expect.objectContaining({ code: "EMPTY_FILTER_VALUES", filterName: "playDuration" }));
    });

    test("should catch invalid enum values for playDuration", () => {
      const filters = { playDuration: { values: ["INVALID_DURATION"] } };
      const errors = validateFilters(filters);
      expect(errors).toContainEqual(expect.objectContaining({ code: "INVALID_FILTER_VALUE", filterName: "playDuration" }));
    });
  });

  describe("applyFilters", () => {
    test("should return all games if no filters applied", () => {
      expect(applyFilters(games, {})).toHaveLength(games.length);
    });

    test("should filter by playerCount", () => {
      const filters = { playerCount: { minPlayers: 3, maxPlayers: 5 } };
      const result = applyFilters(games, filters);
      expect(result.map((g) => g.id)).toEqual(["1", "2"]);
    });

    test("should filter by playDuration (OR logic)", () => {
      const filters = { playDuration: { values: [PLAY_DURATION.MEDIUM, PLAY_DURATION.SHORT] } };
      const result = applyFilters(games, filters);
      expect(result.map((g) => g.id)).toEqual(["1", "3"]);
    });

    test("should filter by categories (OR logic)", () => {
      const filters = { categories: { values: [CATEGORIES[0], CATEGORIES[2]] } }; // Stratégie OR Abstrait
      const result = applyFilters(games, filters);
      expect(result.map((g) => g.id)).toEqual(["1", "3"]);
    });

    test("should filter by hasAwards", () => {
      const filters = { hasAwards: true };
      const result = applyFilters(games, filters);
      expect(result.map((g) => g.id)).toEqual(["1", "3"]);
    });

    test("should filter by favoriteOnly", () => {
      const filters = { favoriteOnly: true };
      const result = applyFilters(games, filters);
      expect(result.map((g) => g.id)).toEqual(["1"]);
    });

    test("should combine multiple filters with AND logic", () => {
      const filters = {
        playerCount: { minPlayers: 2, maxPlayers: 4 },
        playDuration: { values: [PLAY_DURATION.MEDIUM] },
        hasAwards: true,
      };
      const result = applyFilters(games, filters);
      expect(result.map((g) => g.id)).toEqual(["1"]);
    });

    test("should preserve order of input games", () => {
      const filters = { categories: { values: [CATEGORIES[1]] } }; // Famille
      const result = applyFilters(games, filters);
      expect(result.map((g) => g.id)).toEqual(["1", "2"]); // Original order was 1 then 2
    });

    test("should return empty array if no games match", () => {
      const filters = { playerCount: { minPlayers: 10, maxPlayers: 12 } };
      const result = applyFilters(games, filters);
      expect(result).toHaveLength(0);
    });

    test("should throw error for invalid filter definition (empty values)", () => {
      const filters = { playDuration: { values: [] } };
      expect(() => applyFilters(games, filters)).toThrow("Les valeurs pour le filtre \"playDuration\" ne peuvent pas être vides.");
    });

    test("should throw error for invalid filter definition (invalid enum)", () => {
      const filters = { playDuration: { values: ["BAD_VALUE"] } };
      expect(() => applyFilters(games, filters)).toThrow("La valeur \"BAD_VALUE\" pour le filtre \"playDuration\" est invalide.");
    });

    test("should handle empty games array", () => {
      const filters = { hasAwards: true };
      const result = applyFilters([], filters);
      expect(result).toHaveLength(0);
    });
  });
});
