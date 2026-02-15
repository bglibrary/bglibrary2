export const adminServiceErrors = {
  gameNotFound: (id) => ({
    message: `Jeu non trouvé : ${id}`,
    type: 'GameNotFound'
  }),
  duplicateGameId: (id) => ({
    message: `Un jeu avec l'identifiant ${id} existe déjà.`,
    type: 'DuplicateGameId'
  }),
  invalidGameData: (details) => ({
    message: `Données du jeu invalides : ${details}`,
    type: 'InvalidGameData'
  }),
  operationFailed: (details) => ({
    message: `L'opération a échoué : ${details}`,
    type: 'OperationFailed'
  })
};
