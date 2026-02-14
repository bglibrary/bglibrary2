/**
 * Game domain entity.
 * @see specs/phase_5_2_game_domain_model.md
 */

const {
  PLAY_DURATION_VALUES,
  FIRST_PLAY_COMPLEXITY_VALUES,
  AGE_RANGE,
  CATEGORIES,
  MECHANICS,
} = require("./types");
const {
  missingMandatoryField,
  invalidEnumValue,
  invalidPlayerRange,
} = require("./validationErrors");

/**
 * Validates game data and returns array of errors. Empty array means valid.
 */
function validateGame(data) {
  const errors = [];

  const requireString = (field) => {
    if (typeof data[field] !== "string" || data[field].trim() === "") {
      errors.push(missingMandatoryField(field));
    }
  };

  const requireNumber = (field) => {
    if (typeof data[field] !== "number") {
      errors.push(missingMandatoryField(field));
    }
  };

  const requireEnum = (field, allowedValues) => {
    if (!allowedValues.includes(data[field])) {
      errors.push(invalidEnumValue(field, data[field], allowedValues));
    }
  };

  requireString("id");
  requireString("title");
  requireString("description");
  requireNumber("minPlayers");
  requireNumber("maxPlayers");

  if (typeof data.minPlayers === "number" && typeof data.maxPlayers === "number") {
    if (data.minPlayers > data.maxPlayers) {
      errors.push(invalidPlayerRange(data.minPlayers, data.maxPlayers));
    }
  }

  requireEnum("playDuration", PLAY_DURATION_VALUES);
  requireEnum("ageRecommendation", AGE_RANGE);
  requireEnum("firstPlayComplexity", FIRST_PLAY_COMPLEXITY_VALUES);

  const validateStringArray = (field, allowedValues) => {
    if (!Array.isArray(data[field])) {
      errors.push(missingMandatoryField(field));
      return;
    }
    data[field].forEach((val) => {
      if (!allowedValues.includes(val)) {
        errors.push(invalidEnumValue(`${field}[]`, val, allowedValues));
      }
    });
  };

  validateStringArray("categories", CATEGORIES);
  validateStringArray("mechanics", MECHANICS);

  if (!Array.isArray(data.images) || data.images.length === 0) {
    errors.push(missingMandatoryField("images"));
  }

  return errors;
}

/**
 * Factory function for Game entity.
 * Validates input data and returns a Game object.
 */
function createGame(data) {
  const errors = validateGame(data);
  if (errors.length > 0) {
    const error = new Error("Invalid Game data");
    error.validationErrors = errors;
    throw error;
  }

  return Object.freeze({
    id: data.id,
    title: data.title,
    description: data.description,
    minPlayers: data.minPlayers,
    maxPlayers: data.maxPlayers,
    playDuration: data.playDuration,
    ageRecommendation: data.ageRecommendation,
    firstPlayComplexity: data.firstPlayComplexity,
    categories: Object.freeze([...data.categories]),
    mechanics: Object.freeze([...data.mechanics]),
    awards: Object.freeze(data.awards ? [...data.awards] : []),
    favorite: !!data.favorite,
    archived: !!data.archived,
    images: Object.freeze(data.images.map((img) => Object.freeze({ ...img }))),
  });
}

module.exports = {
  validateGame,
  createGame,
};
