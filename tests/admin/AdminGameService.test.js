/**
 * AdminGameService tests.
 * @see specs/phase_4_5_admin_game_service.md — Test Strategy
 */
const { createAdminGameService } = require("../../src/admin/AdminGameService");
const { PlayDuration, FirstPlayComplexity, AgeRange } = require("../../src/domain/types");

function validGame(overrides = {}) {
  return {
    id: "g1",
    title: "Game",
    description: "Desc",
    minPlayers: 2,
    maxPlayers: 4,
    playDuration: PlayDuration.MEDIUM,
    ageRecommendation: AgeRange.AGE_10_PLUS,
    firstPlayComplexity: FirstPlayComplexity.MEDIUM,
    categories: [],
    mechanics: [],
    awards: [],
    favorite: false,
    archived: false,
    images: [{ id: "i1" }],
    ...overrides,
  };
}

function createInMemoryStore() {
  const games = [];
  return {
    getAllGames: async () => [...games],
    getGameById: async (id) => games.find((g) => g.id === id) ?? null,
    saveGame: async (game) => {
      const i = games.findIndex((g) => g.id === game.id);
      if (i >= 0) games[i] = game;
      else games.push(game);
    },
  };
}

describe("AdminGameService", () => {
  describe("addGame", () => {
    it("saves valid game", async () => {
      const store = createInMemoryStore();
      const service = createAdminGameService(store);
      await service.addGame(validGame());
      const all = await store.getAllGames();
      expect(all).toHaveLength(1);
      expect(all[0].id).toBe("g1");
      expect(all[0].archived).toBe(false);
    });
    it("throws DUPLICATE_GAME_ID when id exists", async () => {
      const store = createInMemoryStore();
      const service = createAdminGameService(store);
      await service.addGame(validGame());
      await expect(service.addGame(validGame({ title: "Other" }))).rejects.toMatchObject({
        code: "DUPLICATE_GAME_ID",
        gameId: "g1",
      });
    });
    it("throws INVALID_GAME_DATA when validation fails", async () => {
      const store = createInMemoryStore();
      const service = createAdminGameService(store);
      await expect(service.addGame(validGame({ id: "" }))).rejects.toMatchObject({
        code: "INVALID_GAME_DATA",
      });
    });
  });

  describe("updateGame", () => {
    it("updates existing game", async () => {
      const store = createInMemoryStore();
      const service = createAdminGameService(store);
      await service.addGame(validGame());
      await service.updateGame("g1", validGame({ title: "Updated" }));
      const g = await store.getGameById("g1");
      expect(g.title).toBe("Updated");
    });
    it("throws GAME_NOT_FOUND when game does not exist", async () => {
      const store = createInMemoryStore();
      const service = createAdminGameService(store);
      await expect(service.updateGame("missing", validGame({ id: "missing" }))).rejects.toMatchObject({
        code: "GAME_NOT_FOUND",
        gameId: "missing",
      });
    });
  });

  describe("archiveGame", () => {
    it("marks game as archived", async () => {
      const store = createInMemoryStore();
      const service = createAdminGameService(store);
      await service.addGame(validGame());
      await service.archiveGame("g1");
      const g = await store.getGameById("g1");
      expect(g.archived).toBe(true);
    });
    it("throws GAME_NOT_FOUND when game does not exist", async () => {
      const store = createInMemoryStore();
      const service = createAdminGameService(store);
      await expect(service.archiveGame("missing")).rejects.toMatchObject({
        code: "GAME_NOT_FOUND",
        gameId: "missing",
      });
    });
    it("throws GAME_ALREADY_ARCHIVED when game is already archived", async () => {
      const store = createInMemoryStore();
      const service = createAdminGameService(store);
      await service.addGame(validGame());
      await service.archiveGame("g1");
      await expect(service.archiveGame("g1")).rejects.toMatchObject({
        code: "GAME_ALREADY_ARCHIVED",
        gameId: "g1",
      });
    });
  });

  describe("restoreGame", () => {
    it("restores archived game", async () => {
      const store = createInMemoryStore();
      const service = createAdminGameService(store);
      await service.addGame(validGame());
      await service.archiveGame("g1");
      await service.restoreGame("g1");
      const g = await store.getGameById("g1");
      expect(g.archived).toBe(false);
    });
    it("throws GAME_NOT_FOUND when game does not exist", async () => {
      const store = createInMemoryStore();
      const service = createAdminGameService(store);
      await expect(service.restoreGame("missing")).rejects.toMatchObject({
        code: "GAME_NOT_FOUND",
        gameId: "missing",
      });
    });
    it("throws GAME_NOT_ARCHIVED when game is active", async () => {
      const store = createInMemoryStore();
      const service = createAdminGameService(store);
      await service.addGame(validGame());
      await expect(service.restoreGame("g1")).rejects.toMatchObject({
        code: "GAME_NOT_ARCHIVED",
        gameId: "g1",
      });
    });
  });
});
