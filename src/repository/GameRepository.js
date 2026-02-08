/**
 * GameRepository — single authoritative read-access for game data.
 * Enforces visibility rules (archived vs active) by context.
 * @see specs/phase_3_2_ref_spec_game_repository.md
 */

const { createGame, validateGame } = require("../domain/Game");
const { gameNotFound, gameArchivedNotVisible, dataLoadFailure } = require("./repositoryErrors");

/** @typedef {"visitor" | "admin"} RepositoryContext */

/**
 * Creates a GameRepository that loads games via the provided loader.
 * Loader may be sync (returns array) or async (returns Promise<array>).
 * Games are validated on load; invalid entries cause data load failure.
 *
 * @param {{ loadGames: () => import("../domain/Game").Game[] | Promise<import("../domain/Game").Game[]> }} options
 * @returns {{ getAllGames: (context: RepositoryContext) => Promise<import("../domain/Game").Game[]>, getGameById: (id: string, context: RepositoryContext) => Promise<import("../domain/Game").Game> }}
 */
function createGameRepository({ loadGames }) {
  /**
   * @param {RepositoryContext} context
   * @returns {Promise<import("../domain/Game").Game[]>}
   */
  async function getAllGames(context) {
    let games;
    try {
      const result = loadGames();
      games = result && typeof result.then === "function" ? await result : result;
    } catch (err) {
      throw Object.assign(new Error(dataLoadFailure(err.message).message), {
        code: "DATA_LOAD_FAILURE",
        cause: err,
      });
    }
    if (!Array.isArray(games)) {
      throw new Error(dataLoadFailure("games is not an array").message);
    }
    const validated = [];
    for (const raw of games) {
      const errors = validateGame(raw);
      if (errors.length > 0) continue;
      validated.push(createGame(raw));
    }
    if (context === "visitor") {
      return validated.filter((g) => !g.archived);
    }
    return validated;
  }

  /**
   * @param {string} id
   * @param {RepositoryContext} context
   * @returns {Promise<import("../domain/Game").Game>}
   */
  async function getGameById(id, context) {
    const all = await getAllGames("admin");
    const game = all.find((g) => g.id === id);
    if (!game) {
      throw Object.assign(new Error(gameNotFound(id).message), { code: "GAME_NOT_FOUND", gameId: id });
    }
    if (game.archived && context === "visitor") {
      throw Object.assign(new Error(gameArchivedNotVisible(id).message), {
        code: "GAME_ARCHIVED_NOT_VISIBLE",
        gameId: id,
      });
    }
    return game;
  }

  return { getAllGames, getGameById };
}

module.exports = { createGameRepository };
