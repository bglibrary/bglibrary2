/**
 * GameCard Model
 * 
 * View model for list and summary displays as defined in specs/phase_5_3_game_card_model.md
 * This is a projection of the Game domain model with strictly limited scope.
 */

import { PlayDuration } from './Game';

/**
 * Formats player count as a display string
 * @param {number} minPlayers 
 * @param {number} maxPlayers 
 * @returns {string}
 */
export function formatPlayerCount(minPlayers, maxPlayers) {
  if (minPlayers === maxPlayers) {
    return `${minPlayers} joueurs`;
  }
  return `${minPlayers}-${maxPlayers} joueurs`;
}

/**
 * Maps a Game entity to a GameCard view model
 * @param {object} game - Game entity
 * @returns {object} GameCard view model
 */
export function mapToGameCard(game) {
  if (!game) {
    throw new Error('Cannot map null/undefined game to GameCard');
  }

  return {
    id: game.id,
    title: game.title,
    playerCount: formatPlayerCount(game.minPlayers, game.maxPlayers),
    playDuration: game.playDuration,
    hasAwards: !!(game.awards && game.awards.length > 0),
    isFavorite: !!game.favorite,
    // Include primary image reference for display
    primaryImage: game.images && game.images.length > 0 ? game.images[0] : null,
    // Include archived status for admin context
    isArchived: !!game.archived,
  };
}

/**
 * Maps an array of Game entities to GameCard view models
 * @param {object[]} games - Array of Game entities
 * @returns {object[]} Array of GameCard view models
 */
export function mapToGameCards(games) {
  if (!Array.isArray(games)) {
    return [];
  }
  return games.map(mapToGameCard);
}