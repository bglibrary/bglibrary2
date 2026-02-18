# Repository Map

*Auto-generated on 2026-02-13 19:52:37*

---

# Repository Overview

Personal board game library application.

**Repository Root:** `2026`

# Tech Stack

**Languages:** JavaScript

**Key Dependencies/Frameworks:**
- jest
- next
- react
- react-dom

# Project Structure

- `.github/` — Unknown
- `components/` — Unknown
- `pages/` — Unknown
- `specs/` — Documentation/Specifications
- `src/` — Source Code
- `tests/` — Tests
- `.github/workflows/` — Unknown
- `pages/admin/` — Unknown
- `pages/game/` — Unknown
- `src/admin/` — Source Code
- `src/domain/` — Source Code
- `src/filtering/` — Source Code
- `src/images/` — Source Code
- `src/mapper/` — Source Code
- `src/repository/` — Source Code
- `tests/admin/` — Tests
- `tests/domain/` — Tests
- `tests/filtering/` — Tests
- `tests/images/` — Tests
- `tests/mapper/` — Tests
- `tests/repository/` — Tests
- `pages/admin/edit-game/` — Unknown

# Entry Points

No explicit entry points detected.

# Modules


## `components`

**Location:** `components`

**Key Files:** 3 file(s)

**Functions:** FilterPanel, GameCard, GameLibrary, handleFiltersChange

**External Dependencies:** next, react

## `pages`

**Location:** `pages`

**Key Files:** 2 file(s)

**Functions:** App, Home, loadGames

## `pages.admin`

**Location:** `pages/admin`

**Key Files:** 2 file(s)

**Functions:** AddGamePage, handleSubmit, loadGames, AdminGameListPage, handleArchive, handleRestore

**External Dependencies:** next, react

## `pages.admin.edit-game`

**Location:** `pages/admin/edit-game`

**Key Files:** 1 file(s)

**Functions:** EditGamePage, handleSubmit

**External Dependencies:** next, react

## `pages.game`

**Location:** `pages/game`

**Key Files:** 1 file(s)

**Functions:** GameDetailPage, loadGames

**External Dependencies:** next, react

## `root`

**Location:** `.`

**Key Files:** 1 file(s)

## `src.admin`

**Location:** `src/admin`

**Key Files:** 5 file(s)

**Functions:** createAdminGameService, addGame, updateGame, archiveGameById, restoreGameById, gameAlreadyArchived, gameNotArchived, missingArchiveFlag, createInMemoryStore, getDefaultStore
 _(+7 more)_

## `src.domain`

**Location:** `src/domain`

**Key Files:** 3 file(s)

**Functions:** requireString, requireNumber, requireEnum, validateAwards, validateImages, validateStringArray, validateGame, createGame, missingMandatoryField, invalidEnumValue
 _(+2 more)_

## `src.filtering`

**Location:** `src/filtering`

**Key Files:** 3 file(s)

**Functions:** emptyFilterValues, invalidFilterValue, validateFilters, applyFilters, matchesAll

## `src.images`

**Location:** `src/images`

**Key Files:** 2 file(s)

**Functions:** generateImageId, validateImage, unsupportedImageFormat, imageTooLarge, missingMandatoryImage, missingAttributionMetadata, corruptedImage

## `src.mapper`

**Location:** `src/mapper`

**Key Files:** 1 file(s)

**Functions:** formatPlayerCount, mapGameToCard

## `src.repository`

**Location:** `src/repository`

**Key Files:** 2 file(s)

**Functions:** createGameRepository, getAllGames, getGameById, gameNotFound, gameArchivedNotVisible, dataLoadFailure

## `tests`

**Location:** `tests`

**Key Files:** 1 file(s)

## `tests.admin`

**Location:** `tests/admin`

**Key Files:** 2 file(s)

**Functions:** game, validGame, createInMemoryStore

## `tests.domain`

**Location:** `tests/domain`

**Key Files:** 1 file(s)

**Functions:** validGameOverrides

## `tests.filtering`

**Location:** `tests/filtering`

**Key Files:** 1 file(s)

**Functions:** game

## `tests.images`

**Location:** `tests/images`

**Key Files:** 1 file(s)

**Functions:** validImageFile

## `tests.mapper`

**Location:** `tests/mapper`

**Key Files:** 1 file(s)

**Functions:** game

## `tests.repository`

**Location:** `tests/repository`

**Key Files:** 1 file(s)

**Functions:** validGame

# Public Interfaces


## components

**Exports:** FilterPanel, GameCard, GameLibrary

## pages

**Exports:** App, Home

## pages.admin

**Exports:** AddGamePage, AdminGameListPage

## pages.admin.edit-game

**Exports:** EditGamePage

## pages.game

**Exports:** GameDetailPage

# Data Layer

No data models detected.

# Cross-Cutting Concerns


## Testing

tests, tests.repository, tests.images, tests.filtering, tests.admin

# Specification Coverage


**Specification Files Found:** 34
- `README.md`
- `specs/phase_5_6_git_service_errors.md`
- `specs/phase_8_implementation_plan.md`
- `specs/phase_3_1_component_overview.md`
- `specs/phase_4_2_sorting_engine.md`
- `specs/phase_4_7_git_service_contract.md`
- `specs/phase_7_6_ui_admin_archive_management.md`
- `specs/phase_7_5_ui_admin_game_editor.md`
- `specs/phase1_2_constraints.md`
- `specs/.DS_Store`

**Note:** Detailed spec-to-implementation mapping requires manual review.

# Known Unclear Areas

- **19 modules lack documentation**
- **Many modules have no explicit public API** (14 modules)
- **No clear application entry points detected**

**Recommendation:** Review modules marked as 'Unknown' purpose and undocumented code.