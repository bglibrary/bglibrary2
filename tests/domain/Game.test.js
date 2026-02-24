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
      expect(generateGameId('Cité Perdue')).toBe('cite-perdue');
      expect(generateGameId('Aventuriers du Rail: Marklin')).toBe('aventuriers-du-rail-marklin');
    });

    it('should handle special characters', () => {
      expect(generateGameId('7 Wonders!')).toBe('7-wonders');
      expect(generateGameId('Love Letter (Premium)')).toBe('love-letter-premium');
      expect(generateGameId('King of Tokyo: Power Up!')).toBe('king-of-tokyo-power-up');
    });

    it('should handle multiple spaces', () => {
      expect(generateGameId('The   Game   of   Life')).toBe('the-game-of-life');
    });

    it('should handle leading and trailing spaces', () => {
      expect(generateGameId('  Catan  ')).toBe('catan');
    });

    it('should handle empty string', () => {
      expect(generateGameId('')).toBe('');
    });

    it('should handle titles with only special characters', () => {
      expect(generateGameId('!!!')).toBe('');
    });

    it('should handle mixed case', () => {
      expect(generateGameId('TICKET TO RIDE')).toBe('ticket-to-ride');
      expect(generateGameId('Ticket To Ride')).toBe('ticket-to-ride');
    });
  });

  describe('AgeRecommendations', () => {
    it('should contain all valid age recommendations', () => {
      expect(AgeRecommendations).toContain('6+');
      expect(AgeRecommendations).toContain('8+');
      expect(AgeRecommendations).toContain('10+');
      expect(AgeRecommendations).toContain('12+');
      expect(AgeRecommendations).toContain('14+');
      expect(AgeRecommendations).toContain('16+');
      expect(AgeRecommendations).toContain('18+');
    });

    it('should have 7 age recommendations', () => {
      expect(AgeRecommendations).toHaveLength(7);
    });
  });

  describe('GameValidationError', () => {
    it('should have correct name', () => {
      const error = new GameValidationError('Test error', 'field');
      expect(error.name).toBe('GameValidationError');
    });

    it('should store field name', () => {
      const error = new GameValidationError('Test error', 'title');
      expect(error.field).toBe('title');
    });

    it('should extend Error', () => {
      const error = new GameValidationError('Test error', 'field');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('validateGame edge cases', () => {
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

    it('should throw for null game data', () => {
      expect(() => validateGame(null)).toThrow(GameValidationError);
    });

    it('should throw for undefined game data', () => {
      expect(() => validateGame(undefined)).toThrow(GameValidationError);
    });

    it('should throw for non-object game data', () => {
      expect(() => validateGame('not an object')).toThrow(GameValidationError);
      expect(() => validateGame(123)).toThrow(GameValidationError);
    });

    it('should throw for invalid age recommendation', () => {
      const game = { ...validGame, ageRecommendation: '5+' };
      expect(() => validateGame(game)).toThrow(GameValidationError);
    });

    it('should throw for invalid first play complexity', () => {
      const game = { ...validGame, firstPlayComplexity: 'EXTREME' };
      expect(() => validateGame(game)).toThrow(GameValidationError);
    });

    it('should throw for non-array categories', () => {
      const game = { ...validGame, categories: 'Strategy' };
      expect(() => validateGame(game)).toThrow(GameValidationError);
    });

    it('should throw for non-array mechanics', () => {
      const game = { ...validGame, mechanics: 'Dice Rolling' };
      expect(() => validateGame(game)).toThrow(GameValidationError);
    });

    it('should throw for non-array awards', () => {
      const game = { ...validGame, awards: 'Spiel des Jahres' };
      expect(() => validateGame(game)).toThrow(GameValidationError);
    });

    it('should throw for invalid award in array', () => {
      const game = { ...validGame, awards: [{ name: '' }] };
      expect(() => validateGame(game)).toThrow(GameValidationError);
    });

    it('should throw for invalid image in array', () => {
      const game = { ...validGame, images: [{ id: '' }] };
      expect(() => validateGame(game)).toThrow(GameValidationError);
    });

    it('should throw for non-boolean archived', () => {
      const game = { ...validGame, archived: 'yes' };
      expect(() => validateGame(game)).toThrow(GameValidationError);
    });

    it('should validate game with multiple awards', () => {
      const game = {
        ...validGame,
        awards: [
          { name: 'Spiel des Jahres', year: 2020 },
          { name: 'Deutscher Spiele Preis', year: 2020 },
        ],
      };
      expect(() => validateGame(game)).not.toThrow();
    });

    it('should validate game with multiple images', () => {
      const game = {
        ...validGame,
        images: [
          { id: 'img1', source: 'publisher' },
          { id: 'img2', source: 'user', attribution: 'Photo by John' },
        ],
      };
      expect(() => validateGame(game)).not.toThrow();
    });

    it('should validate game with empty categories', () => {
      const game = { ...validGame, categories: [] };
      expect(() => validateGame(game)).not.toThrow();
    });

    it('should validate game with empty mechanics', () => {
      const game = { ...validGame, mechanics: [] };
      expect(() => validateGame(game)).not.toThrow();
    });
  });

  describe('createGame immutability', () => {
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

    it('should create immutable copies of awards', () => {
      const game = createGame(validGameData);
      
      validGameData.awards.push({ name: 'Another Award' });
      
      expect(game.awards).toHaveLength(1);
    });

    it('should create immutable copies of images', () => {
      const game = createGame(validGameData);
      
      validGameData.images.push({ id: 'another-img' });
      
      expect(game.images).toHaveLength(1);
    });

    it('should not modify original data', () => {
      const originalData = JSON.parse(JSON.stringify(validGameData));
      createGame(validGameData);
      
      expect(validGameData).toEqual(originalData);
    });
  });
});
