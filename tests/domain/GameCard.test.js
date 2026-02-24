/**
 * Tests for GameCard Model
 * 
 * As specified in specs/phase_5_3_game_card_model.md
 */

import {
  formatPlayerCount,
  mapToGameCard,
  mapToGameCards,
} from '../../src/domain/GameCard';
import { PlayDuration } from '../../src/domain/Game';

describe('GameCard Model', () => {
  describe('formatPlayerCount', () => {
    it('should format single player count when min equals max', () => {
      expect(formatPlayerCount(2, 2)).toBe('2 joueurs');
      expect(formatPlayerCount(4, 4)).toBe('4 joueurs');
      expect(formatPlayerCount(1, 1)).toBe('1 joueurs');
    });

    it('should format player range when min differs from max', () => {
      expect(formatPlayerCount(2, 4)).toBe('2-4 joueurs');
      expect(formatPlayerCount(1, 6)).toBe('1-6 joueurs');
      expect(formatPlayerCount(3, 5)).toBe('3-5 joueurs');
    });

    it('should handle edge cases', () => {
      expect(formatPlayerCount(1, 99)).toBe('1-99 joueurs');
      expect(formatPlayerCount(10, 20)).toBe('10-20 joueurs');
    });
  });

  describe('mapToGameCard', () => {
    const createValidGame = (overrides = {}) => ({
      id: 'test-game',
      title: 'Test Game',
      minPlayers: 2,
      maxPlayers: 4,
      playDuration: PlayDuration.MEDIUM,
      awards: [],
      favorite: false,
      archived: false,
      images: [{ id: 'test-img' }],
      ...overrides,
    });

    it('should map a complete game to GameCard', () => {
      const game = createValidGame();
      const card = mapToGameCard(game);

      expect(card.id).toBe('test-game');
      expect(card.title).toBe('Test Game');
      expect(card.playerCount).toBe('2-4 joueurs');
      expect(card.playDuration).toBe(PlayDuration.MEDIUM);
      expect(card.hasAwards).toBe(false);
      expect(card.isFavorite).toBe(false);
      expect(card.isArchived).toBe(false);
    });

    it('should map game with awards correctly', () => {
      const game = createValidGame({
        awards: [{ name: 'Spiel des Jahres', year: 2020 }],
      });
      const card = mapToGameCard(game);

      expect(card.hasAwards).toBe(true);
    });

    it('should map game with multiple awards correctly', () => {
      const game = createValidGame({
        awards: [
          { name: 'Spiel des Jahres', year: 2020 },
          { name: 'Deutscher Spiele Preis', year: 2020 },
        ],
      });
      const card = mapToGameCard(game);

      expect(card.hasAwards).toBe(true);
    });

    it('should map favorite game correctly', () => {
      const game = createValidGame({ favorite: true });
      const card = mapToGameCard(game);

      expect(card.isFavorite).toBe(true);
    });

    it('should map archived game correctly', () => {
      const game = createValidGame({ archived: true });
      const card = mapToGameCard(game);

      expect(card.isArchived).toBe(true);
    });

    it('should include primary image reference', () => {
      const game = createValidGame({
        images: [
          { id: 'main-img', source: 'publisher' },
          { id: 'alt-img' },
        ],
      });
      const card = mapToGameCard(game);

      expect(card.primaryImage).toEqual({ id: 'main-img', source: 'publisher' });
    });

    it('should return null primaryImage when no images', () => {
      const game = createValidGame({ images: [] });
      const card = mapToGameCard(game);

      expect(card.primaryImage).toBeNull();
    });

    it('should return null primaryImage when images is undefined', () => {
      const game = createValidGame({ images: undefined });
      const card = mapToGameCard(game);

      expect(card.primaryImage).toBeNull();
    });

    it('should throw for null game', () => {
      expect(() => mapToGameCard(null)).toThrow('Cannot map null/undefined game to GameCard');
    });

    it('should throw for undefined game', () => {
      expect(() => mapToGameCard(undefined)).toThrow('Cannot map null/undefined game to GameCard');
    });

    it('should handle game with empty awards array', () => {
      const game = createValidGame({ awards: [] });
      const card = mapToGameCard(game);

      expect(card.hasAwards).toBe(false);
    });

    it('should handle game with undefined awards', () => {
      const game = createValidGame({ awards: undefined });
      const card = mapToGameCard(game);

      expect(card.hasAwards).toBe(false);
    });

    it('should handle single player game', () => {
      const game = createValidGame({ minPlayers: 1, maxPlayers: 1 });
      const card = mapToGameCard(game);

      expect(card.playerCount).toBe('1 joueurs');
    });

    it('should handle large player range', () => {
      const game = createValidGame({ minPlayers: 1, maxPlayers: 12 });
      const card = mapToGameCard(game);

      expect(card.playerCount).toBe('1-12 joueurs');
    });
  });

  describe('mapToGameCards', () => {
    it('should map empty array to empty array', () => {
      const cards = mapToGameCards([]);
      expect(cards).toEqual([]);
    });

    it('should map array of games to array of GameCards', () => {
      const games = [
        {
          id: 'game-1',
          title: 'Game One',
          minPlayers: 2,
          maxPlayers: 4,
          playDuration: PlayDuration.SHORT,
          awards: [],
          favorite: false,
          archived: false,
          images: [{ id: 'img-1' }],
        },
        {
          id: 'game-2',
          title: 'Game Two',
          minPlayers: 3,
          maxPlayers: 6,
          playDuration: PlayDuration.LONG,
          awards: [{ name: 'Award' }],
          favorite: true,
          archived: false,
          images: [{ id: 'img-2' }],
        },
      ];

      const cards = mapToGameCards(games);

      expect(cards).toHaveLength(2);
      expect(cards[0].id).toBe('game-1');
      expect(cards[0].title).toBe('Game One');
      expect(cards[0].hasAwards).toBe(false);
      expect(cards[1].id).toBe('game-2');
      expect(cards[1].title).toBe('Game Two');
      expect(cards[1].hasAwards).toBe(true);
      expect(cards[1].isFavorite).toBe(true);
    });

    it('should return empty array for null input', () => {
      const cards = mapToGameCards(null);
      expect(cards).toEqual([]);
    });

    it('should return empty array for undefined input', () => {
      const cards = mapToGameCards(undefined);
      expect(cards).toEqual([]);
    });

    it('should return empty array for non-array input', () => {
      const cards = mapToGameCards('not an array');
      expect(cards).toEqual([]);
    });

    it('should preserve order of games', () => {
      const games = [
        { id: 'first', title: 'First', minPlayers: 2, maxPlayers: 2, playDuration: PlayDuration.SHORT, awards: [], favorite: false, archived: false, images: [] },
        { id: 'second', title: 'Second', minPlayers: 2, maxPlayers: 2, playDuration: PlayDuration.SHORT, awards: [], favorite: false, archived: false, images: [] },
        { id: 'third', title: 'Third', minPlayers: 2, maxPlayers: 2, playDuration: PlayDuration.SHORT, awards: [], favorite: false, archived: false, images: [] },
      ];

      const cards = mapToGameCards(games);

      expect(cards[0].id).toBe('first');
      expect(cards[1].id).toBe('second');
      expect(cards[2].id).toBe('third');
    });
  });
});