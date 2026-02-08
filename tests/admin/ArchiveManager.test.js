/**
 * ArchiveManager tests.
 * @see specs/phase_4_6_archive_manager.md — Test Strategy
 */
const { archiveGame, restoreGame } = require("../../src/admin/ArchiveManager");
const { PlayDuration, FirstPlayComplexity, AgeRange } = require("../../src/domain/types");

function game(overrides = {}) {
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

describe("ArchiveManager", () => {
  describe("archiveGame", () => {
    it("returns game with archived true", () => {
      const g = game({ archived: false });
      const result = archiveGame(g);
      expect(result.archived).toBe(true);
      expect(result.id).toBe(g.id);
    });
    it("does not mutate input", () => {
      const g = game();
      archiveGame(g);
      expect(g.archived).toBe(false);
    });
    it("throws GAME_ALREADY_ARCHIVED when game is already archived", () => {
      const g = game({ archived: true });
      expect(() => archiveGame(g)).toThrow(/GAME_ALREADY_ARCHIVED|already archived/);
    });
    it("throws when game has no archived field", () => {
      const g = game();
      delete g.archived;
      expect(() => archiveGame(g)).toThrow(/MISSING_ARCHIVE_FLAG|archived/);
    });
  });

  describe("restoreGame", () => {
    it("returns game with archived false", () => {
      const g = game({ archived: true });
      const result = restoreGame(g);
      expect(result.archived).toBe(false);
    });
    it("does not mutate input", () => {
      const g = game({ archived: true });
      restoreGame(g);
      expect(g.archived).toBe(true);
    });
    it("throws GAME_NOT_ARCHIVED when game is active", () => {
      const g = game({ archived: false });
      expect(() => restoreGame(g)).toThrow(/GAME_NOT_ARCHIVED|not archived/);
    });
    it("throws when game has no archived field", () => {
      const g = game({ archived: true });
      delete g.archived;
      expect(() => restoreGame(g)).toThrow(/archived/);
    });
  });
});
