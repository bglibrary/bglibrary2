/**
 * Filtering engine error factories.
 * @see specs/phase_4_1_filtering_engine.md
 */

function emptyFilterValues(filterName) {
  return {
    code: "EMPTY_FILTER_VALUES",
    message: `Les valeurs pour le filtre "${filterName}" ne peuvent pas être vides.`,
    filterName,
  };
}

function invalidFilterValue(filterName, value) {
  return {
    code: "INVALID_FILTER_VALUE",
    message: `La valeur "${value}" pour le filtre "${filterName}" est invalide.`,
    filterName,
    value,
  };
}

module.exports = {
  emptyFilterValues,
  invalidFilterValue,
};
