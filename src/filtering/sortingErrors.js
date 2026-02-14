/**
 * Sorting engine error factory.
 * @see specs/phase_4_2_sorting_engine.md
 */

function unsupportedSortMode(mode) {
  return {
    code: "UNSUPPORTED_SORT_MODE",
    message: `Sort mode "${mode}" is not supported.`,
    sortMode: mode,
  };
}

module.exports = {
  unsupportedSortMode,
};
