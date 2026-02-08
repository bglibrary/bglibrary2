/**
 * FilteringEngine — deterministic filtering of games by FilterSet.
 * Pure, stateless; does not mutate input. Order preserved.
 * @see specs/phase_4_1_filtering_engine.md
 */

const { PLAY_DURATION_VALUES, FIRST_PLAY_COMPLEXITY_VALUES } = require("../domain/types");
const { emptyFilterValues, invalidFilterValue } = require("./filteringErrors");

/**
 * Validates FilterSet. Returns array of errors; empty means valid.
 * @param {import("./filterTypes").FilterSet} filters
 * @returns {{ code: string, message: string, filterName?: string }[]}
 */
function validateFilters(filters) {
  if (filters == null || typeof filters !== "object") return [];
  const errors = [];

  if (filters.playDuration !== undefined) {
    if (!Array.isArray(filters.playDuration.values) || filters.playDuration.values.length === 0) {
      errors.push(emptyFilterValues("playDuration"));
    } else {
      for (const v of filters.playDuration.values) {
        if (!PLAY_DURATION_VALUES.includes(v)) errors.push(invalidFilterValue("playDuration", v));
      }
    }
  }
  if (filters.firstPlayComplexity !== undefined) {
    if (!Array.isArray(filters.firstPlayComplexity.values) || filters.firstPlayComplexity.values.length === 0) {
      errors.push(emptyFilterValues("firstPlayComplexity"));
    } else {
      for (const v of filters.firstPlayComplexity.values) {
        if (!FIRST_PLAY_COMPLEXITY_VALUES.includes(v)) errors.push(invalidFilterValue("firstPlayComplexity", v));
      }
    }
  }
  if (filters.categories !== undefined) {
    if (!Array.isArray(filters.categories.values) || filters.categories.values.length === 0) {
      errors.push(emptyFilterValues("categories"));
    }
  }
  if (filters.mechanics !== undefined) {
    if (!Array.isArray(filters.mechanics.values) || filters.mechanics.values.length === 0) {
      errors.push(emptyFilterValues("mechanics"));
    }
  }

  return errors;
}

/**
 * Applies filters to games. Does not mutate input. Preserves order.
 * Throws if filter definition is invalid (empty values or invalid enums).
 *
 * @param {import("../domain/Game").Game[]} games
 * @param {import("./filterTypes").FilterSet} filters
 * @returns {import("../domain/Game").Game[]}
 */
function applyFilters(games, filters) {
  const validationErrors = validateFilters(filters);
  if (validationErrors.length > 0) {
    const err = validationErrors[0];
    throw Object.assign(new Error(err.message), { code: err.code, filterName: err.filterName });
  }

  if (!Array.isArray(games)) return [];
  if (filters == null || Object.keys(filters).length === 0) return [...games];

  return games.filter((game) => matchesAll(game, filters));
}

/**
 * @param {import("../domain/Game").Game} game
 * @param {import("./filterTypes").FilterSet} filters
 * @returns {boolean}
 */
function matchesAll(game, filters) {
  if (filters.playerCount !== undefined) {
    const { minPlayers: fMin, maxPlayers: fMax } = filters.playerCount;
    if (typeof fMin !== "number" || typeof fMax !== "number") return false;
    if (game.minPlayers > fMax || game.maxPlayers < fMin) return false;
  }

  if (filters.playDuration !== undefined) {
    const values = filters.playDuration.values;
    if (!values.includes(game.playDuration)) return false;
  }

  if (filters.firstPlayComplexity !== undefined) {
    const values = filters.firstPlayComplexity.values;
    if (!values.includes(game.firstPlayComplexity)) return false;
  }

  if (filters.categories !== undefined) {
    const values = filters.categories.values;
    const match = values.some((c) => game.categories.includes(c));
    if (!match) return false;
  }

  if (filters.mechanics !== undefined) {
    const values = filters.mechanics.values;
    const match = values.some((m) => game.mechanics.includes(m));
    if (!match) return false;
  }

  if (filters.hasAwards === true) {
    if (!game.awards || game.awards.length === 0) return false;
  }

  if (filters.favoriteOnly === true) {
    if (!game.favorite) return false;
  }

  return true;
}

module.exports = {
  applyFilters,
  validateFilters,
};
