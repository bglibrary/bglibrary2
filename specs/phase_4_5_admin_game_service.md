# Phase 4 — Component Spec: AdminGameService

## Role
The AdminGameService orchestrates all administrative operations on games.

It acts as the single application-level entry point for creating, updating, archiving, and restoring games, while delegating persistence to infrastructure services.

---

## Responsibilities

- Validate admin-provided game data
- Orchestrate add, update, archive, and restore workflows
- Coordinate with ArchiveManager and GitService
- Guarantee consistency of admin operations

---

## Non-Responsibilities

- UI form handling
- Direct GitHub or storage interactions
- Rendering or routing concerns
- Read-only access for visitors

---

## Inputs

- `GameData`
  - Full game definition as provided by the admin UI
- `AdminAction`
  - One of: add, update, archive, restore

---

## Outputs

- Operation result (success or explicit error)
- No game data is returned to the caller

---

## Supported Operations

### Add Game

- Validate mandatory fields
- Ensure game ID uniqueness
- Persist game as active

### Update Game

- Validate mandatory fields
- Ensure target game exists
- Update game data atomically

### Archive Game

- Ensure target game exists
- Mark game as archived
- Preserve all game data

### Restore Game

- Ensure target game exists and is archived
- Restore game to active state

---

## Validation Rules

- Mandatory fields must be present
- Controlled vocabularies must be respected
- Images must be validated via ImageAssetManager
- Partial updates are forbidden

---

## Invariants

- Admin operations must be atomic
- No operation may leave the system in an inconsistent state
- Archived data must never be overwritten or deleted

---

## Anti-Corruption Rules

- Git-specific concepts (commits, branches, tokens) must not leak into this component
- UI-specific validation (field-level UX) must not be implemented here
- Persistence format (JSON vs Markdown) must remain opaque

---

## Error Handling

- Invalid input data
- Game not found
- Duplicate game ID
- Persistence failure

All errors must be explicit and typed.

---

## Test Strategy

### Unit Tests

- Add valid game
- Reject invalid game data
- Update existing game
- Reject update of non-existing game
- Archive and restore workflows

### Invariant Tests

- No partial persistence on failure
- Archived game data preservation

### Negative Tests

- Duplicate IDs
- Invalid controlled vocabulary values

All tests must be executable without UI or real GitHub dependencies.

