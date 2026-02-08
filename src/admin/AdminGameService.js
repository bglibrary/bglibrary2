/**
 * AdminGameService — orchestrates add, update, archive, restore.
 * @see specs/phase_4_5_admin_game_service.md, phase_5_5_admin_service_contracts.md
 */
const { createGame, validateGame } = require("../domain/Game");
const { archiveGame, restoreGame } = require("./ArchiveManager");
const {
  duplicateGameId,
  gameNotFound,
  invalidGameData,
  gameAlreadyArchived,
  gameNotArchived,
} = require("./adminServiceErrors");

/**
 * Creates AdminGameService. Store must provide:
 * - getAllGames(): Promise<Game[]>
 * - getGameById(id): Promise<Game | null>
 * - saveGame(game): Promise<void>
 *
 * @param {{ getAllGames: () => Promise<import("../domain/Game").Game[]>, getGameById: (id: string) => Promise<import("../domain/Game").Game | null>, saveGame: (game: import("../domain/Game").Game) => Promise<void> }} store
 */
function createAdminGameService(store) {
  async function addGame(gameInput) {
    const errors = validateGame(gameInput);
    if (errors.length > 0) {
      throw Object.assign(new Error(invalidGameData(errors.map((e) => e.code).join(", ")).message), {
        code: "INVALID_GAME_DATA",
      });
    }
    const game = createGame(gameInput);
    if (game.archived !== false) {
      throw Object.assign(new Error(invalidGameData("archived must be false").message), {
        code: "INVALID_GAME_DATA",
      });
    }
    const existing = await store.getGameById(game.id);
    if (existing) {
      throw Object.assign(new Error(duplicateGameId(game.id).message), {
        code: "DUPLICATE_GAME_ID",
        gameId: game.id,
      });
    }
    await store.saveGame(game);
  }

  async function updateGame(id, gameInput) {
    const errors = validateGame(gameInput);
    if (errors.length > 0) {
      throw Object.assign(new Error(invalidGameData(errors.map((e) => e.code).join(", ")).message), {
        code: "INVALID_GAME_DATA",
      });
    }
    const game = createGame({ ...gameInput, id });
    const existing = await store.getGameById(id);
    if (!existing) {
      throw Object.assign(new Error(gameNotFound(id).message), { code: "GAME_NOT_FOUND", gameId: id });
    }
    await store.saveGame(game);
  }

  async function archiveGameById(id) {
    const existing = await store.getGameById(id);
    if (!existing) {
      throw Object.assign(new Error(gameNotFound(id).message), { code: "GAME_NOT_FOUND", gameId: id });
    }
    try {
      const archived = archiveGame(existing);
      await store.saveGame(archived);
    } catch (err) {
      if (err.code === "GAME_ALREADY_ARCHIVED") {
        throw Object.assign(new Error(gameAlreadyArchived(id).message), {
          code: "GAME_ALREADY_ARCHIVED",
          gameId: id,
        });
      }
      throw err;
    }
  }

  async function restoreGameById(id) {
    const existing = await store.getGameById(id);
    if (!existing) {
      throw Object.assign(new Error(gameNotFound(id).message), { code: "GAME_NOT_FOUND", gameId: id });
    }
    try {
      const restored = restoreGame(existing);
      await store.saveGame(restored);
    } catch (err) {
      if (err.code === "GAME_NOT_ARCHIVED") {
        throw Object.assign(new Error(gameNotArchived(id).message), {
          code: "GAME_NOT_ARCHIVED",
          gameId: id,
        });
      }
      throw err;
    }
  }

  return {
    addGame,
    updateGame,
    archiveGame: archiveGameById,
    restoreGame: restoreGameById,
  };
}

module.exports = { createAdminGameService };
