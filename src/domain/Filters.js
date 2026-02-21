/**
 * Filter Contracts
 * 
 * Domain-driven filter definitions as specified in specs/phase_5_4_filter_contracts.md
 * Filters are UI-agnostic and used by the FilteringEngine.
 */

import { PlayDuration, FirstPlayComplexity } from './Game';

/**
 * Action types for filter changes
 */
export const FilterActionType = {
  SET_PLAYER_COUNT: 'SET_PLAYER_COUNT',
  SET_PLAY_DURATION: 'SET_PLAY_DURATION',
  SET_COMPLEXITY: 'SET_COMPLEXITY',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_MECHANICS: 'SET_MECHANICS',
  SET_HAS_AWARDS: 'SET_HAS_AWARDS',
  SET_FAVORITE_ONLY: 'SET_FAVORITE_ONLY',
  CLEAR_ALL: 'CLEAR_ALL',
};

/**
 * Creates an empty filter set (no constraints)
 * @returns {object}
 */
export function createEmptyFilterSet() {
  return {
    playerCount: null,
    playDuration: null,
    firstPlayComplexity: null,
    categories: null,
    mechanics: null,
    hasAwards: null,
    favoriteOnly: null,
  };
}

/**
 * Validates a PlayerCountFilter
 * @param {object} filter 
 * @returns {boolean}
 */
export function isValidPlayerCountFilter(filter) {
  if (!filter) return false;
  return (
    typeof filter.minPlayers === 'number' &&
    typeof filter.maxPlayers === 'number' &&
    filter.minPlayers >= 1 &&
    filter.maxPlayers >= filter.minPlayers
  );
}

/**
 * Validates a PlayDurationFilter
 * @param {object} filter 
 * @returns {boolean}
 */
export function isValidPlayDurationFilter(filter) {
  if (!filter) return false;
  if (!Array.isArray(filter.values) || filter.values.length === 0) return false;
  return filter.values.every(v => Object.values(PlayDuration).includes(v));
}

/**
 * Validates a ComplexityFilter
 * @param {object} filter 
 * @returns {boolean}
 */
export function isValidComplexityFilter(filter) {
  if (!filter) return false;
  if (!Array.isArray(filter.values) || filter.values.length === 0) return false;
  return filter.values.every(v => Object.values(FirstPlayComplexity).includes(v));
}

/**
 * Validates a CategoryFilter
 * @param {object} filter 
 * @returns {boolean}
 */
export function isValidCategoryFilter(filter) {
  if (!filter) return false;
  if (!Array.isArray(filter.values) || filter.values.length === 0) return false;
  return filter.values.every(v => typeof v === 'string' && v.length > 0);
}

/**
 * Validates a MechanicFilter
 * @param {object} filter 
 * @returns {boolean}
 */
export function isValidMechanicFilter(filter) {
  if (!filter) return false;
  if (!Array.isArray(filter.values) || filter.values.length === 0) return false;
  return filter.values.every(v => typeof v === 'string' && v.length > 0);
}

/**
 * Validates a complete FilterSet
 * @param {object} filterSet 
 * @returns {boolean}
 */
export function isValidFilterSet(filterSet) {
  if (!filterSet || typeof filterSet !== 'object') return false;

  // Validate each filter if present
  if (filterSet.playerCount && !isValidPlayerCountFilter(filterSet.playerCount)) {
    return false;
  }
  if (filterSet.playDuration && !isValidPlayDurationFilter(filterSet.playDuration)) {
    return false;
  }
  if (filterSet.firstPlayComplexity && !isValidComplexityFilter(filterSet.firstPlayComplexity)) {
    return false;
  }
  if (filterSet.categories && !isValidCategoryFilter(filterSet.categories)) {
    return false;
  }
  if (filterSet.mechanics && !isValidMechanicFilter(filterSet.mechanics)) {
    return false;
  }
  // Boolean filters: accept if undefined, null, or boolean
  if (filterSet.hasAwards !== undefined && filterSet.hasAwards !== null && typeof filterSet.hasAwards !== 'boolean') {
    return false;
  }
  if (filterSet.favoriteOnly !== undefined && filterSet.favoriteOnly !== null && typeof filterSet.favoriteOnly !== 'boolean') {
    return false;
  }

  return true;
}

/**
 * Checks if a filter set has any active filters
 * @param {object} filterSet 
 * @returns {boolean}
 */
export function hasActiveFilters(filterSet) {
  if (!filterSet) return false;
  
  return (
    filterSet.playerCount !== null ||
    filterSet.playDuration !== null ||
    filterSet.firstPlayComplexity !== null ||
    filterSet.categories !== null ||
    filterSet.mechanics !== null ||
    filterSet.hasAwards !== null ||
    filterSet.favoriteOnly !== null
  );
}

/**
 * Creates a PlayerCountFilter
 * @param {number} minPlayers 
 * @param {number} maxPlayers 
 * @returns {object}
 */
export function createPlayerCountFilter(minPlayers, maxPlayers) {
  return { minPlayers, maxPlayers };
}

/**
 * Creates a PlayDurationFilter
 * @param {string[]} values - Array of PlayDuration values
 * @returns {object}
 */
export function createPlayDurationFilter(values) {
  return { values: [...values] };
}

/**
 * Creates a ComplexityFilter
 * @param {string[]} values - Array of FirstPlayComplexity values
 * @returns {object}
 */
export function createComplexityFilter(values) {
  return { values: [...values] };
}

/**
 * Creates a CategoryFilter
 * @param {string[]} values - Array of category names
 * @returns {object}
 */
export function createCategoryFilter(values) {
  return { values: [...values] };
}

/**
 * Creates a MechanicFilter
 * @param {string[]} values - Array of mechanic names
 * @returns {object}
 */
export function createMechanicFilter(values) {
  return { values: [...values] };
}