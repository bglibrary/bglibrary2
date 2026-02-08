# Phase 3.2 — Reference Component Spec: GameRepository

## Role
The GameRepository is the single authoritative read-access component for game data.

It is responsible for loading games from the data layer and enforcing visibility rules, especially regarding archived games.

---

## Responsibilities

- Load all game records from the data source
- Distinguish between active and archived games
- Expose read-only access methods
- Enforce visibility rules based on caller context

---

## Non-Responsibilities

- Filtering or sorting games
- Scoring or recommendation logic
- Mapping to UI-specific models
- Persisting or mutating data

---

## Data Model Assumptions

Each game record includes at minimum:
- `id`
- `archived: boolean`
- Full game metadata as defined in Phase 1

Archived games are stored alongside active games but flagged explicitly.

---

## Public Interface

### Read Methods

- `getAllGames(context)`
  - Returns all **non-archived** games for visitor context
  - Returns all games (including archived) for admin context

- `getGameById(id, context)`
  - Returns the game if visible in the given context
  - Returns an error if the game is archived and context is visitor

Context is an explicit parameter and must never be inferred implicitly.

---

## Visibility Rules

- Archived games:
  - Must never be returned to visitors
  - Must remain accessible to the admin
- No partial visibility is allowed
- Visibility rules are enforced exclusively here

---

## Error Handling

The repository must return explicit, typed errors:
- Game not found
- Game archived and not visible in current context
- Data loading failure

Silent failures are forbidden.

---

## Determinism & Guarantees

- Same inputs must always produce the same outputs
- Ordering of returned lists is undefined and must not be relied upon
- No side effects

---

## Test Strategy

### Unit Tests

- Loading active games only
- Excluding archived games for visitor context
- Including archived games for admin context
- Accessing archived game by ID as admin
- Rejecting archived game access as visitor
- Handling missing game IDs

### Contract Tests

- Verify that filtering and sorting components receive only visible games
- Ensure no archived game can leak through public paths

### Negative Tests

- Corrupted data file
- Missing archive flag
- Empty data set

All tests must be executable without any UI or network dependency.

---

## Open Questions

None at this stage. Any change to archive behavior requires updating this spec first.

