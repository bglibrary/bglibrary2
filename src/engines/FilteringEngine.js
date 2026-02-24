/**
 * FilteringEngine
 * 
 * Applies deterministic filtering rules to a list of games.
 * As specified in specs/phase_4_1_filtering_engine.md
 */

import { isValidFilterSet } from '../domain/Filters';

/**
 * Filter error class
 */
export class FilterError extends Error {
  constructor(message, filter) {
    super(message);
    this.name = 'FilterError';
    this.filter = filter;
  }
}

/**
 * Checks if a game matches a player count filter
 * @param {object} game 
 * @param {object} filter - { minPlayers, maxPlayers }
 * @returns {boolean}
 */
function matchesPlayerCount(game, filter) {
  // Game's player range must overlap with filter's player range
  // A game matches if it can accommodate at least one player count in the filter range
  return (
    game.maxPlayers >= filter.minPlayers &&
    game.minPlayers <= filter.maxPlayers
  );
}

/**
 * Checks if a game matches a play duration filter
 * @param {object} game 
 * @param {object} filter - { values: PlayDuration[] }
 * @returns {boolean}
 */
function matchesPlayDuration(game, filter) {
  return filter.values.includes(game.playDuration);
}

/**
 * Checks if a game matches a complexity filter
 * @param {object} game 
 * @param {object} filter - { values: FirstPlayComplexity[] }
 * @returns {boolean}
 */
function matchesComplexity(game, filter) {
  return filter.values.includes(game.firstPlayComplexity);
}

/**
 * Checks if a game matches a category filter
 * @param {object} game 
 * @param {object} filter - { values: string[] }
 * @returns {boolean}
 */
function matchesCategory(game, filter) {
  // Game must have at least one of the selected categories (OR)
  if (!game.categories || !Array.isArray(game.categories)) {
    return false;
  }
  return filter.values.some(cat => game.categories.includes(cat));
}

/**
 * Checks if a game matches a mechanic filter
 * @param {object} game 
 * @param {object} filter - { values: string[] }
 * @returns {boolean}
 */
function matchesMechanic(game, filter) {
  // Game must have at least one of the selected mechanics (OR)
  if (!game.mechanics || !Array.isArray(game.mechanics)) {
    return false;
  }
  return filter.values.some(mech => game.mechanics.includes(mech));
}

/**
 * Checks if a game matches the hasAwards filter
 * @param {object} game 
 * @param {boolean} hasAwards
 * @returns {boolean}
 */
function matchesHasAwards(game, hasAwards) {
  const gameHasAwards = game.awards && game.awards.length > 0;
  return hasAwards ? gameHasAwards : true;
}

/**
 * Checks if a game matches the favoriteOnly filter
 * @param {object} game 
 * @param {boolean} favoriteOnly
 * @returns {boolean}
 */
function matchesFavoriteOnly(game, favoriteOnly) {
  return favoriteOnly ? game.favorite === true : true;
}

/**
 * Applies all filters to a single game
 * @param {object} game 
 * @param {object} filterSet 
 * @returns {boolean}
 */
function matchesFilters(game, filterSet) {
  // Player count filter (AND with other filters)
  if (filterSet.playerCount && !matchesPlayerCount(game, filterSet.playerCount)) {
    return false;
  }

  // Play duration filter (AND with other filters)
  if (filterSet.playDuration && !matchesPlayDuration(game, filterSet.playDuration)) {
    return false;
  }

  // Complexity filter (AND with other filters)
  if (filterSet.firstPlayComplexity && !matchesComplexity(game, filterSet.firstPlayComplexity)) {
    return false;
  }

  // Category filter (AND with other filters)
  if (filterSet.categories && !matchesCategory(game, filterSet.categories)) {
    return false;
  }

  // Mechanic filter (AND with other filters)
  if (filterSet.mechanics && !matchesMechanic(game, filterSet.mechanics)) {
    return false;
  }

  // Has awards filter (AND with other filters)
  if (filterSet.hasAwards !== null && !matchesHasAwards(game, filterSet.hasAwards)) {
    return false;
  }

  // Favorite only filter (AND with other filters)
  if (filterSet.favoriteOnly !== null && !matchesFavoriteOnly(game, filterSet.favoriteOnly)) {
    return false;
  }

  return true;
}

/**
 * Applies filters to a list of games
 * @param {object[]} games - List of visible games
 * @param {object} filterSet - Filter set to apply
 * @returns {object[]} Filtered subset of games
 * @throws {FilterError} If filter set is invalid
 */
export function applyFilters(games, filterSet) {
  // Validate inputs
  if (!Array.isArray(games)) {
    console.log('[FilteringEngine]', 'applyFilters', { error: 'Games must be an array' });
    throw new FilterError('Games must be an array', 'games');
  }

  // Empty filter set means no filtering
  if (!filterSet || typeof filterSet !== 'object') {
    console.log('[FilteringEngine]', 'applyFilters', { inputCount: games.length, outputCount: games.length, filters: 'none' });
    return [...games];
  }

  // Validate filter set
  if (!isValidFilterSet(filterSet)) {
    console.log('[FilteringEngine]', 'applyFilters', { error: 'Invalid filter set' });
    throw new FilterError('Invalid filter set', 'filterSet');
  }

  // Apply filters
  const filtered = games.filter(game => matchesFilters(game, filterSet));

  console.log('[FilteringEngine]', 'applyFilters', { 
    inputCount: games.length, 
    outputCount: filtered.length, 
    filters: JSON.stringify(filterSet) 
  });

  return filtered;
}

/**
 * Creates a filter set from UI selections
 * @param {object} selections - Raw UI filter selections
 * @returns {object} Validated filter set
 */
export function createFilterSetFromSelections(selections) {
  const filterSet = {};

  if (selections.playerCount) {
    filterSet.playerCount = {
      minPlayers: selections.playerCount.min,
      maxPlayers: selections.playerCount.max,
    };
  }

  if (selections.playDuration && selections.playDuration.length > 0) {
    filterSet.playDuration = { values: [...selections.playDuration] };
  }

  if (selections.firstPlayComplexity && selections.firstPlayComplexity.length > 0) {
    filterSet.firstPlayComplexity = { values: [...selections.firstPlayComplexity] };
  }

  if (selections.categories && selections.categories.length > 0) {
    filterSet.categories = { values: [...selections.categories] };
  }

  if (selections.mechanics && selections.mechanics.length > 0) {
    filterSet.mechanics = { values: [...selections.mechanics] };
  }

  if (selections.hasAwards !== undefined && selections.hasAwards !== null) {
    filterSet.hasAwards = selections.hasAwards;
  }

  if (selections.favoriteOnly !== undefined && selections.favoriteOnly !== null) {
    filterSet.favoriteOnly = selections.favoriteOnly;
  }

  return filterSet;
}