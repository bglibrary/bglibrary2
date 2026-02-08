/**
 * Game domain model and validation.
 * @see specs/phase_5_2_game_domain_model.md
 */

const {
  PlayDuration,
  FirstPlayComplexity,
  AgeRange,
  PLAY_DURATION_VALUES,
  FIRST_PLAY_COMPLEXITY_VALUES,
  AGE_RANGE_VALUES,
} = require("./types");
const {
  missingMandatoryField,
  invalidEnumValue,
  invalidPlayerRange,
  atLeastOneImageRequired,
} = require("./validationErrors");

/**
 * Validates a string field is present and non-empty.
 * @param {unknown} value
 * @param {string} field
 * @returns {string[]} Empty if valid, otherwise error codes
 */
function requireString(value, field) {
  if (value == null || typeof value !== "string" || value.trim() === "") {
    return [field];
  }
  return [];
}

/**
 * Validates a number field is a finite number.
 * @param {unknown} value
 * @param {string} field
 * @returns {string[]} Empty if valid, otherwise [field]
 */
function requireNumber(value, field) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return [field];
  }
  return [];
}

/**
 * Validates an enum value.
 * @param {unknown} value
 * @param {readonly string[]} allowed
 * @param {string} field
 * @returns {string[]} Empty if valid, otherwise [field]
 */
function requireEnum(value, allowed, field) {
  if (value == null || !allowed.includes(value)) {
    return [field];
  }
  return [];
}

/**
 * Validates awards array (may be empty; each award has name, optional year).
 * @param {unknown} value
 * @returns {string[]} Empty if valid, otherwise ['awards']
 */
function validateAwards(value) {
  if (!Array.isArray(value)) return ["awards"];
  for (let i = 0; i < value.length; i++) {
    const a = value[i];
    if (a == null || typeof a !== "object") return ["awards"];
    if (typeof a.name !== "string" || a.name.trim() === "") return ["awards"];
    if (a.year !== undefined && (typeof a.year !== "number" || !Number.isInteger(a.year))) return ["awards"];
  }
  return [];
}

/**
 * Validates images array (at least one; each has id, optional source, attribution).
 * @param {unknown} value
 * @returns {string[]} Empty if valid, otherwise ['images']
 */
function validateImages(value) {
  if (!Array.isArray(value) || value.length < 1) return ["images"];
  for (let i = 0; i < value.length; i++) {
    const img = value[i];
    if (img == null || typeof img !== "object") return ["images"];
    if (typeof img.id !== "string" || img.id.trim() === "") return ["images"];
  }
  return [];
}

/**
 * Validates categories/mechanics: array of non-empty strings (controlled vocabulary).
 * @param {unknown} value
 * @param {string} field
 * @returns {string[]} Empty if valid, otherwise [field]
 */
function validateStringArray(value, field) {
  if (!Array.isArray(value)) return [field];
  for (const v of value) {
    if (typeof v !== "string" || v.trim() === "") return [field];
  }
  return [];
}

/**
 * Validates a Game-like object against domain invariants.
 * Returns an array of ValidationError; empty array means valid.
 *
 * @param {unknown} raw
 * @returns {import("./validationErrors").ValidationError[]}
 */
function validateGame(raw) {
  if (raw == null || typeof raw !== "object") {
    return [missingMandatoryField("id")];
  }

  const errors = [];
  const obj = /** @type {Record<string, unknown>} */ (raw);

  if (requireString(obj.id, "id").length) errors.push(missingMandatoryField("id"));
  if (requireString(obj.title, "title").length) errors.push(missingMandatoryField("title"));
  if (requireString(obj.description, "description").length) errors.push(missingMandatoryField("description"));
  if (requireNumber(obj.minPlayers, "minPlayers").length) errors.push(missingMandatoryField("minPlayers"));
  if (requireNumber(obj.maxPlayers, "maxPlayers").length) errors.push(missingMandatoryField("maxPlayers"));

  if (requireEnum(obj.playDuration, PLAY_DURATION_VALUES, "playDuration").length) {
    errors.push(invalidEnumValue("playDuration", obj.playDuration));
  }
  if (requireEnum(obj.ageRecommendation, AGE_RANGE_VALUES, "ageRecommendation").length) {
    errors.push(invalidEnumValue("ageRecommendation", obj.ageRecommendation));
  }
  if (requireEnum(obj.firstPlayComplexity, FIRST_PLAY_COMPLEXITY_VALUES, "firstPlayComplexity").length) {
    errors.push(invalidEnumValue("firstPlayComplexity", obj.firstPlayComplexity));
  }

  if (validateStringArray(obj.categories, "categories").length) {
    errors.push(missingMandatoryField("categories"));
  }
  if (validateStringArray(obj.mechanics, "mechanics").length) {
    errors.push(missingMandatoryField("mechanics"));
  }
  if (validateAwards(obj.awards).length) {
    errors.push(missingMandatoryField("awards"));
  }
  if (validateImages(obj.images).length) {
    errors.push(atLeastOneImageRequired());
  }

  if (typeof obj.favorite !== "boolean") {
    errors.push(missingMandatoryField("favorite"));
  }
  if (typeof obj.archived !== "boolean") {
    errors.push(missingMandatoryField("archived"));
  }

  const minPlayers = Number(obj.minPlayers);
  const maxPlayers = Number(obj.maxPlayers);
  if (errors.every((e) => e.field !== "minPlayers" && e.field !== "maxPlayers") && minPlayers > maxPlayers) {
    errors.push(invalidPlayerRange());
  }

  return errors;
}

/**
 * @typedef {Object} Game
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} minPlayers
 * @property {number} maxPlayers
 * @property {string} playDuration
 * @property {string} ageRecommendation
 * @property {string} firstPlayComplexity
 * @property {string[]} categories
 * @property {string[]} mechanics
 * @property {{ name: string, year?: number }[]} awards
 * @property {boolean} favorite
 * @property {boolean} archived
 * @property {{ id: string, source?: string, attribution?: string }[]} images
 */

/**
 * Creates a validated Game object. Throws if validation fails.
 * Returns a plain object that satisfies domain invariants.
 *
 * @param {unknown} raw
 * @returns {Game}
 * @throws {Error} When validation fails (message contains code list)
 */
function createGame(raw) {
  const errs = validateGame(raw);
  if (errs.length > 0) {
    const msg = errs.map((e) => e.code).join(", ");
    throw new Error(`Game validation failed: ${msg}`);
  }
  return /** @type {Game} */ (raw);
}

module.exports = {
  validateGame,
  createGame,
};
