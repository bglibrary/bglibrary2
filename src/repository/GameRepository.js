/**
 * Game Repository Authoritative read-access component.
 * @see specs/phase_3_2_ref_spec_game_repository.md
 */

const { gameNotFound, gameArchivedNotVisible, dataLoadFailure } = require("./repositoryErrors");

function createGameRepository({ loadGames }) {
  /**
   * Returns all games visible in the given context.
   * @param {"visitor" | "admin"} context
   * @returns {Promise<import("../domain/Game").Game[]>}
   */
  async function getAllGames(context = "visitor") {
    try {
      const allGames = await loadGames();
      if (context === "admin") return allGames;
      return allGames.filter((g) => !g.archived);
    } catch (err) {
      throw dataLoadFailure(err);
    }
  }

  /**
   * Returns a specific game by ID if visible in the context.
   * @param {string} id
   * @param {"visitor" | "admin"} context
   * @returns {Promise<import("../domain/Game").Game>}
   */
  async function getGameById(id, context = "visitor") {
    const allGames = await getAllGames("admin");
    const game = allGames.find((g) => g.id === id);

    if (!game) throw gameNotFound(id);

    if (context === "visitor" && game.archived) {
      throw gameArchivedNotVisible(id);
    }

    return game;
  }

  return {
    getAllGames,
    getGameById,
  };
}

module.exports = { createGameRepository };
