# Phase 3.1 — Component Overview

## Purpose
This document defines the full component decomposition of the system. Each component has a single, explicit responsibility and is designed to be implementable and testable in isolation.

This phase does **not** define implementations. It establishes contracts, boundaries, and ownership.

---

## Component Inventory

### Visitor-Facing Components

#### 1. GameRepository
**Responsibility**
- Load game data from the data layer
- Enforce archive visibility rules
- Expose read-only access to games

**Notes**
- Central entry point for all game reads
- Does not apply filtering or sorting logic

---

#### 2. FilteringEngine
**Responsibility**
- Apply filtering rules defined in `phase1_3_filtering_and_taxonomy_rules.md`
- Combine filters deterministically

**Notes**
- Stateless and pure
- No knowledge of archive status

---

#### 3. SortingEngine (optionnal - not MVP)
**Responsibility**
- Apply explicit ordering rules to a list of games

**Notes**
- Limited to predefined sort modes
- No filtering or scoring

---

#### 4. SelectionGuide (optionnal - not MVP)
**Responsibility**
- Provide deterministic guidance to help choose a game
- Apply explicit exclusion and scoring rules

**Notes**
- Explainable output required
- No learning or adaptive behavior

---

#### 5. GameCardMapper
**Responsibility**
- Map Game domain objects to GameCard view models
- Enforce summary display rules

**Notes**
- Must respect GameCard display constraints
- No business logic

---

### Admin-Facing Components

#### 6. AdminGameService
**Responsibility**
- Orchestrate add, update, archive, and restore operations
- Validate admin inputs at a functional level

**Notes**
- No UI concerns
- Delegates persistence to infrastructure services

---

#### 7. ArchiveManager
**Responsibility**
- Manage archived vs active game separation
- Guarantee archived data is never lost

**Notes**
- Archive rules enforced consistently

---

### Infrastructure / Cross-Cutting Components

#### 8. GitService (Contract)
**Responsibility**
- Encapsulate all GitHub interactions
- Provide a stable interface for persistence

**Notes**
- Must be replaceable without impacting other components

---

#### 9. ImageAssetManager
**Responsibility**
- Validate image assets
- Handle attribution metadata
- Define storage conventions

---

## Planned Component Spec Documents

```
phase3_components/
├── game_repository.md
├── filtering_engine.md
├── sorting_engine.md
├── selection_guide.md
├── game_card_mapper.md
├── admin_game_service.md
├── archive_manager.md
├── git_service_contract.md
├── image_asset_manager.md
```

---

## Reference Component

- **Reference spec:** `phase3_2_ref_spec_game_repository.md`
- Rationale:
  - Central to all read paths
  - Clarifies archive and visibility rules
  - Defines boundaries with filtering and sorting

