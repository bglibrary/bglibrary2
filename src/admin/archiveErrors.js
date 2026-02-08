/**
 * Explicit errors for ArchiveManager.
 * @see specs/phase_4_6_archive_manager.md — Error Handling
 */

function gameAlreadyArchived(gameId) {
  return { code: "GAME_ALREADY_ARCHIVED", message: "Game is already archived", gameId };
}

function gameNotArchived(gameId) {
  return { code: "GAME_NOT_ARCHIVED", message: "Game is not archived", gameId };
}

function missingArchiveFlag() {
  return { code: "MISSING_ARCHIVE_FLAG", message: "Game must have archived field" };
}

module.exports = {
  gameAlreadyArchived,
  gameNotArchived,
  missingArchiveFlag,
};
