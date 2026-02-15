export const archiveErrors = {
  gameAlreadyArchived: (id) => ({
    message: `Le jeu ${id} est déjà archivé.`,
    type: 'GameAlreadyArchived'
  }),
  gameNotArchived: (id) => ({
    message: `Le jeu ${id} n'est pas archivé.`,
    type: 'GameNotArchived'
  }),
  missingArchiveFlag: (id) => ({
    message: `Le flag d'archivage est manquant pour le jeu ${id}.`,
    type: 'MissingArchiveFlag'
  })
};
