/**
 * Tests for AdminGameService
 * 
 * As specified in specs/phase_4_5_admin_game_service.md
 */

import {
  AdminGameService,
  getAdminGameService,
  resetAdminGameService,
  AdminServiceError,
  ErrorType,
} from '../../src/admin/AdminGameService';
import { getSessionHistory, resetSessionHistory, ActionType } from '../../src/admin/SessionHistory';
import { clearCache, preloadGames } from '../../src/repository/GameRepository';

// Mock the repository
jest.mock('../../src/repository/GameRepository', () => ({
  gameExists: jest.fn(),
  getGameById: jest.fn(),
  clearCache: jest.fn(),
  preloadGames: jest.fn(),
}));

const mockGameExists = require('../../src/repository/GameRepository').gameExists;
const mockGetGameById = require('../../src/repository/GameRepository').getGameById;

describe('AdminGameService', () => {
  let service;

  const createValidGameData = (overrides = {}) => ({
    id: 'test-game',
    title: 'Test Game',
    description: 'A test game description',
    minPlayers: 2,
    maxPlayers: 4,
    playDuration: 'MEDIUM',
    ageRecommendation: '10+',
    firstPlayComplexity: 'MEDIUM',
    categories: ['Strategy'],
    mechanics: ['Dice Rolling'],
    awards: [],
    images: [{ id: 'test-img' }],
    favorite: false,
    archived: false,
    ...overrides,
  });

  beforeEach(() => {
    resetSessionHistory();
    resetAdminGameService();
    service = getAdminGameService();
    jest.clearAllMocks();
  });

  describe('addGame', () => {
    it('should add a valid game to session history', async () => {
      mockGameExists.mockResolvedValueOnce(false);

      const gameData = createValidGameData();
      const result = await service.addGame(gameData);

      expect(result.success).toBe(true);
      expect(result.gameId).toBe('test-game');

      const history = getSessionHistory();
      expect(history.getCount()).toBe(1);
      expect(history.getActions()[0].type).toBe(ActionType.ADD_GAME);
    });

    it('should throw VALIDATION_ERROR for invalid game data', async () => {
      const invalidGameData = createValidGameData({ title: '' });

      await expect(service.addGame(invalidGameData)).rejects.toThrow(AdminServiceError);

      try {
        await service.addGame(invalidGameData);
      } catch (error) {
        expect(error.type).toBe(ErrorType.VALIDATION_ERROR);
        expect(error.field).toBe('title');
      }
    });

    it('should throw DUPLICATE_ID for existing game ID', async () => {
      mockGameExists.mockResolvedValueOnce(true);

      const gameData = createValidGameData();

      await expect(service.addGame(gameData)).rejects.toThrow(AdminServiceError);

      try {
        await service.addGame(gameData);
      } catch (error) {
        expect(error.type).toBe(ErrorType.DUPLICATE_ID);
        expect(error.field).toBe('id');
      }
    });

    it('should throw DUPLICATE_ID if game ID exists in pending ADD actions', async () => {
      mockGameExists.mockResolvedValueOnce(false);

      // First add should succeed
      const gameData = createValidGameData();
      await service.addGame(gameData);

      // Second add with same ID should fail
      mockGameExists.mockResolvedValueOnce(false);
      await expect(service.addGame(gameData)).rejects.toThrow(AdminServiceError);

      try {
        await service.addGame(gameData);
      } catch (error) {
        expect(error.type).toBe(ErrorType.DUPLICATE_ID);
      }
    });

    it('should validate all mandatory fields', async () => {
      mockGameExists.mockResolvedValue(false);

      // Test missing ID
      await expect(service.addGame(createValidGameData({ id: '' }))).rejects.toThrow();

      // Test invalid player range
      await expect(service.addGame(createValidGameData({ minPlayers: 5, maxPlayers: 2 }))).rejects.toThrow();

      // Test invalid playDuration
      await expect(service.addGame(createValidGameData({ playDuration: 'INVALID' }))).rejects.toThrow();

      // Test empty images
      await expect(service.addGame(createValidGameData({ images: [] }))).rejects.toThrow();

      // Test non-boolean favorite
      await expect(service.addGame(createValidGameData({ favorite: 'yes' }))).rejects.toThrow();

      // Test non-boolean archived
      await expect(service.addGame(createValidGameData({ archived: 'yes' }))).rejects.toThrow();
    });
  });

  describe('updateGame', () => {
    it('should update an existing game', async () => {
      mockGameExists.mockResolvedValueOnce(true);
      mockGetGameById.mockResolvedValueOnce(createValidGameData());

      const gameData = createValidGameData({ title: 'Updated Title' });
      const result = await service.updateGame('test-game', gameData);

      expect(result.success).toBe(true);
      expect(result.gameId).toBe('test-game');

      const history = getSessionHistory();
      expect(history.getCount()).toBe(1);
      expect(history.getActions()[0].type).toBe(ActionType.UPDATE_GAME);
    });

    it('should throw GAME_NOT_FOUND for non-existing game', async () => {
      mockGameExists.mockResolvedValueOnce(false);

      const gameData = createValidGameData({ id: 'non-existing' });

      await expect(service.updateGame('non-existing', gameData)).rejects.toThrow(AdminServiceError);

      try {
        await service.updateGame('non-existing', gameData);
      } catch (error) {
        expect(error.type).toBe(ErrorType.GAME_NOT_FOUND);
      }
    });

    it('should throw VALIDATION_ERROR for ID mismatch', async () => {
      mockGameExists.mockResolvedValueOnce(true);

      const gameData = createValidGameData({ id: 'different-id' });

      await expect(service.updateGame('test-game', gameData)).rejects.toThrow(AdminServiceError);

      try {
        await service.updateGame('test-game', gameData);
      } catch (error) {
        expect(error.type).toBe(ErrorType.VALIDATION_ERROR);
        expect(error.field).toBe('id');
      }
    });

    it('should detect no changes and not add action', async () => {
      const originalGame = createValidGameData();
      mockGameExists.mockResolvedValue(true);
      mockGetGameById.mockResolvedValue(originalGame);

      const result = await service.updateGame('test-game', originalGame);

      expect(result.success).toBe(true);
      expect(result.noChanges).toBe(true);

      const history = getSessionHistory();
      expect(history.getCount()).toBe(0);
    });

    it('should replace existing UPDATE action for same game', async () => {
      mockGameExists.mockResolvedValue(true);
      mockGetGameById.mockResolvedValue(createValidGameData({ title: 'Original' }));

      // First update
      await service.updateGame('test-game', createValidGameData({ title: 'First Update' }));

      // Second update should replace first
      await service.updateGame('test-game', createValidGameData({ title: 'Second Update' }));

      const history = getSessionHistory();
      expect(history.getCount()).toBe(1);
      expect(history.getActions()[0].payload.title).toBe('Second Update');
    });
  });

  describe('archiveGame', () => {
    it('should add ARCHIVE_GAME action to session history', async () => {
      mockGetGameById.mockResolvedValueOnce(createValidGameData());

      const result = await service.archiveGame('test-game');

      expect(result.success).toBe(true);
      expect(result.gameId).toBe('test-game');

      const history = getSessionHistory();
      expect(history.getCount()).toBe(1);
      expect(history.getActions()[0].type).toBe(ActionType.ARCHIVE_GAME);
    });

    it('should throw GAME_NOT_FOUND for non-existing game', async () => {
      mockGetGameById.mockResolvedValueOnce(null);

      await expect(service.archiveGame('non-existing')).rejects.toThrow(AdminServiceError);

      try {
        await service.archiveGame('non-existing');
      } catch (error) {
        expect(error.type).toBe(ErrorType.GAME_NOT_FOUND);
      }
    });
  });

  describe('restoreGame', () => {
    it('should add RESTORE_GAME action to session history', async () => {
      mockGetGameById.mockResolvedValueOnce(createValidGameData({ archived: true }));

      const result = await service.restoreGame('test-game');

      expect(result.success).toBe(true);
      expect(result.gameId).toBe('test-game');

      const history = getSessionHistory();
      expect(history.getCount()).toBe(1);
      expect(history.getActions()[0].type).toBe(ActionType.RESTORE_GAME);
    });

    it('should throw GAME_NOT_FOUND for non-existing game', async () => {
      mockGetGameById.mockResolvedValueOnce(null);

      await expect(service.restoreGame('non-existing')).rejects.toThrow(AdminServiceError);

      try {
        await service.restoreGame('non-existing');
      } catch (error) {
        expect(error.type).toBe(ErrorType.GAME_NOT_FOUND);
      }
    });
  });

  describe('toggleFavorite', () => {
    it('should toggle favorite from false to true', async () => {
      mockGetGameById.mockResolvedValueOnce(createValidGameData({ favorite: false }));

      const result = await service.toggleFavorite('test-game');

      expect(result.success).toBe(true);
      expect(result.favorite).toBe(true);

      const history = getSessionHistory();
      expect(history.getCount()).toBe(1);
      expect(history.getActions()[0].type).toBe(ActionType.TOGGLE_FAVORITE);
      expect(history.getActions()[0].payload.favorite).toBe(true);
    });

    it('should toggle favorite from true to false', async () => {
      mockGetGameById.mockResolvedValueOnce(createValidGameData({ favorite: true }));

      const result = await service.toggleFavorite('test-game');

      expect(result.success).toBe(true);
      expect(result.favorite).toBe(false);

      const history = getSessionHistory();
      expect(history.getActions()[0].payload.favorite).toBe(false);
    });

    it('should throw GAME_NOT_FOUND for non-existing game', async () => {
      mockGetGameById.mockResolvedValueOnce(null);

      await expect(service.toggleFavorite('non-existing')).rejects.toThrow(AdminServiceError);

      try {
        await service.toggleFavorite('non-existing');
      } catch (error) {
        expect(error.type).toBe(ErrorType.GAME_NOT_FOUND);
      }
    });
  });

  describe('deleteGame', () => {
    it('should add DELETE_GAME action to session history', async () => {
      mockGetGameById.mockResolvedValueOnce(createValidGameData());

      const result = await service.deleteGame('test-game');

      expect(result.success).toBe(true);
      expect(result.gameId).toBe('test-game');

      const history = getSessionHistory();
      expect(history.getCount()).toBe(1);
      expect(history.getActions()[0].type).toBe(ActionType.DELETE_GAME);
    });

    it('should throw GAME_NOT_FOUND for non-existing game', async () => {
      mockGetGameById.mockResolvedValueOnce(null);

      await expect(service.deleteGame('non-existing')).rejects.toThrow(AdminServiceError);

      try {
        await service.deleteGame('non-existing');
      } catch (error) {
        expect(error.type).toBe(ErrorType.GAME_NOT_FOUND);
      }
    });
  });

  describe('singleton', () => {
    it('should return same instance from getAdminGameService', () => {
      const instance1 = getAdminGameService();
      const instance2 = getAdminGameService();

      expect(instance1).toBe(instance2);
    });

    it('should reset instance with resetAdminGameService', () => {
      const instance1 = getAdminGameService();
      resetAdminGameService();
      const instance2 = getAdminGameService();

      expect(instance1).not.toBe(instance2);
    });
  });

  describe('AdminServiceError', () => {
    it('should create error with type and field', () => {
      const error = new AdminServiceError('Test error', ErrorType.VALIDATION_ERROR, 'title');

      expect(error.message).toBe('Test error');
      expect(error.type).toBe(ErrorType.VALIDATION_ERROR);
      expect(error.field).toBe('title');
      expect(error.name).toBe('AdminServiceError');
    });

    it('should create error without field', () => {
      const error = new AdminServiceError('Test error', ErrorType.GAME_NOT_FOUND);

      expect(error.message).toBe('Test error');
      expect(error.type).toBe(ErrorType.GAME_NOT_FOUND);
      expect(error.field).toBeNull();
    });
  });

  describe('ErrorType constants', () => {
    it('should have all error types', () => {
      expect(ErrorType.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ErrorType.GAME_NOT_FOUND).toBe('GAME_NOT_FOUND');
      expect(ErrorType.DUPLICATE_ID).toBe('DUPLICATE_ID');
      expect(ErrorType.INVALID_OPERATION).toBe('INVALID_OPERATION');
    });
  });

  describe('_deepEqual', () => {
    it('should compare primitive values correctly', () => {
      expect(service._deepEqual(1, 1)).toBe(true);
      expect(service._deepEqual('a', 'a')).toBe(true);
      expect(service._deepEqual(true, true)).toBe(true);
      expect(service._deepEqual(1, 2)).toBe(false);
      expect(service._deepEqual('a', 'b')).toBe(false);
    });

    it('should compare arrays correctly', () => {
      expect(service._deepEqual([1, 2], [1, 2])).toBe(true);
      expect(service._deepEqual([1, 2], [2, 1])).toBe(false);
      expect(service._deepEqual([1, 2], [1])).toBe(false);
    });

    it('should compare objects correctly', () => {
      expect(service._deepEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(service._deepEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(service._deepEqual({ a: 1 }, { b: 1 })).toBe(false);
    });

    it('should compare nested objects correctly', () => {
      const obj1 = { a: { b: { c: 1 } } };
      const obj2 = { a: { b: { c: 1 } } };
      const obj3 = { a: { b: { c: 2 } } };

      expect(service._deepEqual(obj1, obj2)).toBe(true);
      expect(service._deepEqual(obj1, obj3)).toBe(false);
    });

    it('should handle null values', () => {
      expect(service._deepEqual(null, null)).toBe(true);
      expect(service._deepEqual(null, {})).toBe(false);
      expect(service._deepEqual({}, null)).toBe(false);
    });
  });
});