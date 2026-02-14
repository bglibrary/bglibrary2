const { createGameRepository } = require("../../src/repository/GameRepository");

describe("GameRepository", () => {
  const games = [
    { id: "1", title: "Active Game", archived: false },
    { id: "2", title: "Archived Game", archived: true },
  ];

  const loadGames = async () => games;
  const repo = createGameRepository({ loadGames });

  test("getAllGames('visitor') should only return non-archived games", async () => {
    const results = await repo.getAllGames("visitor");
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("1");
  });

  test("getAllGames('admin') should return all games", async () => {
    const results = await repo.getAllGames("admin");
    expect(results).toHaveLength(2);
  });

  test("getGameById as visitor should return active game", async () => {
    const game = await repo.getGameById("1", "visitor");
    expect(game.id).toBe("1");
  });

  test("getGameById as visitor should throw if game is archived", async () => {
    await expect(repo.getGameById("2", "visitor")).rejects.toMatchObject({
      code: "GAME_ARCHIVED_NOT_VISIBLE",
    });
  });

  test("getGameById as admin should return archived game", async () => {
    const game = await repo.getGameById("2", "admin");
    expect(game.id).toBe("2");
  });

  test("getGameById should throw if game not found", async () => {
    await expect(repo.getGameById("999")).rejects.toMatchObject({ code: "GAME_NOT_FOUND" });
  });
});
