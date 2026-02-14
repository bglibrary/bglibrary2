const fs = require("fs").promises;
const path = require("path");
const FileGitService = require("../../src/infrastructure/FileGitService");

describe("FileGitService", () => {
  const testDir = "data/test_games";
  const service = new FileGitService(testDir);

  beforeAll(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  test("should add a game file", async () => {
    const game = { id: "test-game", title: "Test" };
    await service.addGame(game);
    const content = await fs.readFile(path.join(testDir, "test-game.json"), "utf8");
    expect(JSON.parse(content)).toEqual(game);
  });

  test("should update a game file", async () => {
    const game = { id: "test-game", title: "Updated" };
    await service.updateGame("test-game", game);
    const content = await fs.readFile(path.join(testDir, "test-game.json"), "utf8");
    expect(JSON.parse(content).title).toBe("Updated");
  });

  test("should archive a game", async () => {
    await service.archiveGame("test-game");
    const content = await fs.readFile(path.join(testDir, "test-game.json"), "utf8");
    expect(JSON.parse(content).archived).toBe(true);
  });

  test("should throw invalid path error if file missing on update", async () => {
    await expect(service.updateGame("missing", {})).rejects.toMatchObject({ code: "INVALID_PATH" });
  });
});
