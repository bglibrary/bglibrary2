const { archiveErrors } = require('./archiveErrors');

/**
 * ArchiveManager handles archive and restore logic for games.
 * It is a pure, stateless function.
 */
const ArchiveManager = {
  /**
   * Archives a game.
   * 
   * @param {Object} game - The game object to archive
   * @returns {Object} A new game object with archived: true
   * @throws {Error} Specific archive error if transition is invalid
   */
  archiveGame: (game) => {
    if (game.archived === undefined) {
      throw archiveErrors.missingArchiveFlag(game.id);
    }
    if (game.archived === true) {
      throw archiveErrors.gameAlreadyArchived(game.id);
    }
    return Object.freeze({
      ...game,
      archived: true
    });
  },

  /**
   * Restores an archived game.
   * 
   * @param {Object} game - The game object to restore
   * @returns {Object} A new game object with archived: false
   * @throws {Error} Specific archive error if transition is invalid
   */
  restoreGame: (game) => {
    if (game.archived === undefined) {
      throw archiveErrors.missingArchiveFlag(game.id);
    }
    if (game.archived === false) {
      throw archiveErrors.gameNotArchived(game.id);
    }
    return Object.freeze({
      ...game,
      archived: false
    });
  }
};

module.exports = { ArchiveManager };
