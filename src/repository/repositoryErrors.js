/**
 * Repository specific error factories.
 * @see specs/phase_3_2_ref_spec_game_repository.md
 */

function gameNotFound(id) {
  return {
    code: "GAME_NOT_FOUND",
    message: `Le jeu avec l'identifiant "${id}" n'a pas été trouvé.`,
    id,
  };
}

function gameArchivedNotVisible(id) {
  return {
    code: "GAME_ARCHIVED_NOT_VISIBLE",
    message: `Le jeu "${id}" est archivé et n'est pas visible pour les visiteurs.`,
    id,
  };
}

function dataLoadFailure(originalError) {
  return {
    code: "DATA_LOAD_FAILURE",
    message: "Impossible de charger les données des jeux.",
    originalError: originalError?.message || originalError,
  };
}

module.exports = {
  gameNotFound,
  gameArchivedNotVisible,
  dataLoadFailure,
};
