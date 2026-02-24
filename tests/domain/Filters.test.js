/**
 * Tests for Filter Contracts
 * 
 * As specified in specs/phase_5_4_filter_contracts.md
 */

import {
  createEmptyFilterSet,
  isValidPlayerCountFilter,
  isValidPlayDurationFilter,
  isValidComplexityFilter,
  isValidCategoryFilter,
  isValidMechanicFilter,
  isValidFilterSet,
  hasActiveFilters,
  createPlayerCountFilter,
  createPlayDurationFilter,
  createComplexityFilter,
  createCategoryFilter,
  createMechanicFilter,
} from '../../src/domain/Filters';
import { PlayDuration, FirstPlayComplexity } from '../../src/domain/Game';

describe('Filter Contracts', () => {
  describe('createEmptyFilterSet', () => {
    it('should create an empty filter set with all null values', () => {
      const filterSet = createEmptyFilterSet();

      expect(filterSet.playerCount).toBeNull();
      expect(filterSet.playDuration).toBeNull();
      expect(filterSet.firstPlayComplexity).toBeNull();
      expect(filterSet.categories).toBeNull();
      expect(filterSet.mechanics).toBeNull();
      expect(filterSet.hasAwards).toBeNull();
      expect(filterSet.favoriteOnly).toBeNull();
    });

    it('should return a new object each time', () => {
      const filterSet1 = createEmptyFilterSet();
      const filterSet2 = createEmptyFilterSet();

      expect(filterSet1).not.toBe(filterSet2);
    });
  });

  describe('isValidPlayerCountFilter', () => {
    it('should return true for valid player count filters', () => {
      expect(isValidPlayerCountFilter({ minPlayers: 1, maxPlayers: 4 })).toBe(true);
      expect(isValidPlayerCountFilter({ minPlayers: 2, maxPlayers: 2 })).toBe(true);
      expect(isValidPlayerCountFilter({ minPlayers: 3, maxPlayers: 6 })).toBe(true);
    });

    it('should return false for invalid player count filters', () => {
      expect(isValidPlayerCountFilter(null)).toBe(false);
      expect(isValidPlayerCountFilter({})).toBe(false);
      expect(isValidPlayerCountFilter({ minPlayers: 0, maxPlayers: 4 })).toBe(false);
      expect(isValidPlayerCountFilter({ minPlayers: 4, maxPlayers: 2 })).toBe(false);
      expect(isValidPlayerCountFilter({ minPlayers: '2', maxPlayers: 4 })).toBe(false);
      expect(isValidPlayerCountFilter({ minPlayers: 2 })).toBe(false);
    });
  });

  describe('isValidPlayDurationFilter', () => {
    it('should return true for valid play duration filters', () => {
      expect(isValidPlayDurationFilter({ values: [PlayDuration.SHORT] })).toBe(true);
      expect(isValidPlayDurationFilter({ values: [PlayDuration.SHORT, PlayDuration.LONG] })).toBe(true);
      expect(isValidPlayDurationFilter({ values: Object.values(PlayDuration) })).toBe(true);
    });

    it('should return false for invalid play duration filters', () => {
      expect(isValidPlayDurationFilter(null)).toBe(false);
      expect(isValidPlayDurationFilter({})).toBe(false);
      expect(isValidPlayDurationFilter({ values: [] })).toBe(false);
      expect(isValidPlayDurationFilter({ values: ['INVALID'] })).toBe(false);
      expect(isValidPlayDurationFilter({ values: [PlayDuration.SHORT, 'INVALID'] })).toBe(false);
    });
  });

  describe('isValidComplexityFilter', () => {
    it('should return true for valid complexity filters', () => {
      expect(isValidComplexityFilter({ values: [FirstPlayComplexity.LOW] })).toBe(true);
      expect(isValidComplexityFilter({ values: [FirstPlayComplexity.LOW, FirstPlayComplexity.HIGH] })).toBe(true);
      expect(isValidComplexityFilter({ values: Object.values(FirstPlayComplexity) })).toBe(true);
    });

    it('should return false for invalid complexity filters', () => {
      expect(isValidComplexityFilter(null)).toBe(false);
      expect(isValidComplexityFilter({})).toBe(false);
      expect(isValidComplexityFilter({ values: [] })).toBe(false);
      expect(isValidComplexityFilter({ values: ['INVALID'] })).toBe(false);
    });
  });

  describe('isValidCategoryFilter', () => {
    it('should return true for valid category filters', () => {
      expect(isValidCategoryFilter({ values: ['Strategy'] })).toBe(true);
      expect(isValidCategoryFilter({ values: ['Strategy', 'Family'] })).toBe(true);
    });

    it('should return false for invalid category filters', () => {
      expect(isValidCategoryFilter(null)).toBe(false);
      expect(isValidCategoryFilter({})).toBe(false);
      expect(isValidCategoryFilter({ values: [] })).toBe(false);
      expect(isValidCategoryFilter({ values: [''] })).toBe(false);
      expect(isValidCategoryFilter({ values: [123] })).toBe(false);
    });
  });

  describe('isValidMechanicFilter', () => {
    it('should return true for valid mechanic filters', () => {
      expect(isValidMechanicFilter({ values: ['Dice Rolling'] })).toBe(true);
      expect(isValidMechanicFilter({ values: ['Dice Rolling', 'Worker Placement'] })).toBe(true);
    });

    it('should return false for invalid mechanic filters', () => {
      expect(isValidMechanicFilter(null)).toBe(false);
      expect(isValidMechanicFilter({})).toBe(false);
      expect(isValidMechanicFilter({ values: [] })).toBe(false);
      expect(isValidMechanicFilter({ values: [''] })).toBe(false);
    });
  });

  describe('isValidFilterSet', () => {
    it('should return true for empty filter set', () => {
      expect(isValidFilterSet(createEmptyFilterSet())).toBe(true);
    });

    it('should return true for filter set with valid filters', () => {
      const filterSet = {
        playerCount: { minPlayers: 2, maxPlayers: 4 },
        playDuration: { values: [PlayDuration.SHORT] },
        hasAwards: true,
      };
      expect(isValidFilterSet(filterSet)).toBe(true);
    });

    it('should return true for filter set with all filters', () => {
      const filterSet = {
        playerCount: { minPlayers: 1, maxPlayers: 6 },
        playDuration: { values: [PlayDuration.SHORT, PlayDuration.MEDIUM] },
        firstPlayComplexity: { values: [FirstPlayComplexity.LOW] },
        categories: { values: ['Strategy'] },
        mechanics: { values: ['Dice Rolling'] },
        hasAwards: true,
        favoriteOnly: false,
      };
      expect(isValidFilterSet(filterSet)).toBe(true);
    });

    it('should return false for null filter set', () => {
      expect(isValidFilterSet(null)).toBe(false);
    });

    it('should return false for non-object filter set', () => {
      expect(isValidFilterSet('filters')).toBe(false);
      expect(isValidFilterSet(123)).toBe(false);
    });

    it('should return false for filter set with invalid playerCount', () => {
      const filterSet = {
        playerCount: { minPlayers: 5, maxPlayers: 2 },
      };
      expect(isValidFilterSet(filterSet)).toBe(false);
    });

    it('should return false for filter set with invalid playDuration', () => {
      const filterSet = {
        playDuration: { values: [] },
      };
      expect(isValidFilterSet(filterSet)).toBe(false);
    });

    it('should return false for filter set with invalid hasAwards type', () => {
      const filterSet = {
        hasAwards: 'yes',
      };
      expect(isValidFilterSet(filterSet)).toBe(false);
    });

    it('should return false for filter set with invalid favoriteOnly type', () => {
      const filterSet = {
        favoriteOnly: 'yes',
      };
      expect(isValidFilterSet(filterSet)).toBe(false);
    });

    it('should accept null and undefined for boolean filters', () => {
      const filterSet = {
        hasAwards: null,
        favoriteOnly: undefined,
      };
      expect(isValidFilterSet(filterSet)).toBe(true);
    });
  });

  describe('hasActiveFilters', () => {
    it('should return false for empty filter set', () => {
      expect(hasActiveFilters(createEmptyFilterSet())).toBe(false);
    });

    it('should return false for null filter set', () => {
      expect(hasActiveFilters(null)).toBe(false);
    });

    it('should return true when playerCount is set', () => {
      const filterSet = { ...createEmptyFilterSet(), playerCount: { minPlayers: 2, maxPlayers: 4 } };
      expect(hasActiveFilters(filterSet)).toBe(true);
    });

    it('should return true when playDuration is set', () => {
      const filterSet = { ...createEmptyFilterSet(), playDuration: { values: [PlayDuration.SHORT] } };
      expect(hasActiveFilters(filterSet)).toBe(true);
    });

    it('should return true when hasAwards is true', () => {
      const filterSet = { ...createEmptyFilterSet(), hasAwards: true };
      expect(hasActiveFilters(filterSet)).toBe(true);
    });

    it('should return true when favoriteOnly is true', () => {
      const filterSet = { ...createEmptyFilterSet(), favoriteOnly: true };
      expect(hasActiveFilters(filterSet)).toBe(true);
    });

    it('should return true when categories is set', () => {
      const filterSet = { ...createEmptyFilterSet(), categories: { values: ['Strategy'] } };
      expect(hasActiveFilters(filterSet)).toBe(true);
    });

    it('should return true when mechanics is set', () => {
      const filterSet = { ...createEmptyFilterSet(), mechanics: { values: ['Dice Rolling'] } };
      expect(hasActiveFilters(filterSet)).toBe(true);
    });

    it('should return true when firstPlayComplexity is set', () => {
      const filterSet = { ...createEmptyFilterSet(), firstPlayComplexity: { values: [FirstPlayComplexity.LOW] } };
      expect(hasActiveFilters(filterSet)).toBe(true);
    });
  });

  describe('createPlayerCountFilter', () => {
    it('should create a valid player count filter', () => {
      const filter = createPlayerCountFilter(2, 4);
      expect(filter).toEqual({ minPlayers: 2, maxPlayers: 4 });
    });

    it('should create filter for single player count', () => {
      const filter = createPlayerCountFilter(3, 3);
      expect(filter).toEqual({ minPlayers: 3, maxPlayers: 3 });
    });
  });

  describe('createPlayDurationFilter', () => {
    it('should create a valid play duration filter', () => {
      const filter = createPlayDurationFilter([PlayDuration.SHORT]);
      expect(filter).toEqual({ values: [PlayDuration.SHORT] });
    });

    it('should create filter with multiple durations', () => {
      const filter = createPlayDurationFilter([PlayDuration.SHORT, PlayDuration.MEDIUM]);
      expect(filter).toEqual({ values: [PlayDuration.SHORT, PlayDuration.MEDIUM] });
    });

    it('should create a copy of the values array', () => {
      const values = [PlayDuration.SHORT];
      const filter = createPlayDurationFilter(values);
      values.push(PlayDuration.LONG);
      expect(filter.values).toHaveLength(1);
    });
  });

  describe('createComplexityFilter', () => {
    it('should create a valid complexity filter', () => {
      const filter = createComplexityFilter([FirstPlayComplexity.LOW]);
      expect(filter).toEqual({ values: [FirstPlayComplexity.LOW] });
    });

    it('should create filter with multiple complexities', () => {
      const filter = createComplexityFilter([FirstPlayComplexity.LOW, FirstPlayComplexity.HIGH]);
      expect(filter).toEqual({ values: [FirstPlayComplexity.LOW, FirstPlayComplexity.HIGH] });
    });
  });

  describe('createCategoryFilter', () => {
    it('should create a valid category filter', () => {
      const filter = createCategoryFilter(['Strategy']);
      expect(filter).toEqual({ values: ['Strategy'] });
    });

    it('should create filter with multiple categories', () => {
      const filter = createCategoryFilter(['Strategy', 'Family', 'Party']);
      expect(filter).toEqual({ values: ['Strategy', 'Family', 'Party'] });
    });

    it('should create a copy of the values array', () => {
      const values = ['Strategy'];
      const filter = createCategoryFilter(values);
      values.push('Family');
      expect(filter.values).toHaveLength(1);
    });
  });

  describe('createMechanicFilter', () => {
    it('should create a valid mechanic filter', () => {
      const filter = createMechanicFilter(['Dice Rolling']);
      expect(filter).toEqual({ values: ['Dice Rolling'] });
    });

    it('should create filter with multiple mechanics', () => {
      const filter = createMechanicFilter(['Dice Rolling', 'Worker Placement']);
      expect(filter).toEqual({ values: ['Dice Rolling', 'Worker Placement'] });
    });
  });
});