/**
 * GameCardMapper — transforms Game domain objects into lightweight GameCard view models.
 * @see specs/phase_4_4_game_card_mapper.md, phase_5_3_game_card_model.md, phase1_3_filtering_and_taxonomy_rules.md
 */

/**
 * Formats player count into a human-readable string.
 * @param {number} minPlayers
 * @param {number} maxPlayers
 * @returns {string}
 */
function formatPlayerCount(minPlayers, maxPlayers) {
  if (minPlayers === maxPlayers) {
    return `${minPlayers} joueur${minPlayers > 1 ? "s" : ""}`;
  }
  if (maxPlayers === 6 && minPlayers < 6) {
    return `${minPlayers}-${maxPlayers}+ joueurs`;
  }
  return `${minPlayers}-${maxPlayers} joueurs`;
}

/**
 * Maps a Game domain object to a GameCard view model.
 * @param {import("../domain/Game").Game} game
 * @returns {import("../domain/GameCard").GameCard}
 */
function mapGameToCard(game) {
  if (!game) throw new Error("Game object is required for mapping to GameCard.");

  return Object.freeze({
    id: game.id,
    title: game.title,
    playerCount: formatPlayerCount(game.minPlayers, game.maxPlayers),
    playDuration: game.playDuration,
    hasAwards: game.awards && game.awards.length > 0,
    isFavorite: !!game.favorite,
  });
}

module.exports = {
  mapGameToCard,
  formatPlayerCount, // Export for testing purposes, not part of public contract usually
};
