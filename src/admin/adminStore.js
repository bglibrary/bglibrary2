/**
 * Shared in-memory store for admin UI (dev/demo).
 * In production this would be replaced by API + persistence.
 */
function createInMemoryStore() {
  const games = [];
  return {
    getAllGames: async () => [...games],
    getGameById: async (id) => games.find((g) => g.id === id) ?? null,
    saveGame: async (game) => {
      const i = games.findIndex((g) => g.id === game.id);
      if (i >= 0) games[i] = game;
      else games.push(game);
    },
  };
}

let defaultStore = null;

function getDefaultStore() {
  if (!defaultStore) defaultStore = createInMemoryStore();
  return defaultStore;
}

module.exports = {
  createInMemoryStore,
  getDefaultStore,
};
