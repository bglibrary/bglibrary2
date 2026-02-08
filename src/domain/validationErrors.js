/**
 * Explicit, typed validation errors for the Game domain.
 * @see specs/phase_5_2_game_domain_model.md — Error Conditions
 */

/**
 * @typedef {Object} ValidationError
 * @property {string} code - Error code for programmatic handling
 * @property {string} message - Human-readable message
 * @property {string} [field] - Affected field name when applicable
 */

/**
 * @param {string} field
 * @returns {ValidationError}
 */
function missingMandatoryField(field) {
  return { code: "MISSING_MANDATORY_FIELD", field, message: `Missing mandatory field: ${field}` };
}

/**
 * @param {string} field
 * @param {*} value
 * @returns {ValidationError}
 */
function invalidEnumValue(field, value) {
  return { code: "INVALID_ENUM_VALUE", field, message: `Invalid enum value for ${field}: ${String(value)}` };
}

/**
 * @returns {ValidationError}
 */
function invalidPlayerRange() {
  return { code: "INVALID_PLAYER_RANGE", field: "minPlayers/maxPlayers", message: "minPlayers must be <= maxPlayers" };
}

/**
 * @returns {ValidationError}
 */
function atLeastOneImageRequired() {
  return { code: "AT_LEAST_ONE_IMAGE_REQUIRED", field: "images", message: "At least one image is required" };
}

module.exports = {
  missingMandatoryField,
  invalidEnumValue,
  invalidPlayerRange,
  atLeastOneImageRequired,
};
