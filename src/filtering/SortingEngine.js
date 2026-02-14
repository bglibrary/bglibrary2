/**
 * SortingEngine — deterministic ordering of games.
 * Pure, stateless; does not mutate input.
 * @see specs/phase_4_2_sorting_engine.md
 */

const { SORT_MODES, SORT_MODE_VALUES } = require("./sortingTypes");
const { unsupportedSortMode } = require("./sortingErrors");

/**
 * Applies sorting to games. Does not mutate input.
 * Throws if sort mode is invalid.
 *
 * @param {import("../domain/Game").Game[]} games
 * @param {string} sortMode
 * @returns {import("../domain/Game").Game[]}
 */
function applySorting(games, sortMode) {
  if (!Array.isArray(games)) return [];
  if (!sortMode) return [...games];

  if (!SORT_MODE_VALUES.includes(sortMode)) {
    const err = unsupportedSortMode(sortMode);
    throw Object.assign(new Error(err.message), { code: err.code, sortMode: err.sortMode });
  }

  return [...games].sort((a, b) => {
    switch (sortMode) {
      case SORT_MODES.PLAY_DURATION_ASC:
        return compareValues(a.playDuration, b.playDuration, false);
      case SORT_MODES.PLAY_DURATION_DESC:
        return compareValues(a.playDuration, b.playDuration, true);
      case SORT_MODES.FIRST_PLAY_COMPLEXITY_ASC:
        return compareValues(a.firstPlayComplexity, b.firstPlayComplexity, false);
      case SORT_MODES.FIRST_PLAY_COMPLEXITY_DESC:
        return compareValues(a.firstPlayComplexity, b.firstPlayComplexity, true);
      default:
        return 0;
    }
  });
}

/**
 * Stable comparison helper.
 * Missing values (null/undefined) are ordered last.
 * @param {*} a
 * @param {*} b
 * @param {boolean} descending - If true, non-null values are compared in reverse, but nulls stay last.
 */
function compareValues(a, b, descending = false) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (descending) {
    if (a < b) return 1;
    if (a > b) return -1;
  } else {
    if (a < b) return -1;
    if (a > b) return 1;
  }
  return 0;
}

module.exports = {
  applySorting,
};
