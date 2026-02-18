# Guide d'Implémentation : API Git & Backend sur Render

## 1. Introduction
Ce document est un guide pas à pas destiné à l'implémentation de la gestion des APIs Git pour le projet BGLibrary. L'objectif est de permettre aux administrateurs de modifier les données du site (fichiers JSON) via une interface qui effectue des commits Git réels, tout en respectant les contraintes du plan gratuit de Render.

### Principes Clés
*   **Git comme Source de Vérité** : Toutes les données résident dans le dépôt Git.
*   **Architecture Stateless** : Le backend ne garde pas de fichiers en local entre deux requêtes (contrainte Render).
*   **Opérations Atomiques** : Chaque modification = Clone temporaire -> Modif -> Commit -> Push -> Suppression.
*   **Sécurité** : Utilisation de variables d'environnement pour les secrets (PAT GitHub).

---

## 2. Prérequis Techniques

Avant de commencer, assure-toi d'avoir :
*   Une branche de travail dédiée : `git checkout -b feat/git-api-implementation`
*   Les dépendances nécessaires installées : `npm install simple-git express`

---

## 3. Plan d'Action Étape par Étape

### Étape 1 : Préparation de l'Infrastructure
Nous allons créer un nouveau service `SimpleGitService` qui remplacera ou complétera l'existant.

1.  **Créer le fichier** : `src/infrastructure/SimpleGitService.js`.
2.  **Implémenter le contrat** défini dans `src/infrastructure/GitServiceContract.js`.
3.  **Utiliser `simple-git`** pour les opérations de bas niveau.

**Action Junior** : 
*   Crée la classe `SimpleGitService`.
*   Ajoute une méthode privée `_withTempRepo(callback)` qui :
    1.  Crée un répertoire temporaire (utilise `fs.mkdtemp`).
    2.  Clone le dépôt (`git clone`).
    3.  Exécute le `callback` en lui passant le chemin du repo cloné.
    4.  Nettoie (supprime) le répertoire temporaire après exécution, même en cas d'erreur.

### Étape 2 : Implémentation des Méthodes de Persistance
Pour chaque méthode (`addGame`, `updateGame`, etc.) :
1.  Appeler `_withTempRepo`.
2.  Dans le callback :
    *   Modifier le fichier JSON correspondant dans `data/games/`.
    *   Faire un `git add`.
    *   Faire un `git commit` avec un message clair (ex: `admin: add game {name}`).
    *   Faire un `git push`.

**Commit Atomique** : `feat(git): implement SimpleGitService with temp clone logic`

### Étape 3 : Création des Endpoints API (Express)
Le projet utilise actuellement Next.js, mais pour Render nous avons besoin d'un point d'entrée pour les routes Admin.

1.  Crée un serveur Express minimal dans `src/server.js` (si non existant).
2.  Ajoute les routes suivantes :
    *   `POST /api/admin/games` -> appelle `AdminGameService.addGame`
    *   `PUT /api/admin/games/:id` -> appelle `AdminGameService.updateGame`
    *   `POST /api/admin/games/:id/archive` -> appelle `AdminGameService.archiveGame`

**Action Junior** : Assure-toi que les erreurs Git (conflits de push) renvoient des codes HTTP appropriés (ex: 409 pour un conflit).

### Étape 4 : Tests et Instrumentation
La qualité du code est primordiale.

1.  **Tests Unitaires** : Crée `tests/infrastructure/SimpleGitService.test.js`. Utilise des mocks pour `simple-git` afin de ne pas pousser réellement sur GitHub pendant les tests.
2.  **Logs** : Ajoute des logs informatifs (mais sans secrets !) pour suivre les étapes du clone/commit/push.
3.  **Documentation** : JSDoc sur toutes les méthodes.

**Commit Atomique** : `test(git): add unit tests for SimpleGitService`

---

## 4. Critères d'Acceptation (Definition of Done)

*   [ ] Une nouvelle branche a été créée et utilisée.
*   [ ] Le code est documenté avec JSDoc.
*   [ ] Les tests unitaires passent (`npm test`).
*   [ ] Aucune donnée sensible (token) n'est logguée.
*   [ ] Le répertoire temporaire est systématiquement supprimé après une opération.
*   [ ] Les commits sur le dépôt de destination sont atomiques et bien nommés.