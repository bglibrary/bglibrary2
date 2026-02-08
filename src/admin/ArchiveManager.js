/**
 * ArchiveManager — archive/restore state transitions. No persistence.
 * @see specs/phase_4_6_archive_manager.md
 */
const { gameAlreadyArchived, gameNotArchived, missingArchiveFlag } = require("./archiveErrors");

/**
 * Marks a game as archived. Does not mutate input. Returns new game object.
 * @param {import("../domain/Game").Game} game
 * @returns {import("../domain/Game").Game}
 */
function archiveGame(game) {
  if (game == null || typeof game !== "object") {
    throw Object.assign(new Error(missingArchiveFlag().message), { code: "MISSING_ARCHIVE_FLAG" });
  }
  if (typeof game.archived !== "boolean") {
    throw Object.assign(new Error(missingArchiveFlag().message), { code: "MISSING_ARCHIVE_FLAG" });
  }
  if (game.archived === true) {
    throw Object.assign(new Error(gameAlreadyArchived(game.id).message), {
      code: "GAME_ALREADY_ARCHIVED",
      gameId: game.id,
    });
  }
  return { ...game, archived: true };
}

/**
 * Restores a game to active. Does not mutate input. Returns new game object.
 * @param {import("../domain/Game").Game} game
 * @returns {import("../domain/Game").Game}
 */
function restoreGame(game) {
  if (game == null || typeof game !== "object") {
    throw Object.assign(new Error(missingArchiveFlag().message), { code: "MISSING_ARCHIVE_FLAG" });
  }
  if (typeof game.archived !== "boolean") {
    throw Object.assign(new Error(missingArchiveFlag().message), { code: "MISSING_ARCHIVE_FLAG" });
  }
  if (game.archived === false) {
    throw Object.assign(new Error(gameNotArchived(game.id).message), {
      code: "GAME_NOT_ARCHIVED",
      gameId: game.id,
    });
  }
  return { ...game, archived: false };
}

module.exports = {
  archiveGame,
  restoreGame,
};
