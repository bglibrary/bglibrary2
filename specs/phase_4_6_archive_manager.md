# Phase 4 — Component Spec: ArchiveManager

## Role
The ArchiveManager is responsible for managing the archived vs active state of games.

It defines and enforces the rules governing archiving, restoration, and archival integrity.

---

## Responsibilities

- Mark games as archived
- Restore archived games
- Guarantee non-loss of archived data
- Provide archive state transitions to AdminGameService

---

## Non-Responsibilities

- Loading games for visitor browsing
- Filtering or sorting games
- Persisting data directly
- UI rendering or admin workflows

---

## Inputs

- `game: Game`
- `archiveAction: Archive | Restore`

---

## Outputs

- Updated `Game` with modified archive state
- No persistence side effects

---

## Archive Rules

- Archiving a game must not delete or modify any non-archive fields
- Restoring a game must re-enable full visibility
- Re-archiving an already archived game is forbidden
- Restoring a non-archived game is forbidden

---

## Invariants

- Archived data must remain bit-identical (except archive flag)
- Archive state transitions are explicit and one-way per operation
- No implicit archive or restore behavior

---

## Anti-Corruption Rules

- Persistence concerns (file paths, commits) must not leak into this component
- Visitor visibility logic must not be re-implemented here

---

## Error Handling

- Invalid state transition (archive already archived game, restore active game)
- Missing archive flag

Errors must be explicit and typed.

---

## Test Strategy

### Unit Tests

- Archive active game
- Restore archived game
- Reject double archive
- Reject invalid restore

### Invariant Tests

- Data integrity before and after archive
- No mutation of non-archive fields

### Negative Tests

- Game without archive flag
- Null or malformed game input

All tests must be executable without repository, UI, or network dependencies.

