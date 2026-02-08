# Phase 4 — Component Spec: SortingEngine

## Role
The SortingEngine applies deterministic ordering rules to a list of games.

It operates exclusively on already filtered and visible game lists and never alters the list content itself.

---

## Responsibilities

- Apply a single, explicit sort mode to a list of games
- Return the same list ordered according to the selected rule

---

## Non-Responsibilities

- Filtering games
- Scoring or recommendation logic
- Loading data
- Mapping to view models
- Enforcing archive visibility

---

## Inputs

- `games: Game[]`
  - List of visible, already filtered games
- `sortMode: SortMode`
  - One explicit sort mode selected by the user

---

## Outputs

- `Game[]`
  - Same games, ordered according to the sort mode

---

## Supported Sort Modes

Sorting modes must be explicitly enumerated. Examples:

- `PLAY_DURATION_ASC`
- `PLAY_DURATION_DESC`
- `FIRST_PLAY_COMPLEXITY_ASC`
- `FIRST_PLAY_COMPLEXITY_DESC`

No implicit or dynamic sort modes are allowed.

---

## Sorting Rules

- Sorting must be stable
- Games with missing values for the selected criterion must be ordered last
- No secondary implicit sort key may be applied

---

## Invariants

- The engine must not add or remove games
- The input list must not be mutated
- Same inputs must always produce the same ordering

---

## Anti-Corruption Rules

- UI labels or localized strings must not leak into this component
- Sorting must not depend on presentation concerns
- No default sort mode may be assumed

---

## Error Handling

- Unsupported sort modes must produce explicit errors
- Silent fallback to a default ordering is forbidden

---

## Test Strategy

### Unit Tests

- Ascending and descending duration sorting
- Ascending and descending first play complexity sorting
- Stability with equal values
- Games with missing sort keys

### Invariant Tests

- Input list immutability
- Output list contains the same elements

### Negative Tests

- Empty game list
- Unsupported sort mode

All tests must be executable without repository, UI, or network dependencies.

