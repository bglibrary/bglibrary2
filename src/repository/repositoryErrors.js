/**
 * Explicit, typed errors for GameRepository.
 * @see specs/phase_3_2_ref_spec_game_repository.md — Error Handling
 */

/**
 * @typedef {Object} RepositoryError
 * @property {string} code
 * @property {string} message
 * @property {string} [gameId]
 */

/**
 * @param {string} [gameId]
 * @returns {RepositoryError}
 */
function gameNotFound(gameId) {
  return { code: "GAME_NOT_FOUND", message: "Game not found", gameId };
}

/**
 * @param {string} gameId
 * @returns {RepositoryError}
 */
function gameArchivedNotVisible(gameId) {
  return { code: "GAME_ARCHIVED_NOT_VISIBLE", message: "Game is archived and not visible in visitor context", gameId };
}

/**
 * @param {string} [reason]
 * @returns {RepositoryError}
 */
function dataLoadFailure(reason) {
  return { code: "DATA_LOAD_FAILURE", message: reason ? `Data loading failed: ${reason}` : "Data loading failed" };
}

module.exports = {
  gameNotFound,
  gameArchivedNotVisible,
  dataLoadFailure,
};
