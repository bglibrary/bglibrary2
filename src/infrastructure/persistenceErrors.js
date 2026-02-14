/**
 * Persistence error factories.
 * @see specs/phase_5_6_git_service_errors.md
 */

function authenticationError() {
  return {
    code: "AUTHENTICATION_ERROR",
    message: "Échec de l'authentification. Veuillez vérifier vos identifiants.",
  };
}

function writeConflict(id) {
  return {
    code: "WRITE_CONFLICT",
    message: `Conflit d'écriture détecté pour le jeu "${id}".`,
    id,
  };
}

function repositoryUnavailable() {
  return {
    code: "REPOSITORY_UNAVAILABLE",
    message: "Le dépôt distant est temporairement indisponible.",
  };
}

function invalidPath(path) {
  return {
    code: "INVALID_PATH",
    message: `Le chemin spécifié est invalide : "${path}".`,
    path,
  };
}

function unknownPersistenceError(originalError) {
  return {
    code: "UNKNOWN_PERSISTENCE_ERROR",
    message: "Une erreur de persistance inattendue s'est produite.",
    originalError: originalError?.message || originalError,
  };
}

module.exports = {
  authenticationError,
  writeConflict,
  repositoryUnavailable,
  invalidPath,
  unknownPersistenceError,
};
