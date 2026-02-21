/**
 * Tests for Game Domain Entity
 * 
 * As specified in specs/phase_5_2_game_domain_model.md
 */

import {
  PlayDuration,
  FirstPlayComplexity,
  AgeRecommendations,
  isValidPlayDuration,
  isValidFirstPlayComplexity,
  isValidAgeRecommendation,
  isValidPlayerRange,
  isValidImageDescriptor,
  isValidAward,
  validateGame,
  createGame,
  generateGameId,
  GameValidationError,
} from '../../src/domain/Game';

describe('Game Domain Entity', () => {
  describe('PlayDuration enum', () => {
    it('should have SHORT, MEDIUM, and LONG values', () => {
      expect(PlayDuration.SHORT).toBe('SHORT');
      expect(PlayDuration.MEDIUM).toBe('MEDIUM');
      expect(PlayDuration.LONG).toBe('LONG');
    });
  });

  describe('FirstPlayComplexity enum', () => {
    it('should have LOW, MEDIUM, and HIGH values', () => {
      expect(FirstPlayComplexity.LOW).toBe('LOW');
      expect(FirstPlayComplexity.MEDIUM).toBe('MEDIUM');
      expect(FirstPlayComplexity.HIGH).toBe('HIGH');
    });
  });

  describe('isValidPlayDuration', () => {
    it('should return true for valid durations', () => {
      expect(isValidPlayDuration('SHORT')).toBe(true);
      expect(isValidPlayDuration('MEDIUM')).toBe(true);
      expect(isValidPlayDuration('LONG')).toBe(true);
    });

    it('should return false for invalid durations', () => {
      expect(isValidPlayDuration('INVALID')).toBe(false);
      expect(isValidPlayDuration('')).toBe(false);
      expect(isValidPlayDuration(null)).toBe(false);
    });
  });

  describe('isValidFirstPlayComplexity', () => {
    it('should return true for valid complexities', () => {
      expect(isValidFirstPlayComplexity('LOW')).toBe(true);
      expect(isValidFirstPlayComplexity('MEDIUM')).toBe(true);
      expect(isValidFirstPlayComplexity('HIGH')).toBe(true);
    });

    it('should return false for invalid complexities', () => {
      expect(isValidFirstPlayComplexity('INVALID')).toBe(false);
      expect(isValidFirstPlayComplexity('')).toBe(false);
      expect(isValidFirstPlayComplexity(null)).toBe(false);
    });
  });

  describe('isValidAgeRecommendation', () => {
    it('should return true for valid age recommendations', () => {
      expect(isValidAgeRecommendation('6+')).toBe(true);
      expect(isValidAgeRecommendation('10+')).toBe(true);
      expect(isValidAgeRecommendation('18+')).toBe(true);
    });

    it('should return false for invalid age recommendations', () => {
      expect(isValidAgeRecommendation('5+')).toBe(false);
      expect(isValidAgeRecommendation('')).toBe(false);
      expect(isValidAgeRecommendation(null)).toBe(false);
    });
  });

  describe('isValidPlayerRange', () => {
    it('should return true for valid player ranges', () => {
      expect(isValidPlayerRange(1, 4)).toBe(true);
      expect(isValidPlayerRange(2, 2)).toBe(true);
      expect(isValidPlayerRange(3, 6)).toBe(true);
    });

    it('should return false for invalid player ranges', () => {
      expect(isValidPlayerRange(0, 4)).toBe(false);
      expect(isValidPlayerRange(4, 2)).toBe(false);
      expect(isValidPlayerRange(-1, 4)).toBe(false);
    });
  });

  describe('isValidImageDescriptor', () => {
    it('should return true for valid image descriptors', () => {
      expect(isValidImageDescriptor({ id: 'test-image' })).toBe(true);
      expect(isValidImageDescriptor({ id: 'img1', source: 'publisher' })).toBe(true);
    });

    it('should return false for invalid image descriptors', () => {
      expect(isValidImageDescriptor(null)).toBe(false);
      expect(isValidImageDescriptor({})).toBe(false);
      expect(isValidImageDescriptor({ id: '' })).toBe(false);
    });
  });

  describe('isValidAward', () => {
    it('should return true for valid awards', () => {
      expect(isValidAward({ name: 'Spiel des Jahres' })).toBe(true);
      expect(isValidAward({ name: 'Spiel des Jahres', year: 1995 })).toBe(true);
    });

    it('should return false for invalid awards', () => {
      expect(isValidAward(null)).toBe(false);
      expect(isValidAward({})).toBe(false);
      expect(isValidAward({ name: '' })).toBe(false);
      expect(isValidAward({ name: 'Test', year: '1995' })).toBe(false);
    });
  });

  describe('validateGame', () => {
    const validGame = {
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
    };

    it('should validate a complete valid game', () => {
      expect(() => validateGame(validGame)).not.toThrow();
    });

    it('should throw for missing ID', () => {
      const game = { ...validGame, id: '' };
      expect(() => validateGame(game)).toThrow(GameValidationError);
    });

    it('should throw for missing title', () => {
      const game = { ...validGame, title: '' };
      expect(() => validateGame(game)).toThrow(GameValidationError);
    });

    it('should throw for invalid player range', () => {
      const game = { ...validGame, minPlayers: 4, maxPlayers: 2 };
      expect(() => validateGame(game)).toThrow(GameValidationError);
    });

    it('should throw for invalid play duration', () => {
      const game = { ...validGame, playDuration: 'INVALID' };
      expect(() => validateGame(game)).toThrow(GameValidationError);
    });

    it('should throw for empty images array', () => {
      const game = { ...validGame, images: [] };
      expect(() => validateGame(game)).toThrow(GameValidationError);
    });

    it('should throw for non-boolean favorite', () => {
      const game = { ...validGame, favorite: 'yes' };
      expect(() => validateGame(game)).toThrow(GameValidationError);
    });
  });

  describe('createGame', () => {
    const validGameData = {
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
      awards: [{ name: 'Test Award', year: 2020 }],
      images: [{ id: 'test-img' }],
      favorite: false,
      archived: false,
    };

    it('should create a game entity from valid data', () => {
      const game = createGame(validGameData);
      
      expect(game.id).toBe('test-game');
      expect(game.title).toBe('Test Game');
      expect(game.minPlayers).toBe(2);
      expect(game.maxPlayers).toBe(4);
    });

    it('should create immutable copies of arrays', () => {
      const game = createGame(validGameData);
      
      // Modify original
      validGameData.categories.push('New Category');
      
      // Game should not be affected
      expect(game.categories).toHaveLength(1);
      expect(game.categories[0]).toBe('Strategy');
    });

    it('should throw for invalid data', () => {
      const invalidData = { ...validGameData, id: '' };
      expect(() => createGame(invalidData)).toThrow(GameValidationError);
    });
  });

  describe('generateGameId', () => {
    it('should generate URL-friendly ID from title', () => {
      expect(generateGameId('Catan')).toBe('catan');
      expect(generateGameId('Ticket to Ride')).toBe('ticket-to-ride');
    });

    it('should handle diacritics', () => {
      expect(generateGameId('Les Aventuriers du Rail')).toBe('les-aventuriers-du-rail');
    });

    it('should handle special characters', () => {
      expect(generateGameId('7 Wonders!')).toBe('7-wonders');
    });
  });
});