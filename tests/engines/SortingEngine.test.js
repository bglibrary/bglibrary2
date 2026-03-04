/**
 * Tests for SortingEngine
 * 
 * As specified in specs/phase_4_2_sorting_engine.md
 */

import { applySorting, SortMode, SortError, getDefaultSortMode } from '../../src/engines/SortingEngine';
import { PlayDuration, FirstPlayComplexity } from '../../src/domain/Game';

describe('SortingEngine', () => {
  // Sample games for testing
  const games = [
    {
      id: 'game-1',
      title: 'Alpha Game',
      playDuration: PlayDuration.SHORT,
      firstPlayComplexity: FirstPlayComplexity.LOW,
    },
    {
      id: 'game-2',
      title: 'Beta Game',
      playDuration: PlayDuration.LONG,
      firstPlayComplexity: FirstPlayComplexity.HIGH,
    },
    {
      id: 'game-3',
      title: 'Gamma Game',
      playDuration: PlayDuration.MEDIUM,
      firstPlayComplexity: FirstPlayComplexity.MEDIUM,
    },
    {
      id: 'game-4',
      title: 'Delta Game',
      playDuration: PlayDuration.SHORT,
      firstPlayComplexity: FirstPlayComplexity.LOW,
    },
  ];

  describe('applySorting', () => {
    describe('with no sort mode', () => {
      it('should return copy of input array when no sort mode', () => {
        const result = applySorting(games, null);
        expect(result).not.toBe(games);
        expect(result).toEqual(games);
      });
    });

    describe('by play duration', () => {
      it('should sort by play duration ascending', () => {
        const result = applySorting(games, SortMode.PLAY_DURATION_ASC);
        expect(result[0].playDuration).toBe(PlayDuration.SHORT);
        expect(result[result.length - 1].playDuration).toBe(PlayDuration.LONG);
      });

      it('should sort by play duration descending', () => {
        const result = applySorting(games, SortMode.PLAY_DURATION_DESC);
        expect(result[0].playDuration).toBe(PlayDuration.LONG);
        expect(result[result.length - 1].playDuration).toBe(PlayDuration.SHORT);
      });
    });

    describe('by complexity', () => {
      it('should sort by complexity ascending', () => {
        const result = applySorting(games, SortMode.FIRST_PLAY_COMPLEXITY_ASC);
        expect(result[0].firstPlayComplexity).toBe(FirstPlayComplexity.LOW);
        expect(result[result.length - 1].firstPlayComplexity).toBe(FirstPlayComplexity.HIGH);
      });

      it('should sort by complexity descending', () => {
        const result = applySorting(games, SortMode.FIRST_PLAY_COMPLEXITY_DESC);
        expect(result[0].firstPlayComplexity).toBe(FirstPlayComplexity.HIGH);
        expect(result[result.length - 1].firstPlayComplexity).toBe(FirstPlayComplexity.LOW);
      });
    });

    describe('by title', () => {
      it('should sort by title ascending', () => {
        const result = applySorting(games, SortMode.TITLE_ASC);
        expect(result[0].title).toBe('Alpha Game');
        expect(result[1].title).toBe('Beta Game');
        expect(result[2].title).toBe('Delta Game');
        expect(result[3].title).toBe('Gamma Game');
      });

      it('should sort by title descending', () => {
        const result = applySorting(games, SortMode.TITLE_DESC);
        expect(result[0].title).toBe('Gamma Game');
        expect(result[3].title).toBe('Alpha Game');
      });
    });

    describe('stability', () => {
      it('should maintain stable sort for equal values', () => {
        // game-1 and game-4 both have SHORT duration and LOW complexity
        const result = applySorting(games, SortMode.PLAY_DURATION_ASC);
        
        // Find positions of game-1 and game-4
        const pos1 = result.findIndex(g => g.id === 'game-1');
        const pos4 = result.findIndex(g => g.id === 'game-4');
        
        // game-1 should come before game-4 (original order preserved)
        expect(pos1).toBeLessThan(pos4);
      });
    });

    describe('with missing values', () => {
      const gamesWithMissing = [
        { id: 'complete', title: 'Complete', playDuration: PlayDuration.SHORT, firstPlayComplexity: FirstPlayComplexity.LOW },
        { id: 'missing-duration', title: 'Missing Duration', playDuration: null, firstPlayComplexity: FirstPlayComplexity.LOW },
        { id: 'missing-complexity', title: 'Missing Complexity', playDuration: PlayDuration.SHORT, firstPlayComplexity: null },
      ];

      it('should place games with missing duration at the end', () => {
        const result = applySorting(gamesWithMissing, SortMode.PLAY_DURATION_ASC);
        expect(result[result.length - 1].id).toBe('missing-duration');
      });

      it('should place games with missing complexity at the end', () => {
        const result = applySorting(gamesWithMissing, SortMode.FIRST_PLAY_COMPLEXITY_ASC);
        expect(result[result.length - 1].id).toBe('missing-complexity');
      });
    });

    describe('error handling', () => {
      it('should throw SortError for non-array games', () => {
        expect(() => applySorting(null, SortMode.TITLE_ASC)).toThrow(SortError);
      });

      it('should throw SortError for unsupported sort mode', () => {
        expect(() => applySorting(games, 'INVALID_MODE')).toThrow(SortError);
      });
    });

    describe('invariants', () => {
      it('should not mutate input array', () => {
        const original = [...games];
        applySorting(games, SortMode.TITLE_DESC);
        expect(games).toEqual(original);
      });

      it('should return same number of games', () => {
        const result = applySorting(games, SortMode.TITLE_ASC);
        expect(result).toHaveLength(games.length);
      });

      it('should contain all original games', () => {
        const result = applySorting(games, SortMode.PLAY_DURATION_DESC);
        const originalIds = games.map(g => g.id).sort();
        const resultIds = result.map(g => g.id).sort();
        expect(resultIds).toEqual(originalIds);
      });
    });
  });

  describe('getDefaultSortMode', () => {
    it('should return RANDOM as default', () => {
      expect(getDefaultSortMode()).toBe(SortMode.RANDOM);
    });
  });

  describe('SortMode enum', () => {
    it('should have all required sort modes', () => {
      expect(SortMode.RANDOM).toBe('RANDOM');
      expect(SortMode.PLAY_DURATION_ASC).toBe('PLAY_DURATION_ASC');
      expect(SortMode.PLAY_DURATION_DESC).toBe('PLAY_DURATION_DESC');
      expect(SortMode.FIRST_PLAY_COMPLEXITY_ASC).toBe('FIRST_PLAY_COMPLEXITY_ASC');
      expect(SortMode.FIRST_PLAY_COMPLEXITY_DESC).toBe('FIRST_PLAY_COMPLEXITY_DESC');
      expect(SortMode.TITLE_ASC).toBe('TITLE_ASC');
      expect(SortMode.TITLE_DESC).toBe('TITLE_DESC');
    });
  });

  describe('by random', () => {
    it('should shuffle games in random order', () => {
      const result = applySorting(games, SortMode.RANDOM);
      
      // Result should contain all games
      expect(result).toHaveLength(games.length);
      
      // All original games should be present
      const originalIds = games.map(g => g.id).sort();
      const resultIds = result.map(g => g.id).sort();
      expect(resultIds).toEqual(originalIds);
    });

    it('should not mutate input array', () => {
      const original = [...games];
      applySorting(games, SortMode.RANDOM);
      expect(games).toEqual(original);
    });

    it('should produce different orders on multiple calls (probabilistic)', () => {
      // Run multiple sorts and check that at least some differ
      // This test may rarely fail due to randomness, but probability is very low
      const results = new Set();
      for (let i = 0; i < 10; i++) {
        const result = applySorting(games, SortMode.RANDOM);
        results.add(result.map(g => g.id).join(','));
      }
      
      // With 10 shuffles of 4 items, we should get at least 2 different orders
      // (probability of all same is extremely low: (1/24)^9)
      expect(results.size).toBeGreaterThan(1);
    });
  });
});
