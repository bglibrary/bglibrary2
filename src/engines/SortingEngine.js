/**
 * SortingEngine
 * 
 * Applies deterministic ordering rules to a list of games.
 * As specified in specs/phase_4_2_sorting_engine.md
 */

import { PlayDuration, FirstPlayComplexity } from '../domain/Game';

/**
 * Sort mode enum
 */
export const SortMode = {
  PLAY_DURATION_ASC: 'PLAY_DURATION_ASC',
  PLAY_DURATION_DESC: 'PLAY_DURATION_DESC',
  FIRST_PLAY_COMPLEXITY_ASC: 'FIRST_PLAY_COMPLEXITY_ASC',
  FIRST_PLAY_COMPLEXITY_DESC: 'FIRST_PLAY_COMPLEXITY_DESC',
  TITLE_ASC: 'TITLE_ASC',
  TITLE_DESC: 'TITLE_DESC',
};

/**
 * Sort error class
 */
export class SortError extends Error {
  constructor(message, sortMode) {
    super(message);
    this.name = 'SortError';
    this.sortMode = sortMode;
  }
}

/**
 * Numeric values for play duration sorting
 */
const PlayDurationOrder = {
  [PlayDuration.SHORT]: 1,
  [PlayDuration.MEDIUM]: 2,
  [PlayDuration.LONG]: 3,
};

/**
 * Numeric values for complexity sorting
 */
const ComplexityOrder = {
  [FirstPlayComplexity.LOW]: 1,
  [FirstPlayComplexity.MEDIUM]: 2,
  [FirstPlayComplexity.HIGH]: 3,
};

/**
 * Gets the sort value for play duration
 * @param {object} game 
 * @returns {number|null}
 */
function getPlayDurationValue(game) {
  if (!game.playDuration || !PlayDurationOrder[game.playDuration]) {
    return null;
  }
  return PlayDurationOrder[game.playDuration];
}

/**
 * Gets the sort value for complexity
 * @param {object} game 
 * @returns {number|null}
 */
function getComplexityValue(game) {
  if (!game.firstPlayComplexity || !ComplexityOrder[game.firstPlayComplexity]) {
    return null;
  }
  return ComplexityOrder[game.firstPlayComplexity];
}

/**
 * Gets the sort value for title
 * @param {object} game 
 * @returns {string}
 */
function getTitleValue(game) {
  return game.title ? game.title.toLowerCase() : '';
}

/**
 * Creates a stable sort comparator
 * @param {Function} compareFn - Primary comparison function
 * @param {object[]} originalArray - Original array for stable sorting
 * @returns {Function}
 */
function createStableComparator(compareFn, originalArray) {
  const indexMap = new Map();
  originalArray.forEach((item, index) => {
    indexMap.set(item, index);
  });

  return (a, b) => {
    const result = compareFn(a, b);
    if (result !== 0) return result;
    // Stable sort: preserve original order for equal items
    return indexMap.get(a) - indexMap.get(b);
  };
}

/**
 * Sorts games by play duration ascending
 * @param {object[]} games 
 * @returns {object[]}
 */
function sortByPlayDurationAsc(games) {
  const sorted = [...games];
  sorted.sort(createStableComparator((a, b) => {
    const aVal = getPlayDurationValue(a);
    const bVal = getPlayDurationValue(b);

    // Games with missing values go last
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;

    return aVal - bVal;
  }, games));

  return sorted;
}

/**
 * Sorts games by play duration descending
 * @param {object[]} games 
 * @returns {object[]}
 */
function sortByPlayDurationDesc(games) {
  const sorted = [...games];
  sorted.sort(createStableComparator((a, b) => {
    const aVal = getPlayDurationValue(a);
    const bVal = getPlayDurationValue(b);

    // Games with missing values go last
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;

    return bVal - aVal;
  }, games));

  return sorted;
}

/**
 * Sorts games by complexity ascending
 * @param {object[]} games 
 * @returns {object[]}
 */
function sortByComplexityAsc(games) {
  const sorted = [...games];
  sorted.sort(createStableComparator((a, b) => {
    const aVal = getComplexityValue(a);
    const bVal = getComplexityValue(b);

    // Games with missing values go last
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;

    return aVal - bVal;
  }, games));

  return sorted;
}

/**
 * Sorts games by complexity descending
 * @param {object[]} games 
 * @returns {object[]}
 */
function sortByComplexityDesc(games) {
  const sorted = [...games];
  sorted.sort(createStableComparator((a, b) => {
    const aVal = getComplexityValue(a);
    const bVal = getComplexityValue(b);

    // Games with missing values go last
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;

    return bVal - aVal;
  }, games));

  return sorted;
}

/**
 * Sorts games by title ascending
 * @param {object[]} games 
 * @returns {object[]}
 */
function sortByTitleAsc(games) {
  const sorted = [...games];
  sorted.sort(createStableComparator((a, b) => {
    const aVal = getTitleValue(a);
    const bVal = getTitleValue(b);
    return aVal.localeCompare(bVal, 'fr');
  }, games));

  return sorted;
}

/**
 * Sorts games by title descending
 * @param {object[]} games 
 * @returns {object[]}
 */
function sortByTitleDesc(games) {
  const sorted = [...games];
  sorted.sort(createStableComparator((a, b) => {
    const aVal = getTitleValue(a);
    const bVal = getTitleValue(b);
    return bVal.localeCompare(aVal, 'fr');
  }, games));

  return sorted;
}

/**
 * Applies sorting to a list of games
 * @param {object[]} games - List of visible, already filtered games
 * @param {string} sortMode - One of SortMode values
 * @returns {object[]} Same games, ordered according to the sort mode
 * @throws {SortError} If sort mode is unsupported
 */
export function applySorting(games, sortMode) {
  // Validate inputs
  if (!Array.isArray(games)) {
    console.log('[SortingEngine]', 'applySorting', { error: 'Games must be an array' });
    throw new SortError('Games must be an array', sortMode);
  }

  // No sort mode means no sorting (preserve original order)
  if (!sortMode) {
    console.log('[SortingEngine]', 'applySorting', { inputCount: games.length, sortMode: 'none' });
    return [...games];
  }

  // Validate sort mode
  if (!Object.values(SortMode).includes(sortMode)) {
    console.log('[SortingEngine]', 'applySorting', { error: 'Unsupported sort mode', sortMode });
    throw new SortError(`Unsupported sort mode: ${sortMode}`, sortMode);
  }

  // Apply appropriate sorting
  let sorted;
  switch (sortMode) {
    case SortMode.PLAY_DURATION_ASC:
      sorted = sortByPlayDurationAsc(games);
      break;
    case SortMode.PLAY_DURATION_DESC:
      sorted = sortByPlayDurationDesc(games);
      break;
    case SortMode.FIRST_PLAY_COMPLEXITY_ASC:
      sorted = sortByComplexityAsc(games);
      break;
    case SortMode.FIRST_PLAY_COMPLEXITY_DESC:
      sorted = sortByComplexityDesc(games);
      break;
    case SortMode.TITLE_ASC:
      sorted = sortByTitleAsc(games);
      break;
    case SortMode.TITLE_DESC:
      sorted = sortByTitleDesc(games);
      break;
    default:
      throw new SortError(`Unsupported sort mode: ${sortMode}`, sortMode);
  }

  console.log('[SortingEngine]', 'applySorting', { 
    inputCount: games.length, 
    outputCount: sorted.length, 
    sortMode 
  });

  return sorted;
}

/**
 * Gets the default sort mode
 * @returns {string}
 */
export function getDefaultSortMode() {
  return SortMode.TITLE_ASC;
}