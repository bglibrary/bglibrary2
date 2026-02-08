/**
 * Explicit errors for AdminGameService.
 * @see specs/phase_5_5_admin_service_contracts.md
 */

function duplicateGameId(gameId) {
  return { code: "DUPLICATE_GAME_ID", message: "Game ID already exists", gameId };
}

function gameNotFound(gameId) {
  return { code: "GAME_NOT_FOUND", message: "Game not found", gameId };
}

function invalidGameData(reason) {
  return { code: "INVALID_GAME_DATA", message: reason ?? "Invalid game data" };
}

function gameAlreadyArchived(gameId) {
  return { code: "GAME_ALREADY_ARCHIVED", message: "Game is already archived", gameId };
}

function gameNotArchived(gameId) {
  return { code: "GAME_NOT_ARCHIVED", message: "Game is not archived", gameId };
}

module.exports = {
  duplicateGameId,
  gameNotFound,
  invalidGameData,
  gameAlreadyArchived,
  gameNotArchived,
};
