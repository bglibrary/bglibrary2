const { mapGameToCard, formatPlayerCount } = require("../../src/mapper/GameCardMapper");
const { PLAY_DURATION } = require("../../src/domain/types");

describe("GameCardMapper", () => {
  const baseGame = {
    id: "game-1",
    title: "Test Game",
    description: "A board game.",
    minPlayers: 2,
    maxPlayers: 4,
    playDuration: PLAY_DURATION.MEDIUM,
    ageRecommendation: "8+",
    firstPlayComplexity: "LOW",
    categories: ["Strategy"],
    mechanics: ["Dice Rolling"],
    images: [{ id: "img-1" }],
    favorite: false,
    archived: false,
  };

  describe("formatPlayerCount", () => {
    test("should format single player count", () => {
      expect(formatPlayerCount(1, 1)).toBe("1 joueur");
    });

    test("should format multiple players same count", () => {
      expect(formatPlayerCount(2, 2)).toBe("2 joueurs");
    });

    test("should format player range", () => {
      expect(formatPlayerCount(2, 4)).toBe("2-4 joueurs");
    });

    test("should format 6+ players", () => {
      expect(formatPlayerCount(3, 6)).toBe("3-6+ joueurs");
      expect(formatPlayerCount(6, 8)).toBe("6-8 joueurs"); // Note: spec says 6+ includes >=6 max players
    });
  });

  describe("mapGameToCard", () => {
    test("should correctly map all mandatory fields", () => {
      const card = mapGameToCard(baseGame);
      expect(card.id).toBe(baseGame.id);
      expect(card.title).toBe(baseGame.title);
      expect(card.playerCount).toBe("2-4 joueurs");
      expect(card.playDuration).toBe(baseGame.playDuration);
    });

    test("should correctly map hasAwards indicator", () => {
      const gameWithAwards = { ...baseGame, awards: [{ name: "Award1" }] };
      const cardWithAwards = mapGameToCard(gameWithAwards);
      expect(cardWithAwards.hasAwards).toBe(true);

      const gameWithoutAwards = { ...baseGame, awards: [] };
      const cardWithoutAwards = mapGameToCard(gameWithoutAwards);
      expect(cardWithoutAwards.hasAwards).toBe(false);
    });

    test("should correctly map isFavorite indicator", () => {
      const gameFavorite = { ...baseGame, favorite: true };
      const cardFavorite = mapGameToCard(gameFavorite);
      expect(cardFavorite.isFavorite).toBe(true);

      const gameNotFavorite = { ...baseGame, favorite: false };
      const cardNotFavorite = mapGameToCard(gameNotFavorite);
      expect(cardNotFavorite.isFavorite).toBe(false);
    });

    test("should explicitly exclude non-GameCard fields", () => {
      const card = mapGameToCard(baseGame);
      expect(card).not.toHaveProperty("description");
      expect(card).not.toHaveProperty("firstPlayComplexity");
      expect(card).not.toHaveProperty("categories");
      expect(card).not.toHaveProperty("mechanics");
      expect(card).not.toHaveProperty("images");
      expect(card).not.toHaveProperty("archived");
    });

    test("should throw error if game object is null or undefined", () => {
      expect(() => mapGameToCard(null)).toThrow("Game object is required for mapping to GameCard.");
      expect(() => mapGameToCard(undefined)).toThrow("Game object is required for mapping to GameCard.");
    });

    test("should return immutable GameCard object", () => {
      const card = mapGameToCard(baseGame);
      expect(() => { card.title = "New Title"; }).toThrow();
    });
  });
});
