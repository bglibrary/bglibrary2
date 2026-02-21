/**
 * GameRepository
 * 
 * Single authoritative read-access component for game data.
 * As specified in specs/phase_3_2_ref_spec_game_repository.md
 */

// Import game data - in static mode, these are loaded at build time
// We'll use fetch to load JSON files from the static site
const GAMES_DATA_PATH = '/data/games';

/**
 * Context types for visibility rules
 */
export const Context = {
  VISITOR: 'visitor',
  ADMIN: 'admin',
};

/**
 * Repository error types
 */
export class RepositoryError extends Error {
  constructor(message, type) {
    super(message);
    this.name = 'RepositoryError';
    this.type = type;
  }
}

export const ErrorType = {
  GAME_NOT_FOUND: 'GAME_NOT_FOUND',
  GAME_ARCHIVED: 'GAME_ARCHIVED',
  DATA_LOAD_FAILURE: 'DATA_LOAD_FAILURE',
};

// In-memory cache for loaded games
let gamesCache = null;
let gamesIndexCache = null;

/**
 * Loads all games from the data source
 * In a static site, this fetches JSON files from the public directory
 * @returns {Promise<object[]>}
 */
async function loadAllGames() {
  if (gamesCache) {
    return gamesCache;
  }

  try {
    // In static mode, we need to fetch the index file that lists all games
    const indexResponse = await fetch(`${GAMES_DATA_PATH}/index.json`);
    
    if (!indexResponse.ok) {
      // If no index, try to load known games
      console.log('[GameRepository]', 'loadAllGames', { status: 'No index file, using fallback' });
      return await loadGamesFromManifest();
    }
    
    const index = await indexResponse.json();
    const games = [];
    
    for (const gameId of index.games) {
      const game = await loadGameById(gameId);
      if (game) {
        games.push(game);
      }
    }
    
    gamesCache = games;
    console.log('[GameRepository]', 'loadAllGames', { count: games.length });
    return games;
  } catch (error) {
    console.error('[GameRepository]', 'loadAllGames', { error: error.message });
    // Fallback to manifest loading
    return await loadGamesFromManifest();
  }
}

/**
 * Fallback: Load games from a hardcoded manifest
 * This is used when no index.json exists
 * @returns {Promise<object[]>}
 */
async function loadGamesFromManifest() {
  // Known games - this can be updated or loaded from a build-time manifest
  const knownGames = ['catan', 'azul'];
  const games = [];
  
  for (const gameId of knownGames) {
    try {
      const game = await loadGameById(gameId);
      if (game) {
        games.push(game);
      }
    } catch (error) {
      console.warn('[GameRepository]', 'loadGamesFromManifest', { gameId, error: error.message });
    }
  }
  
  gamesCache = games;
  return games;
}

/**
 * Loads a single game by ID
 * @param {string} id 
 * @returns {Promise<object|null>}
 */
async function loadGameById(id) {
  try {
    const response = await fetch(`${GAMES_DATA_PATH}/${id}.json`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('[GameRepository]', 'loadGameById', { id, error: error.message });
    return null;
  }
}

/**
 * Gets all games, optionally including archived games
 * @param {string} context - 'visitor' or 'admin'
 * @returns {Promise<object[]>}
 */
export async function getAllGames(context = Context.VISITOR) {
  console.log('[GameRepository]', 'getAllGames', { context });
  
  const games = await loadAllGames();
  
  if (context === Context.ADMIN) {
    // Admin sees all games including archived
    return [...games];
  }
  
  // Visitors only see non-archived games
  return games.filter(game => !game.archived);
}

/**
 * Gets a game by ID
 * @param {string} id 
 * @param {string} context - 'visitor' or 'admin'
 * @returns {Promise<object>}
 * @throws {RepositoryError}
 */
export async function getGameById(id, context = Context.VISITOR) {
  console.log('[GameRepository]', 'getGameById', { id, context });
  
  const games = await loadAllGames();
  const game = games.find(g => g.id === id);
  
  if (!game) {
    throw new RepositoryError(
      `Game not found: ${id}`,
      ErrorType.GAME_NOT_FOUND
    );
  }
  
  if (game.archived && context === Context.VISITOR) {
    throw new RepositoryError(
      `Game is archived and not visible to visitors: ${id}`,
      ErrorType.GAME_ARCHIVED
    );
  }
  
  return { ...game };
}

/**
 * Checks if a game exists
 * @param {string} id 
 * @returns {Promise<boolean>}
 */
export async function gameExists(id) {
  console.log('[GameRepository]', 'gameExists', { id });
  
  const games = await loadAllGames();
  return games.some(g => g.id === id);
}

/**
 * Clears the cache (useful for testing)
 */
export function clearCache() {
  console.log('[GameRepository]', 'clearCache');
  gamesCache = null;
  gamesIndexCache = null;
}

/**
 * Preloads games into cache
 * @param {object[]} games - Array of game objects to cache
 */
export function preloadGames(games) {
  console.log('[GameRepository]', 'preloadGames', { count: games.length });
  gamesCache = games.map(g => ({ ...g }));
}

/**
 * Gets all unique categories from all games
 * @returns {Promise<string[]>}
 */
export async function getAllCategories() {
  const games = await loadAllGames();
  const categories = new Set();
  
  for (const game of games) {
    for (const category of game.categories || []) {
      categories.add(category);
    }
  }
  
  return Array.from(categories).sort();
}

/**
 * Gets all unique mechanics from all games
 * @returns {Promise<string[]>}
 */
export async function getAllMechanics() {
  const games = await loadAllGames();
  const mechanics = new Set();
  
  for (const game of games) {
    for (const mechanic of game.mechanics || []) {
      mechanics.add(mechanic);
    }
  }
  
  return Array.from(mechanics).sort();
}