# Phase 8 — Comprehensive Implementation Plan (Detailed for Developer Handover)

## Purpose
This document defines an extremely detailed, step-by-step implementation plan for the MVP, ensuring strict adherence to all specifications. Each step is designed to be a logical milestone composed of atomic, testable commits. This plan aims to be prescriptive enough for any developer to follow without extensive prior context, covering all user functionalities and initial data setup.

---

## Global Implementation Rules
- **Atomic Commits**: Each commit must address a single, isolated concern. Minimal diff, minimal files.
- **Test-Driven Development**: Write tests *before* or concurrently with the feature implementation. Tests must be part of the same commit.
- **Specification-First**: Every implemented feature, component, or data contract must have a corresponding, up-to-date specification in the `specs/` directory.
- **Clear Separation of Concerns**: Isolate domain logic, UI components, and infrastructure code (persistence, API calls) into their respective modules/layers. Avoid mixing concerns within files or components.
- **No Speculative Implementation**: Only implement features explicitly required by the current step and the MVP scope.
- **Error Handling**: Implement explicit, typed error handling at all layers, as per `phase_5_6_git_service_errors.md` and `phase_6_1_edge_cases.md`.
- **Documentation**: Inline comments and JSDoc should be used for all public interfaces, complex logic, and critical decisions.

---

## Initial Setup: Dummy Games for Testing
**Goal**: Provide a minimal dataset for immediate UI testing and feature validation.

### Step 0.1 — Create Dummy Game Data
- **Action**: Create two JSON files in a new directory `data/games/`.
  - `data/games/catan.json`:
    ```json
    {
      "id": "catan",
      "title": "Catan",
      "description": "Un jeu de développement et de commerce de colonies.",
      "minPlayers": 3,
      "maxPlayers": 4,
      "playDuration": "MEDIUM",
      "ageRecommendation": "10+",
      "firstPlayComplexity": "MEDIUM",
      "categories": ["Stratégie", "Négociation"],
      "mechanics": ["Jet de dés", "Collecte de ressources", "Construction de routes"],
      "awards": [
        { "name": "Spiel des Jahres", "year": 1995 }
      ],
      "favorite": true,
      "archived": false,
      "images": [
        { "id": "catan-main", "source": "publisher", "attribution": "Klaus Teuber" }
      ]
    }
    ```
  - `data/games/azul.json`:
    ```json
    {
      "id": "azul",
      "title": "Azul",
      "description": "Les artisans des carreaux d\u0027Azulejo embellissent les murs du Palais Royal de Evora.",
      "minPlayers": 2,
      "maxPlayers": 4,
      "playDuration": "MEDIUM",
      "ageRecommendation": "8+",
      "firstPlayComplexity": "LOW",
      "categories": ["Abstrait", "Famille"],
      "mechanics": ["Draft", "Pattern Building"],
      "awards": [
        { "name": "Spiel des Jahres", "year": 2018 }
      ],
      "favorite": false,
      "archived": false,
      "images": [
        { "id": "azul-main", "source": "publisher", "attribution": "Michael Kiesling" }
      ]
    }
    ```
- **Rationale**: These files will serve as the initial in-memory dataset for `GameRepository`, allowing immediate testing of UI and logic without needing a full GitHub integration. They ensure the recipe testing at the end of implementation has a concrete base.
- **Acceptance**: Files `data/games/catan.json` and `data/games/azul.json` exist and are valid JSON.

---

## Step 1 — Project Foundation & Tooling
**Goal**: Environment ready for development with enforced standards.

### 1.1 — Initialize Next.js Project and Styling
- **Action**: Create a new Next.js project. Install and configure Tailwind CSS. Ensure `next.config.js` is set for static export (`output: \\\\u0027export\\\\u0027`).
- **Files to Modify/Create**: `package.json`, `next.config.js`, `tailwind.config.js`, `postcss.config.js`, `globals.css` (for Tailwind directives).
- **Rationale**: Establishes the core frontend framework and styling utility, adhering to `phase2_1_tech_stack.md`.
- **Acceptance**: Run `npm run dev` and confirm a basic Next.js page renders with Tailwind styles applied.

### 1.2 — Configure Test Frameworks
- **Action**: Install and configure Jest for unit and integration testing. Set up basic test scripts in `package.json`.
- **Files to Modify/Create**: `package.json`, `jest.config.js`.
- **Rationale**: Enables test-driven development as per global rules.
- **Acceptance**: `npm test` runs without errors, even if no tests exist yet.

### 1.3 — Linting and Code Formatting
- **Action**: Install and configure ESLint and Prettier. Define strict rules for code quality and consistency (e.g., Airbnb style guide).
- **Files to Modify/Create**: `.eslintrc.json`, `.prettierrc.json`, `.prettierignore`.
- **Rationale**: Enforces code quality and maintainability, aligning with `phase1_2_constraints.md`.
- **Acceptance**: Running `npm run lint` and `npm run format` (or equivalent) finds no issues and formats files correctly.

### 1.4 — Global CSS and Layout
- **Action**: Define base typography, colors, and responsive breakpoints using Tailwind CSS utilities. Create a basic `_app.js` and `_document.js` for global layout.
- **Files to Modify/Create**: `pages/_app.js`, `pages/_document.js`, `globals.css`.
- **Rationale**: Establishes a consistent and responsive UI foundation for the entire application, prioritizing mobile-first design as per `phase0_project_brief.md`.
- **Acceptance**: Global styles are applied, and the base layout is consistent across different screen sizes.

---

## Step 2 — Core Domain & Validation Layer
**Goal**: Stable and validated data structures for games, awards, and images.

### 2.1 — Define Domain Types (Enums and Constants)
- **Action**: Implement all controlled vocabularies and enumerations.
  - `PlayDuration` (SHORT, MEDIUM, LONG)
  - `FirstPlayComplexity` (LOW, MEDIUM, HIGH)
  - `AgeRange` (e.g., "8+", "10+", "12+")
  - `AwardNames` (e.g., "Spiel des Jahres", "Golden Geek")
  - `Categories` (e.g., "Stratégie", "Famille", "Abstrait")
  - `Mechanics` (e.g., "Jet de dés", "Draft", "Placement d\\\\u0027ouvriers")
- **Files to Modify/Create**: `src/domain/types.js`.
- **Rationale**: Centralizes all domain-specific constants and enums, ensuring consistency across the application as per `phase_5_2_game_domain_model.md`.
- **Acceptance**: `src/domain/types.js` exports all required enumerations.

### 2.2 — Implement Domain Validation Errors
- **Action**: Create a module for explicit, typed validation errors that can be thrown by domain objects.
- **Files to Modify/Create**: `src/domain/validationErrors.js` (e.g., `missingMandatoryField`, `invalidEnumValue`, `invalidPlayerRange`).
- **Rationale**: Adheres to the principle of explicit error handling from `phase_5_2_game_domain_model.md` and `phase_6_1_edge_cases.md`.
- **Acceptance**: `src/domain/validationErrors.js` exports functions to create distinct error objects.

### 2.3 — Implement Game Domain Entity & Factory
- **Action**: Implement the `Game` domain entity, including a factory function (`createGame`) and a validation function (`validateGame`). This function must enforce all invariants defined in `phase_5_2_game_domain_model.md` (e.g., `minPlayers <= maxPlayers`, `images.length >= 1`). It should use the types and errors defined in steps 2.1 and 2.2.
- **Files to Modify/Create**: `src/domain/Game.js`.
- **Rationale**: Establishes the core data model and its integrity rules.
- **Acceptance**: Unit tests for `src/domain/Game.js` cover all validation scenarios (valid game, missing title, invalid player range, empty images, etc.), achieving 100% coverage on validation logic.

---

## Step 3 — Infrastructure: Persistence Contract (GitService)
**Goal**: Abstract the data persistence layer using a Git-based approach.

### 3.1 — Define GitService Interface Contract
- **Action**: Define the `GitService` interface as described in `phase_4_7_git_service_contract.md`. This interface will include `addGame`, `updateGame`, `archiveGame`, `restoreGame` methods.
- **Files to Modify/Create**: `src/infrastructure/GitServiceContract.js`.
- **Rationale**: Ensures modularity and allows for swapping out the underlying persistence mechanism without affecting higher layers, adhering to `phase2_2_architecture.md`.
- **Acceptance**: `src/infrastructure/GitServiceContract.js` clearly defines the async methods and their expected parameters.

### 3.2 — Implement Persistence Error Contracts
- **Action**: Create explicit error types for persistence operations (e.g., `AuthenticationError`, `WriteConflict`, `RepositoryUnavailable`, `InvalidPath`). These should be distinct from domain errors.
- **Files to Modify/Create**: `src/infrastructure/persistenceErrors.js`.
- **Rationale**: Provides clear and traceable error messages from the infrastructure layer, as required by `phase_5_6_git_service_errors.md`.
- **Acceptance**: `src/infrastructure/persistenceErrors.js` exports all required error factory functions.

### 3.3 — Implement Mock GitService (Local File System)
- **Action**: Create an initial mock implementation of `GitService` that simulates file operations on the local file system. `addGame` would create a new JSON file, `updateGame` would overwrite, and `archiveGame` would modify the `archived` flag in the JSON. This mock *will not* interact with GitHub.
- **Files to Modify/Create**: `src/infrastructure/FileGitService.js`.
- **Rationale**: Allows for rapid iteration and testing of `AdminGameService` and `GameRepository` without requiring a live GitHub connection, as discussed in the project brief.
- **Acceptance**: Unit tests for `src/infrastructure/FileGitService.js` (or similar mock) confirm atomic commit simulation (e.g., file creation, update, deletion, ensuring no partial writes).

---

## Step 4 — Game Repository (Read Layer)
**Goal**: Provide a consistent and secure read interface for game data.

### 4.1 — Implement GameRepository Read Methods
- **Action**: Implement the `GameRepository` class/module. Its core methods are `getAllGames(context)` and `getGameById(id, context)`. 
  - `getAllGames(\"visitor\")` must *exclude* games where `archived: true`.
  - `getAllGames(\"admin\")` must return *all* games (active and archived).
  - `getGameById(id, \"visitor\")` must throw an error if the game is found but `archived: true`.
  - `getGameById(id, \"admin\")` must return the game regardless of archive status.
- **Dependency**: Uses the local file system to load game JSONs from `data/games/` (or a similar mock).
- **Files to Modify/Create**: `src/repository/GameRepository.js`.
- **Rationale**: Centralizes all read access and enforces critical visibility rules as per `phase_3_2_ref_spec_game_repository.md`.
- **Acceptance**: Unit tests for `src/repository/GameRepository.js` cover all visibility rules and error cases (game not found, archived game for visitor).

### 4.2 — Implement Repository Specific Errors
- **Action**: Create explicit, typed error types for repository operations (e.g., `GameNotFound`, `GameArchivedNotVisible`, `DataLoadFailure`).
- **Files to Modify/Create**: `src/repository/repositoryErrors.js`.
- **Rationale**: Ensures clear communication of data access issues to higher layers.
- **Acceptance**: `src/repository/repositoryErrors.js` exports all required error factory functions.

---

## Step 5 — Logic Engines: Filtering & Sorting
**Goal**: Provide robust and deterministic logic for game discovery.

### 5.1 — Implement FilteringEngine
- **Action**: Implement `FilteringEngine` as a pure, stateless function. It must apply logical AND across different filter types (e.g., `playerCount` AND `categories`) and logical OR within multi-value filters (e.g., `category1` OR `category2`). Handle numeric ranges (player count), categorical (play duration, complexity, categories, mechanics), and boolean (favorite, has awards) filters.
- **Files to Modify/Create**: `src/filtering/FilteringEngine.js`, `src/filtering/filterTypes.js` (for `FilterSet` contract), `src/filtering/filteringErrors.js`.
- **Rationale**: Implements core discovery logic as specified in `phase_4_1_filtering_engine.md` and `phase1_3_filtering_and_taxonomy_rules.md`.
- **Acceptance**: Unit tests for `src/filtering/FilteringEngine.js` cover all filter combinations, empty filter sets, zero results, and invalid filter values.

### 5.2 — Implement SortingEngine
- **Action**: Implement `SortingEngine` as a pure, stateless function. It must apply a single, explicit sort mode (`PLAY_DURATION_ASC`, `PLAY_DURATION_DESC`, `FIRST_PLAY_COMPLEXITY_ASC`, `FIRST_PLAY_COMPLEXITY_DESC`). Sorting must be stable, and games with `null` or `undefined` values for the sort criterion must always be ordered last.
- **Files to Modify/Create**: `src/filtering/SortingEngine.js`, `src/filtering/sortingTypes.js` (for `SortMode` enum), `src/filtering/sortingErrors.js`.
- **Rationale**: Provides deterministic ordering, as detailed in `phase_4_2_sorting_engine.md`.
- **Acceptance**: Unit tests for `src/filtering/SortingEngine.js` verify ascending/descending sorts, stability, and correct handling of null values.

### 5.3 — Implement GameCardMapper
- **Action**: Implement `GameCardMapper` to transform `Game` domain objects into lightweight `GameCard` view models. This mapping must include `id`, `title`, `playerCount` (formatted as string, e.g., "2-4 joueurs"), `playDuration`, `hasAwards` (boolean), and `isFavorite` (boolean). It must explicitly exclude `description`, `firstPlayComplexity`, `categories`, `mechanics`, and other admin-only metadata, as per `phase_5_3_game_card_model.md`.
- **Files to Modify/Create**: `src/mapper/GameCardMapper.js`.
- **Rationale**: Creates a strict boundary between the domain model and the UI, ensuring only necessary data is exposed to the presentation layer.
- **Acceptance**: Unit tests for `src/mapper/GameCardMapper.js` confirm correct mapping and exclusion of forbidden fields.

---

## Step 6 — Visitor UI: Discovery Flow
**Goal**: Deliver a responsive and intuitive browsing experience for visitors. All user-facing functionalities from `phase1_1_functional_scope.md` should be present and tested.

### 6.1 — Implement Responsive GameCard Component
- **Action**: Create the `GameCard` React component (`components/GameCard.js`). It should display: 
  - `title` (game title).
  - Formatted `playerCount` (e.g., "2-4 joueurs").
  - `playDuration` (e.g., "MEDIUM").
  - Visual indicators for `hasAwards` (e.g., a small icon) and `isFavorite` (e.g., a heart icon). 
- **Styling**: Implement responsive styling using Tailwind CSS to adapt layout and font sizes for mobile (portrait and landscape), tablet, and desktop views.
- **Files to Modify/Create**: `components/GameCard.js`.
- **Rationale**: Provides a consistent and visually appealing summary for each game, adhering to `phase_7_2_ui_visitor_game_library.md` and `phase1_3_filtering_and_taxonomy_rules.md` (Game Summary Rules).
- **Acceptance**: Visual inspection on various device emulators confirms responsiveness and correct display of game summary data.

### 6.2 — Implement FilterPanel Component
- **Action**: Create the `FilterPanel` React component (`components/FilterPanel.js`). It must include interactive UI controls for all filtering criteria specified in `phase1_1_functional_scope.md` and `phase1_3_filtering_and_taxonomy_rules.md`:
  - **Player Count**: Dropdown/sliders using predefined buckets (e.g., 1, 2, 3-4, 5, 6+).
  - **Play Duration**: Checkboxes/radio buttons for SHORT, MEDIUM, LONG.
  - **First Play Complexity**: Checkboxes/radio buttons for LOW, MEDIUM, HIGH.
  - **Categories/Mechanics**: Multi-select dropdowns/checkboxes based on `src/domain/types.js`.
  - **Has Awards**: Checkbox.
  - **Favorite Only**: Checkbox.
  - **Sort Mode**: Dropdown with options for play duration and complexity (ASC/DESC).
- **Functionality**: Implement logic to emit `onFiltersChange(newFilters)` and `onSortChange(newSortMode)` events to its parent component (`GameLibrary`) with the updated state. Include a "Clear Filters" button.
- **Files to Modify/Create**: `components/FilterPanel.js`.
- **Rationale**: Provides the interactive filtering and sorting interface as required by `phase1_3_filtering_and_taxonomy_rules.md` and `phase_7_2_ui_visitor_game_library.md`.
- **Acceptance**: Manual testing confirms all filter/sort controls are present and emit correct values. UI styling is responsive, and "Clear Filters" resets the panel.

### 6.3 — Implement Game Library Page (`pages/index.js`)
- **Action**: Implement the main `GameLibrary` page. This page will: 
  - Fetch `rawGames` from `GameRepository` (using `useEffect` for initial load and `context: "visitor"`).
  - Manage local `filters` and `sortMode` state using `useState`.
  - Use `useMemo` to efficiently apply `FilteringEngine` and `SortingEngine` to `rawGames`, then map results using `GameCardMapper`. This memoized output will be the `displayedGames`.
  - Pass `filters`, `sortMode`, `onFiltersChange` (for filters reset) and `onSortChange` to `FilterPanel`.
  - Render a list of `GameCard` components (`components/GameCard.js`).
  - Implement loading, empty results (`Aucun jeu.`), and error states (`Erreur : ...`) gracefully, adhering to `phase_7_2_ui_visitor_game_library.md`.
- **Files to Modify/Create**: `pages/index.js`, `components/GameLibrary.js` (main component, if it encapsulates the logic).
- **Rationale**: Orchestrates the entire visitor discovery experience, ensuring performance, responsiveness, and clear state feedback as per `phase_7_2_ui_visitor_game_library.md`.
- **Acceptance**: 
  - Access `http://localhost:3000` (or deployed URL). Both "Catan" and "Azul" should be visible initially.
  - Apply filters (e.g., "3-4 joueurs") and observe only "Catan" remaining. Clear filters should return both.
  - Apply sorting (e.g., "Durée croissante" or "Complexité croissante") and observe correct ordering.
  - Verify loading messages appear briefly, and empty result messages are displayed correctly when filters yield no games.

### 6.4 — Implement Game Detail Page (`pages/game/[id].js`)
- **Action**: Implement the `GameDetail` page (`pages/game/[id].js`). This page will:
  - Use Next.js dynamic routing to fetch a single game by `id` from `GameRepository` (using `context: "visitor"`). Handle cases where the game is not found or is archived (redirect or error message).
  - Display: `title`, `main image` (using a simple `<img>` tag for now; advanced image handling comes later), `player count range`, `play duration`, `first play complexity`, `categories` (as a list), `mechanics` (as a list), `description`, and `awards` (list of `name` and `year`).
  - Implement responsive layout (`components/GameDetail.js` if componentized) for mobile, tablet, and desktop views.
  - Include a "Retour à la bibliothèque" link/button.
  - Handle loading and error states (e.g., "Jeu non trouvé" or "Accès refusé").
- **Files to Modify/Create**: `pages/game/[id].js` (and potentially `components/GameDetail.js`).
- **Rationale**: Provides detailed information for a specific game, as required by `phase_7_3_ui_visitor_game_detail.md`.
- **Acceptance**: 
  - Navigate to `http://localhost:3000/game/catan` and `http://localhost:3000/game/azul`. Verify all details are displayed correctly.
  - Attempt to navigate to a non-existent game (`/game/unknown`) or an archived game (once archiving is implemented in Admin UI). Verify appropriate error messages or redirects.

---

## Step 7 — Admin Infrastructure: Image Asset Management
**Goal**: Secure and validated handling of image files and their metadata.

### 7.1 — Implement Image Asset Validation Logic
- **Action**: Implement `ImageAssetManager` with validation rules:
  - Supported formats (`image/jpeg`, `image/png`, `image/webp`).
  - Maximum size (e.g., 5MB, configurable via `MAX_SIZE_BYTES`).
  - Mandatory `attribution` metadata (configurable via `REQUIRE_ATTRIBUTION`).
  - Generation of stable `id` for images from filename.
- **Files to Modify/Create**: `src/images/ImageAssetManager.js`.
- **Rationale**: Enforces image-related constraints independently from UI or persistence, as per `phase_4_8_image_asset_manager.md`.
- **Acceptance**: Unit tests for `src/images/ImageAssetManager.js` confirm valid images are accepted, and invalid formats/sizes/metadata are rejected with specific errors.

### 7.2 — Implement Image Asset Errors
- **Action**: Create explicit, typed error types for image validation failures (e.g., `UnsupportedImageFormat`, `ImageTooLarge`, `MissingAttributionMetadata`, `CorruptedImage`).
- **Files to Modify/Create**: `src/images/imageAssetErrors.js`.
- **Rationale**: Provides clear error reporting for image-related issues.
- **Acceptance**: `src/images/imageAssetErrors.js` exports all required error factory functions.

---

## Step 8 — Admin Core Services
**Goal**: Orchestrate game lifecycle management (add, update, archive, restore).

### 8.1 — Implement ArchiveManager
- **Action**: Implement `ArchiveManager` as a pure, stateless function. It should provide `archiveGame(game)` and `restoreGame(game)` functions that deterministically modify the `archived` flag of a `Game` object. It must enforce rules like preventing re-archiving an already archived game or restoring an active game, throwing appropriate typed errors.
- **Files to Modify/Create**: `src/admin/ArchiveManager.js`, `src/admin/archiveErrors.js`.
- **Rationale**: Centralizes archive logic, ensuring data integrity and consistency as per `phase_4_6_archive_manager.md`.
- **Acceptance**: Unit tests for `src/admin/ArchiveManager.js` cover all valid and invalid state transitions.

### 8.2 — Implement AdminGameService
- **Action**: Implement `AdminGameService` which orchestrates `add`, `update`, `archive`, and `restore` operations. It will: 
  - Use `createGame` and `validateGame` from `src/domain/Game.js` for input validation.
  - Interact with `GameRepository` (for existence checks) and `ArchiveManager` (for archive/restore logic).
  - Delegate actual persistence (file writes, image uploads, commit creation) to `GitService`.
  - Map all underlying errors (domain, repository, infrastructure) to appropriate `AdminServiceError` types.
- **Files to Modify/Create**: `src/admin/AdminGameService.js`, `src/admin/adminServiceErrors.js`.
- **Rationale**: Provides a consistent and secure API for all administrative game operations, adhering to `phase_4_5_admin_game_service.md`.
- **Acceptance**: Unit and integration tests for `src/admin/AdminGameService.js` confirm successful end-to-end admin operations and correct error handling, even with mocked `GitService`.

---

## Step 9 — Admin UI: Library Management
**Goal**: Provide a frictionless interface for the owner to manage the game library.

### 9.1 — Implement Admin Game List Page (`pages/admin/index.js`)
- **Action**: Create the `AdminGameListPage` (`pages/admin/index.js`). This page will: 
  - Fetch all games (including archived) from `GameRepository` (using `context: "admin"`).
  - Display a table or list of games with columns for `title`, `minPlayers`, `maxPlayers`, `playDuration`, `firstPlayComplexity`, `favorite` status, `archived` status.
  - Include buttons/links to: "Add New Game", "Edit Game" (`/admin/edit-game/[id]`), "Archive Game" (for active games), "Restore Game" (for archived games).
  - Integrate `ConfirmationDialog` for "Archive" and "Restore" actions.
  - Implement loading and error states.
- **Files to Modify/Create**: `pages/admin/index.js` (and potentially `components/admin/GameAdminList.js`).
- **Rationale**: Provides the core interface for the owner to view and initiate management actions, as per `phase_7_4_ui_admin_game_list.md` and `phase_7_6_ui_admin_archive_management.md`.
- **Acceptance**: 
  - Navigate to `http://localhost:3000/admin`. Both "Catan" (favorite, active) and "Azul" (not favorite, active) should be visible.
  - Click "Archive Game" for "Azul", confirm, and observe its status change to archived (and it disappears from visitor view).
  - Click "Restore Game" for "Azul", confirm, and observe its status change back to active.

### 9.2 — Implement Confirmation Dialog Component
- **Action**: Create a generic, accessible `ConfirmationDialog` React component (`components/admin/ConfirmationDialog.js`). It should accept `title`, `message`, `onConfirm`, `onCancel`, and `isOpen` props. Use it to wrap destructive actions (archive, restore).
- **Files to Modify/Create**: `components/admin/ConfirmationDialog.js`.
- **Rationale**: Ensures that critical administrative actions require explicit user confirmation, preventing accidental data changes, as per `phase_7_6_ui_admin_archive_management.md`.
- **Acceptance**: Confirming or canceling the dialog correctly triggers `onConfirm` or `onCancel` respectively.

---

## Step 10 — Admin UI: Game Editor & Persistence
**Goal**: Enable the owner to add and update game information and persist changes.

### 10.1 — Implement Admin Game Editor Form
- **Action**: Create the `AdminGameEditor` page (`pages/admin/add-game.js` and `pages/admin/edit-game/[id].js`). This will be a single React form component (or two pages using a shared component). The form must include inputs for *all* `Game` domain fields:
  - `id` (read-only for edit, generated/input for add)
  - `title`, `description` (text inputs)
  - `minPlayers`, `maxPlayers` (number inputs, with validation `min <= max`)
  - `playDuration`, `ageRecommendation`, `firstPlayComplexity` (dropdowns using `src/domain/types.js`)
  - `categories`, `mechanics` (multi-select inputs using `src/domain/types.js`)
  - `awards` (dynamic list, each with `name` and optional `year`)
  - `favorite` (checkbox)
  - **Image Upload**: A file input for images. When a file is selected, pass it to `ImageAssetManager` for client-side validation and display a preview. Include inputs for `source` and `attribution` metadata for each image.
- **Functionality**: Implement client-side validation that mirrors `src/domain/Game.js` validation rules. Display error messages next to relevant fields. On submission, call `AdminGameService.addGame` or `AdminGameService.updateGame`.
- **Files to Modify/Create**: `pages/admin/add-game.js`, `pages/admin/edit-game/[id].js`, `components/admin/GameForm.js` (if a shared component is used).
- **Rationale**: Provides the full CRUD interface for games, adhering to `phase_7_5_ui_admin_game_editor.md`.
- **Acceptance**: 
  - Navigate to `/admin/add-game`. Fill out a new game form, including image upload and attribution. Submit and verify the game appears in the admin list and is visible to visitors.
  - Navigate to `/admin/edit-game/catan`. Modify a field (e.g., description), save, and verify the change in the detail view.
  - Test client-side validation: submit with missing mandatory fields or invalid player ranges. Verify error messages are displayed.

### 10.2 — Integrate Real GitService (GitHub API)
- **Action**: Replace the mock `FileGitService` with a real implementation that interacts with the GitHub API (e.g., using `octokit/rest.js` or `@octokit/graphql`). This implementation will:
  - Create/update JSON files in the repository.
  - Upload images as separate assets.
  - Create structured Git commits for each admin action.
  - Handle GitHub authentication (e.g., via environment variables for a Personal Access Token).
- **Files to Modify/Create**: `src/infrastructure/GitHubGitService.js`, `pages/api/admin/*.js` (Next.js API routes to wrap GitHub calls).
- **Rationale**: Fulfills the 