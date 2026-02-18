Voici l'analyse des différences entre les spécifications (dossier `specs/`) et le code actuellement implémenté dans le repo :

### Éléments manquants (Spec définie, mais non implémentée)
- **SortingEngine** : Bien que décrit dans `phase_4_2_sorting_engine.md`, ce composant est totalement absent du dossier `src/filtering/` ou `src/sorting/`. Le tri n'est pas non plus intégré dans le composant `GameLibrary.js`.
- **SelectionGuide** : Spécifié dans `phase_4_3_selection_guide.md`, ce service d'aide au choix (recommandation déterministe) n'a aucune implémentation correspondante dans `src/`.
- **GitService** : Évoqué dans les specs d'architecture (`phase_4_7`) pour la persistance via Git, aucune trace d'un service gérant les commits ou les interactions Git n'existe dans le code.
- **Confirmation Dialogs** : Mentionnés dans la `phase_11` du plan d'implémentation pour la gestion de l'archive, ils ne sont pas présents dans les composants UI.
- **Navigation Detail UI** : Bien que le fichier `pages/game/[id].js` existe, il n'y a pas de composant `GameDetail` dédié spécifié dans `phase_7_3_ui_visitor_game_detail.md`.

### Écarts d'implémentation (Code existant vs Spec)
- **Validation d'image simplifiée** : `ImageAssetManager.js` implémente la validation de base (taille, format), mais ne semble pas encore gérer la persistence réelle ni la génération de variantes mentionnées dans les specs étendues.
- **Persistence symbolique** : Le `GameRepository.js` est prêt à recevoir un loader de données, mais dans `pages/index.js`, il est instancié avec une fonction vide (`loadGames = () => []`), ce qui signifie qu'aucune donnée réelle n'est chargée.
- **Filtrage partiel** : `FilteringEngine.js` implémente les filtres principaux, mais certains critères de taxonomie complexes définis dans `phase1_3_filtering_and_taxonomy_rules.md` pourraient manquer de profondeur dans l'implémentation actuelle (ex: gestion fine des catégories vs mécaniques).
- **Gestion des Erreurs UI** : Le composant `GameLibrary.js` affiche des messages d'erreur basiques, alors que les specs (`phase_6_1_edge_cases.md`) demandent des comportements plus spécifiques pour les cas limites.

### État de l'implémentation (Plan de Phase 8)
- Le projet en est actuellement à l'étape **5 ou 7** du plan d'implémentation (`phase_8_implementation_plan.md`). Les fondations (Domain, Repository, Filtering) sont là, mais la partie Admin UI et les services avancés (Selection Guide, Sorting) restent à faire.