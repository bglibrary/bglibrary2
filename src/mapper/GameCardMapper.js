/**
 * GameCardMapper — maps Game domain objects to GameCard view models.
 * @see specs/phase_4_4_game_card_mapper.md, phase_5_3_game_card_model.md
 */

/**
 * Formats player count from min/max as domain-derived string (e.g. "2–4").
 * @param {number} minPlayers
 * @param {number} maxPlayers
 * @returns {string}
 */
function formatPlayerCount(minPlayers, maxPlayers) {
  if (minPlayers === maxPlayers) return String(minPlayers);
  return `${minPlayers}–${maxPlayers}`;
}

/**
 * Maps a Game to a GameCard. Does not mutate input.
 * Throws if mandatory fields are missing.
 *
 * @param {import("../domain/Game").Game} game
 * @returns {{ id: string, title: string, playerCount: string, playDuration: string, hasAwards?: boolean, isFavorite?: boolean }}
 */
function mapGameToCard(game) {
  if (game == null || typeof game !== "object") {
    throw new Error("GameCardMapper: game is required");
  }
  if (typeof game.id !== "string" || game.id.trim() === "") {
    throw new Error("GameCardMapper: game.id is required");
  }
  if (typeof game.title !== "string" || game.title.trim() === "") {
    throw new Error("GameCardMapper: game.title is required");
  }
  const minPlayers = game.minPlayers;
  const maxPlayers = game.maxPlayers;
  if (typeof minPlayers !== "number" || typeof maxPlayers !== "number") {
    throw new Error("GameCardMapper: game.minPlayers and game.maxPlayers are required");
  }
  if (game.playDuration == null || typeof game.playDuration !== "string") {
    throw new Error("GameCardMapper: game.playDuration is required");
  }

  const card = {
    id: game.id,
    title: game.title,
    playerCount: formatPlayerCount(minPlayers, maxPlayers),
    playDuration: game.playDuration,
  };
  if (game.awards != null && Array.isArray(game.awards)) {
    card.hasAwards = game.awards.length > 0;
  }
  if (typeof game.favorite === "boolean") {
    card.isFavorite = game.favorite;
  }
  return card;
}

module.exports = {
  mapGameToCard,
  formatPlayerCount,
};
