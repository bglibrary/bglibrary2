const { validateGame } = require('../domain/Game');
const { ArchiveManager } = require('./ArchiveManager');
const { adminServiceErrors } = require('./adminServiceErrors');
const { gameRepository: GameRepository } = require('../infrastructure/getGames.server');

/**
 * AdminGameService orchestrates administrative operations on games.
 */
 class AdminGameService {
  constructor(gitService) {
    this.gitService = gitService;
  }

  /**
   * Adds a new game to the library.
   * 
   * @param {Object} gameData - The raw game data
   * @throws {Error} If validation or persistence fails
   */
  async addGame(gameData) {
    // 1. Validate domain rules
    const validationError = validateGame(gameData);
    if (validationError) {
      throw adminServiceErrors.invalidGameData(validationError);
    }

    // 2. Ensure uniqueness (existence check)
    try {
      await GameRepository.getGameById(gameData.id, "admin");
      throw adminServiceErrors.duplicateGameId(gameData.id);
    } catch (err) {
      if (err.type !== 'GameNotFound') throw err;
    }

    // 3. Persist via GitService
    try {
      await this.gitService.addGame(gameData);
    } catch (err) {
      throw adminServiceErrors.operationFailed(err.message || 'Échec de la persistance');
    }
  }

  /**
   * Updates an existing game.
   * 
   * @param {string} id - Target game ID
   * @param {Object} gameData - New game data
   * @throws {Error} If game missing, validation fails, or persistence fails
   */
  async updateGame(id, gameData) {
    // 1. Validate domain rules
    const validationError = validateGame(gameData);
    if (validationError) {
      throw adminServiceErrors.invalidGameData(validationError);
    }

    // 2. Check existence
    try {
      await GameRepository.getGameById(id, "admin");
    } catch (err) {
      if (err.type === 'GameNotFound') throw adminServiceErrors.gameNotFound(id);
      throw err;
    }

    // 3. Persist via GitService
    try {
      await this.gitService.updateGame(id, gameData);
    } catch (err) {
      throw adminServiceErrors.operationFailed(err.message || 'Échec de la mise à jour');
    }
  }

  /**
   * Archives a game.
   * 
   * @param {string} id - Target game ID
   */
  async archiveGame(id) {
    try {
      const game = await GameRepository.getGameById(id, "admin");
      const archivedGame = ArchiveManager.archiveGame(game);
      await this.gitService.archiveGame(id, archivedGame);
    } catch (err) {
      if (err.type === 'GameNotFound') throw adminServiceErrors.gameNotFound(id);
      throw adminServiceErrors.operationFailed(err.message || 'Échec de l\'archivage');
    }
  }

  /**
   * Restores a game.
   * 
   * @param {string} id - Target game ID
   */
  async restoreGame(id) {
    try {
      const game = await GameRepository.getGameById(id, "admin");
      const restoredGame = ArchiveManager.restoreGame(game);
      await this.gitService.restoreGame(id, restoredGame);
    } catch (err) {
      if (err.type === 'GameNotFound') throw adminServiceErrors.gameNotFound(id);
      throw adminServiceErrors.operationFailed(err.message || 'Échec de la restauration');
    }
  }
}

module.exports = { AdminGameService };
