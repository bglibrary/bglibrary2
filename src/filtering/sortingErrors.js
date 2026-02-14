/**
 * Sorting engine error factory.
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
