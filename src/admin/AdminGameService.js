/**
 * AdminGameService
 * 
 * Orchestrates all administrative operations on games within a browser session.
 * As specified in specs/phase_4_5_admin_game_service.md
 */

import { getSessionHistory, ActionType } from './SessionHistory';
import { validateGame, createGame, GameValidationError } from '../domain/Game';
import { gameExists, getGameById } from '../repository/GameRepository';

/**
 * Service error types
 */
export class AdminServiceError extends Error {
  constructor(message, type, field = null) {
    super(message);
    this.name = 'AdminServiceError';
    this.type = type;
    this.field = field;
  }
}

export const ErrorType = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  GAME_NOT_FOUND: 'GAME_NOT_FOUND',
  DUPLICATE_ID: 'DUPLICATE_ID',
  INVALID_OPERATION: 'INVALID_OPERATION',
};

/**
 * AdminGameService class
 * Provides methods for all admin operations
 */
export class AdminGameService {
  constructor() {
    this.sessionHistory = getSessionHistory();
    console.log('[AdminGameService]', 'constructor', { initialized: true });
  }

  /**
   * Check if a game ID exists in repository or pending ADD actions
   * @param {string} gameId 
   * @returns {Promise<boolean>}
   */
  async _checkIdExists(gameId) {
    // Check repository
    const exists = await gameExists(gameId);
    if (exists) return true;

    // Check pending ADD actions
    const actions = this.sessionHistory.getActions();
    return actions.some(
      a => a.type === ActionType.ADD_GAME && a.gameId === gameId
    );
  }

  /**
   * Get the current state of a game (from repository or pending actions)
   * @param {string} gameId 
   * @returns {Promise<object|null>}
   */
  async _getGameCurrentState(gameId) {
    // No pending actions, get from repository
    try {
      const game = await getGameById(gameId, 'admin');
      return game;
    } catch {
      return null;
    }
  }

  /**
   * Add a new game
   * @param {object} gameData - Full game definition
   * @returns {Promise<object>} Result with success status
   * @throws {AdminServiceError}
   */
  async addGame(gameData) {
    console.log('[AdminGameService]', 'addGame', { id: gameData?.id });

    try {
      // Validate game data
      validateGame(gameData);
    } catch (error) {
      if (error instanceof GameValidationError) {
        console.error('[AdminGameService]', 'addGame', { error: error.message, field: error.field });
        throw new AdminServiceError(error.message, ErrorType.VALIDATION_ERROR, error.field);
      }
      throw error;
    }

    // Check for duplicate ID
    const idExists = await this._checkIdExists(gameData.id);
    if (idExists) {
      console.error('[AdminGameService]', 'addGame', { error: 'Duplicate ID', id: gameData.id });
      throw new AdminServiceError(
        `Game with ID "${gameData.id}" already exists`,
        ErrorType.DUPLICATE_ID,
        'id'
      );
    }

    // Create game entity
    const game = createGame(gameData);

    // Add to session history
    this.sessionHistory.addAction(
      ActionType.ADD_GAME,
      game.id,
      game.title,
      game
    );

    console.log('[AdminGameService]', 'addGame', { success: true, id: game.id });

    return {
      success: true,
      gameId: game.id,
    };
  }

  /**
   * Deep compare two objects to check if they are equal
   * @param {object} obj1 
   * @param {object} obj2 
   * @returns {boolean}
   */
  _deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    if (obj1 === null || obj2 === null) return false;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      
      const val1 = obj1[key];
      const val2 = obj2[key];
      
      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (val1.length !== val2.length) return false;
        if (!val1.every((v, i) => this._deepEqual(v, val2[i]))) return false;
      } else if (typeof val1 === 'object' && typeof val2 === 'object') {
        if (!this._deepEqual(val1, val2)) return false;
      } else if (val1 !== val2) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Update an existing game
   * @param {string} gameId - Target game ID
   * @param {object} gameData - Full game definition
   * @param {string[]} modifiedFields - List of modified field names
   * @returns {Promise<object>} Result with success status
   * @throws {AdminServiceError}
   */
  async updateGame(gameId, gameData, modifiedFields = []) {
    console.log('[AdminGameService]', 'updateGame', { id: gameId });

    try {
      // Validate game data
      validateGame(gameData);
    } catch (error) {
      if (error instanceof GameValidationError) {
        console.error('[AdminGameService]', 'updateGame', { error: error.message, field: error.field });
        throw new AdminServiceError(error.message, ErrorType.VALIDATION_ERROR, error.field);
      }
      throw error;
    }

    // Ensure ID in data matches gameId parameter
    if (gameData.id !== gameId) {
      console.error('[AdminGameService]', 'updateGame', { error: 'ID mismatch' });
      throw new AdminServiceError(
        'Game ID in data does not match gameId parameter',
        ErrorType.VALIDATION_ERROR,
        'id'
      );
    }

    // Check if game exists (in repository or pending ADD)
    const exists = await this._checkIdExists(gameId);
    if (!exists) {
      console.error('[AdminGameService]', 'updateGame', { error: 'Game not found', id: gameId });
      throw new AdminServiceError(
        `Game with ID "${gameId}" not found`,
        ErrorType.GAME_NOT_FOUND
      );
    }

    // Get original game data from repository (not from pending actions)
    let originalGame = null;
    try {
      originalGame = await getGameById(gameId, 'admin');
    } catch {
      // Game might be a pending ADD, in which case we can't compare
    }
    
    // Create game entity
    const game = createGame(gameData);

    // Check if there are actual changes compared to original
    if (originalGame && this._deepEqual(game, originalGame)) {
      // No changes - remove any existing UPDATE action for this game
      const actions = this.sessionHistory.getActions();
      const existingIndex = actions.findIndex(
        a => a.type === ActionType.UPDATE_GAME && a.gameId === gameId
      );
      if (existingIndex !== -1) {
        this.sessionHistory.removeAction(existingIndex);
        console.log('[AdminGameService]', 'updateGame', { noChanges: true, removedAction: true });
      } else {
        console.log('[AdminGameService]', 'updateGame', { noChanges: true });
      }
      return {
        success: true,
        gameId: game.id,
        noChanges: true,
      };
    }

    // Add to session history with modified fields
    this.sessionHistory.addAction(
      ActionType.UPDATE_GAME,
      game.id,
      game.title,
      game,
      modifiedFields
    );

    console.log('[AdminGameService]', 'updateGame', { success: true, id: game.id, modifiedFields });

    return {
      success: true,
      gameId: game.id,
    };
  }

  /**
   * Archive a game
   * @param {string} gameId - Target game ID
   * @returns {Promise<object>} Result with success status
   * @throws {AdminServiceError}
   */
  async archiveGame(gameId) {
    console.log('[AdminGameService]', 'archiveGame', { id: gameId });

    // Check if game exists
    const game = await this._getGameCurrentState(gameId);
    if (!game) {
      console.error('[AdminGameService]', 'archiveGame', { error: 'Game not found', id: gameId });
      throw new AdminServiceError(
        `Game with ID "${gameId}" not found`,
        ErrorType.GAME_NOT_FOUND
      );
    }

    // Add to session history
    this.sessionHistory.addAction(
      ActionType.ARCHIVE_GAME,
      gameId,
      game.title,
      null
    );

    console.log('[AdminGameService]', 'archiveGame', { success: true, id: gameId });

    return {
      success: true,
      gameId,
    };
  }

  /**
   * Restore an archived game
   * @param {string} gameId - Target game ID
   * @returns {Promise<object>} Result with success status
   * @throws {AdminServiceError}
   */
  async restoreGame(gameId) {
    console.log('[AdminGameService]', 'restoreGame', { id: gameId });

    // Check if game exists
    const game = await this._getGameCurrentState(gameId);
    if (!game) {
      console.error('[AdminGameService]', 'restoreGame', { error: 'Game not found', id: gameId });
      throw new AdminServiceError(
        `Game with ID "${gameId}" not found`,
        ErrorType.GAME_NOT_FOUND
      );
    }

    // Add to session history
    this.sessionHistory.addAction(
      ActionType.RESTORE_GAME,
      gameId,
      game.title,
      null
    );

    console.log('[AdminGameService]', 'restoreGame', { success: true, id: gameId });

    return {
      success: true,
      gameId,
    };
  }

  /**
   * Toggle favorite status of a game
   * @param {string} gameId - Target game ID
   * @returns {Promise<object>} Result with success status and new favorite state
   * @throws {AdminServiceError}
   */
  async toggleFavorite(gameId) {
    console.log('[AdminGameService]', 'toggleFavorite', { id: gameId });

    // Check if game exists and get current state
    const game = await this._getGameCurrentState(gameId);
    if (!game) {
      console.error('[AdminGameService]', 'toggleFavorite', { error: 'Game not found', id: gameId });
      throw new AdminServiceError(
        `Game with ID "${gameId}" not found`,
        ErrorType.GAME_NOT_FOUND
      );
    }

    // Determine new favorite state (toggle current)
    const newFavoriteState = !game.favorite;

    // Add to session history
    this.sessionHistory.addAction(
      ActionType.TOGGLE_FAVORITE,
      gameId,
      game.title,
      { favorite: newFavoriteState }
    );

    console.log('[AdminGameService]', 'toggleFavorite', { 
      success: true, 
      id: gameId, 
      newFavorite: newFavoriteState 
    });

    return {
      success: true,
      gameId,
      favorite: newFavoriteState,
    };
  }

  /**
   * Delete a game permanently
   * @param {string} gameId - Target game ID
   * @returns {Promise<object>} Result with success status
   * @throws {AdminServiceError}
   */
  async deleteGame(gameId) {
    console.log('[AdminGameService]', 'deleteGame', { id: gameId });

    // Check if game exists
    const game = await this._getGameCurrentState(gameId);
    if (!game) {
      console.error('[AdminGameService]', 'deleteGame', { error: 'Game not found', id: gameId });
      throw new AdminServiceError(
        `Game with ID "${gameId}" not found`,
        ErrorType.GAME_NOT_FOUND
      );
    }

    // Add to session history
    this.sessionHistory.addAction(
      ActionType.DELETE_GAME,
      gameId,
      game.title,
      null
    );

    console.log('[AdminGameService]', 'deleteGame', { success: true, id: gameId });

    return {
      success: true,
      gameId,
    };
  }
}

// Singleton instance
let adminGameServiceInstance = null;

/**
 * Get the singleton AdminGameService instance
 * @returns {AdminGameService}
 */
export function getAdminGameService() {
  if (!adminGameServiceInstance) {
    adminGameServiceInstance = new AdminGameService();
  }
  return adminGameServiceInstance;
}

/**
 * Reset the singleton (useful for testing)
 */
export function resetAdminGameService() {
  adminGameServiceInstance = null;
  console.log('[AdminGameService]', 'resetAdminGameService');
}