/**
 * Tests for FilteringEngine
 * 
 * As specified in specs/phase_4_1_filtering_engine.md
 */

import { applyFilters, createFilterSetFromSelections, FilterError } from '../../src/engines/FilteringEngine';
import { PlayDuration, FirstPlayComplexity } from '../../src/domain/Game';

describe('FilteringEngine', () => {
  // Sample games for testing
  const games = [
    {
      id: 'game-1',
      title: 'Short Simple Game',
      minPlayers: 2,
      maxPlayers: 4,
      playDuration: PlayDuration.SHORT,
      firstPlayComplexity: FirstPlayComplexity.LOW,
      categories: ['Family', 'Dice'],
      mechanics: ['Dice Rolling'],
      awards: [],
      favorite: false,
      archived: false,
    },
    {
      id: 'game-2',
      title: 'Medium Strategy Game',
      minPlayers: 3,
      maxPlayers: 5,
      playDuration: PlayDuration.MEDIUM,
      firstPlayComplexity: FirstPlayComplexity.MEDIUM,
      categories: ['Strategy'],
      mechanics: ['Worker Placement'],
      awards: [{ name: 'Spiel des Jahres', year: 2020 }],
      favorite: true,
      archived: false,
    },
    {
      id: 'game-3',
      title: 'Long Complex Game',
      minPlayers: 2,
      maxPlayers: 6,
      playDuration: PlayDuration.LONG,
      firstPlayComplexity: FirstPlayComplexity.HIGH,
      categories: ['Strategy', 'Wargame'],
      mechanics: ['Area Control', 'Deck Building'],
      awards: [],
      favorite: false,
      archived: false,
    },
  ];

  describe('applyFilters', () => {
    describe('with empty filter set', () => {
      it('should return all games when no filters applied', () => {
        const result = applyFilters(games, {});
        expect(result).toHaveLength(3);
      });

      it('should return copy of input array', () => {
        const result = applyFilters(games, {});
        expect(result).not.toBe(games);
      });
    });

    describe('with player count filter', () => {
      it('should filter by player count', () => {
        const filterSet = {
          playerCount: { minPlayers: 3, maxPlayers: 3 },
        };
        const result = applyFilters(games, filterSet);
        // game-1 (2-4), game-2 (3-5), and game-3 (2-6) can all play with 3 players
        expect(result).toHaveLength(3);
        expect(result.map(g => g.id)).toContain('game-1');
        expect(result.map(g => g.id)).toContain('game-2');
        expect(result.map(g => g.id)).toContain('game-3');
      });

      it('should filter for 6+ players', () => {
        const filterSet = {
          playerCount: { minPlayers: 6, maxPlayers: 99 },
        };
        const result = applyFilters(games, filterSet);
        // Only game-3 supports 6 players
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('game-3');
      });
    });

    describe('with play duration filter', () => {
      it('should filter by single duration (OR)', () => {
        const filterSet = {
          playDuration: { values: [PlayDuration.SHORT] },
        };
        const result = applyFilters(games, filterSet);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('game-1');
      });

      it('should filter by multiple durations (OR)', () => {
        const filterSet = {
          playDuration: { values: [PlayDuration.SHORT, PlayDuration.LONG] },
        };
        const result = applyFilters(games, filterSet);
        expect(result).toHaveLength(2);
        expect(result.map(g => g.id)).toContain('game-1');
        expect(result.map(g => g.id)).toContain('game-3');
      });
    });

    describe('with complexity filter', () => {
      it('should filter by complexity', () => {
        const filterSet = {
          firstPlayComplexity: { values: [FirstPlayComplexity.LOW] },
        };
        const result = applyFilters(games, filterSet);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('game-1');
      });
    });

    describe('with category filter', () => {
      it('should filter by category (OR)', () => {
        const filterSet = {
          categories: { values: ['Strategy'] },
        };
        const result = applyFilters(games, filterSet);
        expect(result).toHaveLength(2);
        expect(result.map(g => g.id)).toContain('game-2');
        expect(result.map(g => g.id)).toContain('game-3');
      });
    });

    describe('with mechanic filter', () => {
      it('should filter by mechanic (OR)', () => {
        const filterSet = {
          mechanics: { values: ['Dice Rolling', 'Area Control'] },
        };
        const result = applyFilters(games, filterSet);
        expect(result).toHaveLength(2);
      });
    });

    describe('with hasAwards filter', () => {
      it('should filter games with awards', () => {
        const filterSet = { hasAwards: true };
        const result = applyFilters(games, filterSet);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('game-2');
      });
    });

    describe('with favoriteOnly filter', () => {
      it('should filter favorite games', () => {
        const filterSet = { favoriteOnly: true };
        const result = applyFilters(games, filterSet);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('game-2');
      });
    });

    describe('with combined filters (AND)', () => {
      it('should combine filters with AND logic', () => {
        const filterSet = {
          playDuration: { values: [PlayDuration.MEDIUM, PlayDuration.LONG] },
          favoriteOnly: true,
        };
        const result = applyFilters(games, filterSet);
        // Only game-2 is both medium/long duration AND favorite
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('game-2');
      });

      it('should return empty when no game matches all filters', () => {
        const filterSet = {
          playDuration: { values: [PlayDuration.SHORT] },
          hasAwards: true,
        };
        const result = applyFilters(games, filterSet);
        expect(result).toHaveLength(0);
      });
    });

    describe('error handling', () => {
      it('should throw FilterError for non-array games', () => {
        expect(() => applyFilters(null, {})).toThrow(FilterError);
      });

      it('should throw FilterError for invalid filter set', () => {
        const invalidFilterSet = {
          playDuration: { values: [] }, // Empty values array
        };
        expect(() => applyFilters(games, invalidFilterSet)).toThrow(FilterError);
      });
    });

    describe('invariants', () => {
      it('should not mutate input array', () => {
        const original = [...games];
        applyFilters(games, { playDuration: { values: [PlayDuration.SHORT] } });
        expect(games).toEqual(original);
      });

      it('should preserve order of input', () => {
        const filterSet = { playDuration: { values: [PlayDuration.SHORT, PlayDuration.LONG] } };
        const result = applyFilters(games, filterSet);
        // game-1 comes before game-3 in original
        expect(result[0].id).toBe('game-1');
        expect(result[1].id).toBe('game-3');
      });
    });
  });

  describe('createFilterSetFromSelections', () => {
    it('should create filter set from UI selections', () => {
      const selections = {
        playerCount: { min: 2, max: 4 },
        playDuration: [PlayDuration.SHORT],
        hasAwards: true,
      };
      
      const filterSet = createFilterSetFromSelections(selections);
      
      expect(filterSet.playerCount).toEqual({ minPlayers: 2, maxPlayers: 4 });
      expect(filterSet.playDuration).toEqual({ values: [PlayDuration.SHORT] });
      expect(filterSet.hasAwards).toBe(true);
      expect(filterSet.favoriteOnly).toBeUndefined();
    });

    it('should handle empty selections', () => {
      const filterSet = createFilterSetFromSelections({});
      expect(filterSet).toEqual({});
    });

    it('should handle all filter types', () => {
      const selections = {
        playerCount: { min: 1, max: 6 },
        playDuration: [PlayDuration.SHORT, PlayDuration.MEDIUM],
        firstPlayComplexity: [FirstPlayComplexity.LOW],
        categories: ['Strategy', 'Family'],
        mechanics: ['Dice Rolling'],
        hasAwards: false,
        favoriteOnly: true,
      };
      
      const filterSet = createFilterSetFromSelections(selections);
      
      expect(filterSet.playerCount).toEqual({ minPlayers: 1, maxPlayers: 6 });
      expect(filterSet.playDuration.values).toHaveLength(2);
      expect(filterSet.firstPlayComplexity.values).toHaveLength(1);
      expect(filterSet.categories.values).toHaveLength(2);
      expect(filterSet.mechanics.values).toHaveLength(1);
      expect(filterSet.hasAwards).toBe(false);
      expect(filterSet.favoriteOnly).toBe(true);
    });
  });

  describe('games with missing data', () => {
    const gamesWithMissing = [
      {
        id: 'complete',
        title: 'Complete Game',
        minPlayers: 2,
        maxPlayers: 4,
        playDuration: PlayDuration.SHORT,
        firstPlayComplexity: FirstPlayComplexity.LOW,
        categories: ['Family'],
        mechanics: ['Dice Rolling'],
        awards: [{ name: 'Award' }],
        favorite: true,
      },
      {
        id: 'no-duration',
        title: 'No Duration',
        minPlayers: 2,
        maxPlayers: 4,
        playDuration: null,
        firstPlayComplexity: FirstPlayComplexity.LOW,
        categories: ['Family'],
        mechanics: [],
        awards: [],
        favorite: false,
      },
      {
        id: 'no-complexity',
        title: 'No Complexity',
        minPlayers: 2,
        maxPlayers: 4,
        playDuration: PlayDuration.SHORT,
        firstPlayComplexity: null,
        categories: [],
        mechanics: ['Dice Rolling'],
        awards: [],
        favorite: false,
      },
      {
        id: 'no-categories',
        title: 'No Categories',
        minPlayers: 2,
        maxPlayers: 4,
        playDuration: PlayDuration.MEDIUM,
        firstPlayComplexity: FirstPlayComplexity.MEDIUM,
        categories: null,
        mechanics: null,
        awards: [],
        favorite: false,
      },
    ];

    it('should handle games with null playDuration', () => {
      const filterSet = {
        playDuration: { values: [PlayDuration.SHORT] },
      };
      const result = applyFilters(gamesWithMissing, filterSet);
      
      // Only 'complete' and 'no-complexity' have SHORT duration
      expect(result).toHaveLength(2);
      expect(result.map(g => g.id)).toContain('complete');
      expect(result.map(g => g.id)).toContain('no-complexity');
    });

    it('should handle games with null complexity', () => {
      const filterSet = {
        firstPlayComplexity: { values: [FirstPlayComplexity.LOW] },
      };
      const result = applyFilters(gamesWithMissing, filterSet);
      
      // 'complete' and 'no-duration' have LOW complexity
      expect(result).toHaveLength(2);
    });

    it('should handle games with null categories', () => {
      const filterSet = {
        categories: { values: ['Family'] },
      };
      const result = applyFilters(gamesWithMissing, filterSet);
      
      // 'complete' and 'no-duration' have Family category
      expect(result).toHaveLength(2);
    });

    it('should handle games with null mechanics', () => {
      const filterSet = {
        mechanics: { values: ['Dice Rolling'] },
      };
      const result = applyFilters(gamesWithMissing, filterSet);
      
      // 'complete', 'no-complexity' have Dice Rolling
      expect(result).toHaveLength(2);
    });
  });

  describe('complex filter combinations', () => {
    it('should handle three combined filters', () => {
      const filterSet = {
        playerCount: { minPlayers: 2, maxPlayers: 4 },
        playDuration: { values: [PlayDuration.SHORT, PlayDuration.MEDIUM] },
        firstPlayComplexity: { values: [FirstPlayComplexity.LOW, FirstPlayComplexity.MEDIUM] },
      };
      const result = applyFilters(games, filterSet);
      
      // game-1: SHORT, LOW - matches
      // game-2: MEDIUM, MEDIUM - matches
      // game-3: LONG, HIGH - doesn't match
      expect(result).toHaveLength(2);
      expect(result.map(g => g.id)).toContain('game-1');
      expect(result.map(g => g.id)).toContain('game-2');
    });

    it('should handle all filter types combined', () => {
      const filterSet = {
        playerCount: { minPlayers: 2, maxPlayers: 5 },
        playDuration: { values: [PlayDuration.MEDIUM] },
        firstPlayComplexity: { values: [FirstPlayComplexity.MEDIUM] },
        categories: { values: ['Strategy'] },
        mechanics: { values: ['Worker Placement'] },
        hasAwards: true,
        favoriteOnly: true,
      };
      const result = applyFilters(games, filterSet);
      
      // Only game-2 matches all criteria
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('game-2');
    });
  });

  describe('FilterError', () => {
    it('should have correct name', () => {
      const error = new FilterError('Test error', 'testFilter');
      expect(error.name).toBe('FilterError');
    });

    it('should store filter name', () => {
      const error = new FilterError('Test error', 'playerCount');
      expect(error.filter).toBe('playerCount');
    });

    it('should extend Error', () => {
      const error = new FilterError('Test error', 'filter');
      expect(error).toBeInstanceOf(Error);
    });
  });
});
