/**
 * Data contracts for FilteringEngine.
 * @see specs/phase_5_4_filter_contracts.md
 */

/**
 * @typedef {Object} PlayerCountFilter
 * @property {number} minPlayers
 * @property {number} maxPlayers
 */

/**
 * @typedef {Object} PlayDurationFilter
 * @property {import("../domain/types").PlayDuration[]} values
 */

/**
 * @typedef {Object} ComplexityFilter
 * @property {import("../domain/types").FirstPlayComplexity[]} values
 */

/**
 * @typedef {Object} CategoryFilter
 * @property {string[]} values
 */

/**
 * @typedef {Object} MechanicFilter
 * @property {string[]} values
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
