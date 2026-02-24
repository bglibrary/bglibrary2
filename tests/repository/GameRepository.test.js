/**
 * Tests for GameRepository
 * 
 * As specified in specs/phase_3_2_ref_spec_game_repository.md
 */

import {
  getAllGames,
  getGameById,
  gameExists,
  clearCache,
  preloadGames,
  getAllCategories,
  getAllMechanics,
  Context,
  RepositoryError,
  ErrorType,
} from '../../src/repository/GameRepository';

// Mock fetch globally
global.fetch = jest.fn();

describe('GameRepository', () => {
  beforeEach(() => {
    clearCache();
    fetch.mockClear();
  });

  const createMockGame = (id, overrides = {}) => ({
    id,
    title: `Game ${id}`,
    description: `Description for ${id}`,
    minPlayers: 2,
    maxPlayers: 4,
    playDuration: 'MEDIUM',
    ageRecommendation: '10+',
    firstPlayComplexity: 'MEDIUM',
    categories: ['Strategy'],
    mechanics: ['Dice Rolling'],
    awards: [],
    images: [{ id: `${id}-img` }],
    favorite: false,
    archived: false,
    ...overrides,
  });

  describe('getAllGames', () => {
    describe('with VISITOR context', () => {
      it('should return only non-archived games for visitors', async () => {
        const mockGames = [
          createMockGame('game-1'),
          createMockGame('game-2', { archived: true }),
          createMockGame('game-3'),
        ];

        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ games: ['game-1', 'game-2', 'game-3'] }),
        });

        for (const game of mockGames) {
          fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => game,
          });
        }

        const games = await getAllGames(Context.VISITOR);

        expect(games).toHaveLength(2);
        expect(games.map(g => g.id)).toContain('game-1');
        expect(games.map(g => g.id)).toContain('game-3');
        expect(games.map(g => g.id)).not.toContain('game-2');
      });

      it('should return empty array when all games are archived', async () => {
        const mockGames = [
          createMockGame('game-1', { archived: true }),
          createMockGame('game-2', { archived: true }),
        ];

        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ games: ['game-1', 'game-2'] }),
        });

        for (const game of mockGames) {
          fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => game,
          });
        }

        const games = await getAllGames(Context.VISITOR);

        expect(games).toHaveLength(0);
      });
    });

    describe('with ADMIN context', () => {
      it('should return all games including archived for admin', async () => {
        const mockGames = [
          createMockGame('game-1'),
          createMockGame('game-2', { archived: true }),
          createMockGame('game-3'),
        ];

        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ games: ['game-1', 'game-2', 'game-3'] }),
        });

        for (const game of mockGames) {
          fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => game,
          });
        }

        const games = await getAllGames(Context.ADMIN);

        expect(games).toHaveLength(3);
        expect(games.map(g => g.id)).toContain('game-1');
        expect(games.map(g => g.id)).toContain('game-2');
        expect(games.map(g => g.id)).toContain('game-3');
      });
    });

    describe('caching', () => {
      it('should cache games after first load', async () => {
        const mockGames = [createMockGame('game-1')];

        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ games: ['game-1'] }),
        });

        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockGames[0],
        });

        await getAllGames(Context.VISITOR);
        await getAllGames(Context.VISITOR);

        // Should only call fetch twice (index + game file), not four times
        expect(fetch).toHaveBeenCalledTimes(2);
      });

      it('should return a copy of cached games', async () => {
        const mockGames = [createMockGame('game-1')];

        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ games: ['game-1'] }),
        });

        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockGames[0],
        });

        const games1 = await getAllGames(Context.VISITOR);
        const games2 = await getAllGames(Context.VISITOR);

        expect(games1).not.toBe(games2);
      });
    });
  });

  describe('getGameById', () => {
    it('should return game by ID', async () => {
      const mockGame = createMockGame('test-game');

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ games: ['test-game'] }),
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGame,
      });

      const game = await getGameById('test-game', Context.VISITOR);

      expect(game.id).toBe('test-game');
      expect(game.title).toBe('Game test-game');
    });

    it('should throw GAME_NOT_FOUND for non-existing game', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ games: [] }),
      });

      await expect(getGameById('non-existing', Context.VISITOR)).rejects.toThrow(RepositoryError);

      try {
        await getGameById('non-existing', Context.VISITOR);
      } catch (error) {
        expect(error.type).toBe(ErrorType.GAME_NOT_FOUND);
      }
    });

    it('should throw GAME_ARCHIVED for archived game in VISITOR context', async () => {
      const mockGame = createMockGame('archived-game', { archived: true });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ games: ['archived-game'] }),
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGame,
      });

      await expect(getGameById('archived-game', Context.VISITOR)).rejects.toThrow(RepositoryError);

      try {
        await getGameById('archived-game', Context.VISITOR);
      } catch (error) {
        expect(error.type).toBe(ErrorType.GAME_ARCHIVED);
      }
    });

    it('should return archived game in ADMIN context', async () => {
      const mockGame = createMockGame('archived-game', { archived: true });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ games: ['archived-game'] }),
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGame,
      });

      const game = await getGameById('archived-game', Context.ADMIN);

      expect(game.id).toBe('archived-game');
      expect(game.archived).toBe(true);
    });

    it('should return a copy of the game', async () => {
      const mockGame = createMockGame('test-game');

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ games: ['test-game'] }),
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGame,
      });

      const game1 = await getGameById('test-game', Context.VISITOR);
      const game2 = await getGameById('test-game', Context.ADMIN);

      expect(game1).not.toBe(game2);
    });
  });

  describe('gameExists', () => {
    it('should return true for existing game', async () => {
      const mockGame = createMockGame('existing-game');

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ games: ['existing-game'] }),
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGame,
      });

      const exists = await gameExists('existing-game');

      expect(exists).toBe(true);
    });

    it('should return false for non-existing game', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ games: [] }),
      });

      const exists = await gameExists('non-existing');

      expect(exists).toBe(false);
    });
  });

  describe('clearCache', () => {
    it('should clear the games cache', async () => {
      const mockGame = createMockGame('game-1');

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ games: ['game-1'] }),
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGame,
      });

      await getAllGames(Context.VISITOR);
      clearCache();

      // After clearing cache, fetch should be called again
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ games: ['game-1'] }),
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGame,
      });

      await getAllGames(Context.VISITOR);

      // Total: 4 calls (2 before clear + 2 after clear)
      expect(fetch).toHaveBeenCalledTimes(4);
    });
  });

  describe('preloadGames', () => {
    it('should preload games into cache', async () => {
      const mockGames = [
        createMockGame('game-1'),
        createMockGame('game-2'),
      ];

      preloadGames(mockGames);

      const games = await getAllGames(Context.VISITOR);

      expect(games).toHaveLength(2);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should create copies of preloaded games', async () => {
      const mockGames = [createMockGame('game-1')];

      preloadGames(mockGames);

      mockGames[0].title = 'Modified Title';

      const games = await getAllGames(Context.VISITOR);

      expect(games[0].title).toBe('Game game-1');
    });
  });

  describe('getAllCategories', () => {
    it('should return unique sorted categories', async () => {
      const mockGames = [
        createMockGame('game-1', { categories: ['Strategy', 'Family'] }),
        createMockGame('game-2', { categories: ['Family', 'Party'] }),
        createMockGame('game-3', { categories: ['Strategy'] }),
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ games: ['game-1', 'game-2', 'game-3'] }),
      });

      for (const game of mockGames) {
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => game,
        });
      }

      const categories = await getAllCategories();

      expect(categories).toEqual(['Family', 'Party', 'Strategy']);
    });

    it('should return empty array when no games', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ games: [] }),
      });

      const categories = await getAllCategories();

      expect(categories).toEqual([]);
    });

    it('should handle games without categories', async () => {
      const mockGames = [
        createMockGame('game-1', { categories: [] }),
        createMockGame('game-2', { categories: undefined }),
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ games: ['game-1', 'game-2'] }),
      });

      for (const game of mockGames) {
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => game,
        });
      }

      const categories = await getAllCategories();

      expect(categories).toEqual([]);
    });
  });

  describe('getAllMechanics', () => {
    it('should return unique sorted mechanics', async () => {
      const mockGames = [
        createMockGame('game-1', { mechanics: ['Dice Rolling', 'Card Drafting'] }),
        createMockGame('game-2', { mechanics: ['Card Drafting', 'Worker Placement'] }),
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ games: ['game-1', 'game-2'] }),
      });

      for (const game of mockGames) {
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => game,
        });
      }

      const mechanics = await getAllMechanics();

      expect(mechanics).toEqual(['Card Drafting', 'Dice Rolling', 'Worker Placement']);
    });
  });

  describe('Context constants', () => {
    it('should have VISITOR context', () => {
      expect(Context.VISITOR).toBe('visitor');
    });

    it('should have ADMIN context', () => {
      expect(Context.ADMIN).toBe('admin');
    });
  });

  describe('ErrorType constants', () => {
    it('should have all error types', () => {
      expect(ErrorType.GAME_NOT_FOUND).toBe('GAME_NOT_FOUND');
      expect(ErrorType.GAME_ARCHIVED).toBe('GAME_ARCHIVED');
      expect(ErrorType.DATA_LOAD_FAILURE).toBe('DATA_LOAD_FAILURE');
    });
  });

  describe('RepositoryError', () => {
    it('should create error with type', () => {
      const error = new RepositoryError('Test error', ErrorType.GAME_NOT_FOUND);

      expect(error.message).toBe('Test error');
      expect(error.type).toBe(ErrorType.GAME_NOT_FOUND);
      expect(error.name).toBe('RepositoryError');
    });
  });
});