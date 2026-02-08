/**
 * Filter contracts for FilteringEngine.
 * @see specs/phase_5_4_filter_contracts.md
 */

const { PlayDuration, FirstPlayComplexity } = require("../domain/types");

/**
 * @typedef {{ minPlayers: number, maxPlayers: number }} PlayerCountFilter
 */

/**
 * @typedef {{ values: string[] }} PlayDurationFilter
 * values are PlayDuration enum values
 */

/**
 * @typedef {{ values: string[] }} ComplexityFilter
 * values are FirstPlayComplexity enum values
 */

/**
 * @typedef {{ values: string[] }} CategoryFilter
 */

/**
 * @typedef {{ values: string[] }} MechanicFilter
 */

/**
 * @typedef {Object} FilterSet
 * @property {PlayerCountFilter} [playerCount]
 * @property {PlayDurationFilter} [playDuration]
 * @property {ComplexityFilter} [firstPlayComplexity]
 * @property {CategoryFilter} [categories]
 * @property {MechanicFilter} [mechanics]
 * @property {boolean} [hasAwards]
 * @property {boolean} [favoriteOnly]
 */

module.exports = {
  PlayDuration,
  FirstPlayComplexity,
};
