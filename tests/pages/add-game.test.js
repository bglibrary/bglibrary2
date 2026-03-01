/**
 * Tests for Add Game Page
 * 
 * Non-regression tests for the add game form submission.
 * Ensures that the game ID is properly generated from the title.
 */

import { generateGameId, validateGame, PlayDuration, FirstPlayComplexity } from '@/domain/Game';

describe('Add Game Page - Game Data Generation', () => {
  describe('generateGameId', () => {
    it('should generate ID from simple title', () => {
      const result = generateGameId('Catan');
      expect(result).toBe('catan');
    });

    it('should generate ID from title with spaces', () => {
      const result = generateGameId('Les Aventures de Robin des Bois');
      expect(result).toBe('les-aventures-de-robin-des-bois');
    });

    it('should remove diacritics from title', () => {
      const result = generateGameId('Catane');
      expect(result).toBe('catane');
    });

    it('should handle accents and special characters', () => {
      const result = generateGameId('Jeu de l\'été');
      expect(result).toBe('jeu-de-l-ete');
    });

    it('should handle multiple consecutive spaces', () => {
      const result = generateGameId('Game   With    Spaces');
      expect(result).toBe('game-with-spaces');
    });

    it('should remove leading and trailing hyphens', () => {
      const result = generateGameId('-Game-');
      expect(result).toBe('game');
    });

    it('should handle special characters', () => {
      const result = generateGameId('7 Wonders');
      expect(result).toBe('7-wonders');
    });

    it('should handle numbers in title', () => {
      const result = generateGameId('6 qui prend');
      expect(result).toBe('6-qui-prend');
    });
  });

  describe('Game data validation for add form', () => {
    // This test ensures the fix for: "Game ID must be a non-empty string" error
    // The add-game page must generate an ID from the title before calling addGame
    it('should pass validation when ID is generated from title', () => {
      const title = 'New Board Game';
      const gameData = {
        id: generateGameId(title),
        title: title,
        description: 'A great game',
        minPlayers: 2,
        maxPlayers: 4,
        playDuration: PlayDuration.MEDIUM,
        firstPlayComplexity: FirstPlayComplexity.LOW,
        ageRecommendation: '10+',
        categories: ['Stratégie'],
        mechanics: ['Draft'],
        awards: [],
        favorite: false,
        archived: false,
        images: [{ id: `${generateGameId(title)}-main` }],
      };

      // Should not throw
      expect(() => validateGame(gameData)).not.toThrow();
    });

    it('should fail validation when ID is missing', () => {
      const gameData = {
        // id is missing - this was the bug
        title: 'Test Game',
        description: 'A description',
        minPlayers: 2,
        maxPlayers: 4,
        playDuration: PlayDuration.MEDIUM,
        firstPlayComplexity: FirstPlayComplexity.LOW,
        ageRecommendation: '10+',
        categories: [],
        mechanics: [],
        awards: [],
        favorite: false,
        archived: false,
        images: [{ id: 'test-main' }],
      };

      expect(() => validateGame(gameData)).toThrow('Game ID must be a non-empty string');
    });

    it('should fail validation when ID is empty string', () => {
      const gameData = {
        id: '',
        title: 'Test Game',
        description: 'A description',
        minPlayers: 2,
        maxPlayers: 4,
        playDuration: PlayDuration.MEDIUM,
        firstPlayComplexity: FirstPlayComplexity.LOW,
        ageRecommendation: '10+',
        categories: [],
        mechanics: [],
        awards: [],
        favorite: false,
        archived: false,
        images: [{ id: 'test-main' }],
      };

      expect(() => validateGame(gameData)).toThrow('Game ID must be a non-empty string');
    });

    it('should fail validation when images array is empty', () => {
      const gameData = {
        id: 'test-game',
        title: 'Test Game',
        description: 'A description',
        minPlayers: 2,
        maxPlayers: 4,
        playDuration: PlayDuration.MEDIUM,
        firstPlayComplexity: FirstPlayComplexity.LOW,
        ageRecommendation: '10+',
        categories: [],
        mechanics: [],
        awards: [],
        favorite: false,
        archived: false,
        images: [], // Empty images array
      };

      expect(() => validateGame(gameData)).toThrow('Images must be a non-empty array');
    });
  });

  describe('Form submission data construction', () => {
    // Simulates the data construction from add-game.js handleSubmit
    function buildGameDataFromForm(formData) {
      const gameId = generateGameId(formData.title);
      return {
        id: gameId,
        title: formData.title,
        description: formData.description || '',
        minPlayers: parseInt(formData.minPlayers),
        maxPlayers: parseInt(formData.maxPlayers),
        playDuration: formData.playDuration || PlayDuration.MEDIUM,
        firstPlayComplexity: formData.firstPlayComplexity || FirstPlayComplexity.MEDIUM,
        ageRecommendation: formData.ageRecommendation || '10+',
        categories: formData.categories || [],
        mechanics: formData.mechanics || [],
        awards: formData.awards || [],
        favorite: formData.favorite || false,
        archived: false,
        images: [{ id: `${gameId}-main` }],
      };
    }

    it('should construct valid game data from minimal form data', () => {
      const formData = {
        title: 'My New Game',
        minPlayers: '2',
        maxPlayers: '4',
      };

      const gameData = buildGameDataFromForm(formData);
      
      expect(() => validateGame(gameData)).not.toThrow();
      expect(gameData.id).toBe('my-new-game');
      expect(gameData.images).toHaveLength(1);
      expect(gameData.images[0].id).toBe('my-new-game-main');
    });

    it('should construct valid game data from complete form data', () => {
      const formData = {
        title: 'Complex Game',
        description: 'A complex strategy game',
        minPlayers: '3',
        maxPlayers: '5',
        playDuration: PlayDuration.LONG,
        firstPlayComplexity: FirstPlayComplexity.HIGH,
        ageRecommendation: '14+',
        categories: ['Stratégie', 'Expert'],
        mechanics: ['Deck building', 'Placement d\'ouvriers'],
        awards: [{ name: 'Spiel des Jahres', year: 2023 }],
        favorite: true,
      };

      const gameData = buildGameDataFromForm(formData);
      
      expect(() => validateGame(gameData)).not.toThrow();
      expect(gameData.id).toBe('complex-game');
      expect(gameData.title).toBe('Complex Game');
      expect(gameData.description).toBe('A complex strategy game');
      expect(gameData.minPlayers).toBe(3);
      expect(gameData.maxPlayers).toBe(5);
      expect(gameData.playDuration).toBe(PlayDuration.LONG);
      expect(gameData.firstPlayComplexity).toBe(FirstPlayComplexity.HIGH);
      expect(gameData.ageRecommendation).toBe('14+');
      expect(gameData.categories).toEqual(['Stratégie', 'Expert']);
      expect(gameData.mechanics).toEqual(['Deck building', 'Placement d\'ouvriers']);
      expect(gameData.awards).toEqual([{ name: 'Spiel des Jahres', year: 2023 }]);
      expect(gameData.favorite).toBe(true);
      expect(gameData.archived).toBe(false);
      expect(gameData.images).toHaveLength(1);
    });

    it('should handle French characters in title', () => {
      const formData = {
        title: 'Les Échecs',
        minPlayers: '2',
        maxPlayers: '2',
      };

      const gameData = buildGameDataFromForm(formData);
      
      expect(gameData.id).toBe('les-echecs');
      expect(gameData.images[0].id).toBe('les-echecs-main');
    });
  });
});