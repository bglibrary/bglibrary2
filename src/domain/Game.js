/**
 * Game Domain Entity
 * 
 * Canonical Game domain model as defined in specs/phase_5_2_game_domain_model.md
 * This is the single source of truth for all game-related data across the system.
 */

// Enum definitions
export const PlayDuration = {
  SHORT: 'SHORT',
  MEDIUM: 'MEDIUM',
  LONG: 'LONG',
};

export const FirstPlayComplexity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

// Valid age recommendations
export const AgeRecommendations = [
  '6+', '8+', '10+', '12+', '14+', '16+', '18+'
];

/**
 * Validates that a value is a valid PlayDuration
 * @param {string} value 
 * @returns {boolean}
 */
export function isValidPlayDuration(value) {
  return Object.values(PlayDuration).includes(value);
}

/**
 * Validates that a value is a valid FirstPlayComplexity
 * @param {string} value 
 * @returns {boolean}
 */
export function isValidFirstPlayComplexity(value) {
  return Object.values(FirstPlayComplexity).includes(value);
}

/**
 * Validates that a value is a valid AgeRecommendation
 * @param {string} value 
 * @returns {boolean}
 */
export function isValidAgeRecommendation(value) {
  return AgeRecommendations.includes(value);
}

/**
 * Validates player count constraints
 * @param {number} minPlayers 
 * @param {number} maxPlayers 
 * @returns {boolean}
 */
export function isValidPlayerRange(minPlayers, maxPlayers) {
  return (
    typeof minPlayers === 'number' &&
    typeof maxPlayers === 'number' &&
    minPlayers >= 1 &&
    maxPlayers >= minPlayers
  );
}

/**
 * Validates an image descriptor
 * @param {object} image 
 * @returns {boolean}
 */
export function isValidImageDescriptor(image) {
  return (
    typeof image === 'object' &&
    image !== null &&
    typeof image.id === 'string' &&
    image.id.length > 0
  );
}

/**
 * Validates an award object
 * @param {object} award 
 * @returns {boolean}
 */
export function isValidAward(award) {
  return (
    typeof award === 'object' &&
    award !== null &&
    typeof award.name === 'string' &&
    award.name.length > 0 &&
    (award.year === undefined || typeof award.year === 'number')
  );
}

/**
 * Game validation error class
 */
export class GameValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'GameValidationError';
    this.field = field;
  }
}

/**
 * Validates a complete game object
 * @param {object} gameData - Raw game data to validate
 * @returns {object} Validated game object
 * @throws {GameValidationError} If validation fails
 */
export function validateGame(gameData) {
  if (!gameData || typeof gameData !== 'object') {
    throw new GameValidationError('Game data must be an object', 'root');
  }

  // Validate ID
  if (typeof gameData.id !== 'string' || gameData.id.length === 0) {
    throw new GameValidationError('Game ID must be a non-empty string', 'id');
  }

  // Validate title
  if (typeof gameData.title !== 'string' || gameData.title.length === 0) {
    throw new GameValidationError('Game title must be a non-empty string', 'title');
  }

  // Validate description
  if (typeof gameData.description !== 'string') {
    throw new GameValidationError('Game description must be a string', 'description');
  }

  // Validate player range
  if (!isValidPlayerRange(gameData.minPlayers, gameData.maxPlayers)) {
    throw new GameValidationError(
      'Invalid player range: minPlayers must be >= 1 and <= maxPlayers',
      'players'
    );
  }

  // Validate play duration
  if (!isValidPlayDuration(gameData.playDuration)) {
    throw new GameValidationError(
      `Invalid play duration: must be one of ${Object.values(PlayDuration).join(', ')}`,
      'playDuration'
    );
  }

  // Validate age recommendation
  if (!isValidAgeRecommendation(gameData.ageRecommendation)) {
    throw new GameValidationError(
      `Invalid age recommendation: must be one of ${AgeRecommendations.join(', ')}`,
      'ageRecommendation'
    );
  }

  // Validate first play complexity
  if (!isValidFirstPlayComplexity(gameData.firstPlayComplexity)) {
    throw new GameValidationError(
      `Invalid first play complexity: must be one of ${Object.values(FirstPlayComplexity).join(', ')}`,
      'firstPlayComplexity'
    );
  }

  // Validate categories (must be array of strings)
  if (!Array.isArray(gameData.categories)) {
    throw new GameValidationError('Categories must be an array', 'categories');
  }

  // Validate mechanics (must be array of strings)
  if (!Array.isArray(gameData.mechanics)) {
    throw new GameValidationError('Mechanics must be an array', 'mechanics');
  }

  // Validate awards (must be array of valid award objects)
  if (!Array.isArray(gameData.awards)) {
    throw new GameValidationError('Awards must be an array', 'awards');
  }
  for (const award of gameData.awards) {
    if (!isValidAward(award)) {
      throw new GameValidationError('Invalid award object in awards array', 'awards');
    }
  }

  // Validate images (must be non-empty array of valid image descriptors)
  if (!Array.isArray(gameData.images) || gameData.images.length === 0) {
    throw new GameValidationError('Images must be a non-empty array', 'images');
  }
  for (const image of gameData.images) {
    if (!isValidImageDescriptor(image)) {
      throw new GameValidationError('Invalid image descriptor in images array', 'images');
    }
  }

  // Validate favorite flag
  if (typeof gameData.favorite !== 'boolean') {
    throw new GameValidationError('Favorite must be a boolean', 'favorite');
  }

  // Validate archived flag
  if (typeof gameData.archived !== 'boolean') {
    throw new GameValidationError('Archived must be a boolean', 'archived');
  }

  return true;
}

/**
 * Creates a Game entity from raw data
 * @param {object} gameData - Raw game data
 * @returns {object} Game entity
 * @throws {GameValidationError} If validation fails
 */
export function createGame(gameData) {
  console.log('[Game]', 'createGame', { id: gameData?.id });
  
  validateGame(gameData);

  // Return immutable game object
  return {
    id: gameData.id,
    title: gameData.title,
    description: gameData.description,
    minPlayers: gameData.minPlayers,
    maxPlayers: gameData.maxPlayers,
    playDuration: gameData.playDuration,
    ageRecommendation: gameData.ageRecommendation,
    firstPlayComplexity: gameData.firstPlayComplexity,
    categories: [...gameData.categories],
    mechanics: [...gameData.mechanics],
    awards: gameData.awards.map(a => ({ ...a })),
    images: gameData.images.map(i => ({ ...i })),
    favorite: gameData.favorite,
    archived: gameData.archived,
  };
}

/**
 * Generates a URL-friendly ID from a title
 * @param {string} title 
 * @returns {string}
 */
export function generateGameId(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric with hyphen
    .replace(/^-|-$/g, '');          // Remove leading/trailing hyphens
}