/**
 * GameCardMapper tests.
 * @see specs/phase_4_4_game_card_mapper.md — Test Strategy
 */

const { mapGameToCard, formatPlayerCount } = require("../../src/mapper/GameCardMapper");
const { PlayDuration, FirstPlayComplexity, AgeRange } = require("../../src/domain/types");

function game(overrides = {}) {
  return {
    id: "g1",
    title: "Test Game",
    description: "Desc",
    minPlayers: 2,
    maxPlayers: 4,
    playDuration: PlayDuration.MEDIUM,
    ageRecommendation: AgeRange.AGE_10_PLUS,
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

describe("GameCardMapper", () => {
  describe("mapGameToCard", () => {
    it("maps valid game to GameCard with mandatory fields", () => {
      const g = game();
      const card = mapGameToCard(g);
      expect(card).toEqual({
        id: "g1",
        title: "Test Game",
        playerCount: "2–4",
        playDuration: PlayDuration.MEDIUM,
        hasAwards: false,
        isFavorite: false,
      });
    });

    it("formats same min/max players as single number", () => {
      const card = mapGameToCard(game({ minPlayers: 3, maxPlayers: 3 }));
      expect(card.playerCount).toBe("3");
    });

    it("includes hasAwards true when game has awards", () => {
      const card = mapGameToCard(game({ awards: [{ name: "Award" }] }));
      expect(card.hasAwards).toBe(true);
    });

    it("includes isFavorite true when game is favorite", () => {
      const card = mapGameToCard(game({ favorite: true }));
      expect(card.isFavorite).toBe(true);
    });

    it("does not mutate input game", () => {
      const g = game({ id: "x" });
      const before = JSON.stringify(g);
      mapGameToCard(g);
      expect(JSON.stringify(g)).toBe(before);
    });

    it("produces deterministic output for same input", () => {
      const g = game();
      expect(mapGameToCard(g)).toEqual(mapGameToCard(g));
    });

    it("excludes description, firstPlayComplexity, categories, mechanics", () => {
      const card = mapGameToCard(game());
      expect(card).not.toHaveProperty("description");
      expect(card).not.toHaveProperty("firstPlayComplexity");
      expect(card).not.toHaveProperty("categories");
      expect(card).not.toHaveProperty("mechanics");
    });

    it("throws when game is null", () => {
      expect(() => mapGameToCard(null)).toThrow(/game is required/);
    });

    it("throws when game.id is missing", () => {
      expect(() => mapGameToCard(game({ id: "" }))).toThrow(/game.id is required/);
    });

    it("throws when game.title is missing", () => {
      expect(() => mapGameToCard(game({ title: "" }))).toThrow(/game.title is required/);
    });

    it("throws when minPlayers/maxPlayers missing", () => {
      expect(() => mapGameToCard(game({ minPlayers: undefined, maxPlayers: undefined }))).toThrow(
        /minPlayers and game.maxPlayers/
      );
    });
  });

  describe("formatPlayerCount", () => {
    it("returns single number when min equals max", () => {
      expect(formatPlayerCount(2, 2)).toBe("2");
    });
    it("returns range when min differs from max", () => {
      expect(formatPlayerCount(2, 4)).toBe("2–4");
    });
  });
});
