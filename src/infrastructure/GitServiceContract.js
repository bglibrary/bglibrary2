/**
 * GitService contract.
 * @see specs/phase_4_7_git_service_contract.md
 */

/**
 * @interface GitService
 */
const GitServiceContract = {
  /**
   * Adds a new game.
   * @param {Object} gameData
   * @returns {Promise<void>}
   */
  addGame: async (gameData) => { throw new Error("Not implemented"); },

  /**
   * Updates an existing game.
   * @param {string} id
   * @param {Object} gameData
   * @returns {Promise<void>}
   */
  updateGame: async (id, gameData) => { throw new Error("Not implemented"); },

  /**
   * Archives a game.
   * @param {string} id
   * @returns {Promise<void>}
   */
  archiveGame: async (id) => { throw new Error("Not implemented"); },

  /**
   * Restores an archived game.
   * @param {string} id
   * @returns {Promise<void>}
   */
  restoreGame: async (id) => { throw new Error("Not implemented"); },
};

module.exports = GitServiceContract;
