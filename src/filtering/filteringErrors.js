/**
 * Explicit errors for FilteringEngine.
 * @see specs/phase_4_1_filtering_engine.md — Error Handling
 */

/**
 * @param {string} filterName
 * @returns {{ code: string, message: string, filterName: string }}
 */
function emptyFilterValues(filterName) {
  return {
    code: "EMPTY_FILTER_VALUES",
    message: `Filter ${filterName} has empty values`,
    filterName,
  };
}

/**
 * @param {string} filterName
 * @param {*} value
 * @returns {{ code: string, message: string, filterName: string }}
 */
function invalidFilterValue(filterName, value) {
  return {
    code: "INVALID_FILTER_VALUE",
    message: `Invalid value for filter ${filterName}: ${String(value)}`,
    filterName,
  };
}

module.exports = {
  emptyFilterValues,
  invalidFilterValue,
};
