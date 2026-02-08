/**
 * GameRepository tests.
 * @see specs/phase_3_2_ref_spec_game_repository.md — Test Strategy
 */

const { createGameRepository } = require("../../src/repository/GameRepository");
const { PlayDuration, FirstPlayComplexity, AgeRange } = require("../../src/domain/types");

function validGame(overrides = {}) {
  return {
    id: "game-1",
    title: "Test Game",
    description: "A test game",
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
    images: [{ id: "img-1" }],
    ...overrides,
  };
}

describe("GameRepository", () => {
  describe("getAllGames", () => {
    it("returns only non-archived games for visitor context", async () => {
      const repo = createGameRepository({
        loadGames: () => [validGame({ id: "a" }), validGame({ id: "b", archived: true })],
      });
      const games = await repo.getAllGames("visitor");
      expect(games).toHaveLength(1);
      expect(games[0].id).toBe("a");
    });

    it("returns all games (including archived) for admin context", async () => {
      const repo = createGameRepository({
        loadGames: () => [validGame({ id: "a" }), validGame({ id: "b", archived: true })],
      });
      const games = await repo.getAllGames("admin");
      expect(games).toHaveLength(2);
    });

    it("skips invalid games and returns only valid ones", async () => {
      const repo = createGameRepository({
        loadGames: () => [validGame({ id: "a" }), { id: "bad", title: "" }],
      });
      const games = await repo.getAllGames("visitor");
      expect(games).toHaveLength(1);
      expect(games[0].id).toBe("a");
    });

    it("returns empty array when no games", async () => {
      const repo = createGameRepository({ loadGames: () => [] });
      const games = await repo.getAllGames("visitor");
      expect(games).toEqual([]);
    });

    it("throws DATA_LOAD_FAILURE when loader throws", async () => {
      const repo = createGameRepository({
        loadGames: () => {
          throw new Error("read error");
        },
      });
      await expect(repo.getAllGames("visitor")).rejects.toMatchObject({
        message: expect.stringContaining("Data loading failed"),
        code: "DATA_LOAD_FAILURE",
      });
    });

    it("throws when loader returns non-array", async () => {
      const repo = createGameRepository({ loadGames: () => null });
      await expect(repo.getAllGames("visitor")).rejects.toThrow(/not an array/);
    });
  });

  describe("getGameById", () => {
    it("returns game when found and visible (visitor, active)", async () => {
      const repo = createGameRepository({
        loadGames: () => [validGame({ id: "g1" })],
      });
      const game = await repo.getGameById("g1", "visitor");
      expect(game.id).toBe("g1");
    });

    it("returns archived game when context is admin", async () => {
      const repo = createGameRepository({
        loadGames: () => [validGame({ id: "g1", archived: true })],
      });
      const game = await repo.getGameById("g1", "admin");
      expect(game.id).toBe("g1");
      expect(game.archived).toBe(true);
    });

    it("throws GAME_NOT_FOUND when id does not exist", async () => {
      const repo = createGameRepository({
        loadGames: () => [validGame({ id: "g1" })],
      });
      await expect(repo.getGameById("missing", "admin")).rejects.toMatchObject({
        code: "GAME_NOT_FOUND",
        gameId: "missing",
      });
    });

    it("throws GAME_ARCHIVED_NOT_VISIBLE when game is archived and context is visitor", async () => {
      const repo = createGameRepository({
        loadGames: () => [validGame({ id: "g1", archived: true })],
      });
      await expect(repo.getGameById("g1", "visitor")).rejects.toMatchObject({
        code: "GAME_ARCHIVED_NOT_VISIBLE",
        gameId: "g1",
      });
    });
  });
});
