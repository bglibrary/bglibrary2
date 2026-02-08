# Phase 4 — Component Spec: GameCardMapper

## Role
The GameCardMapper transforms a full Game domain object into a lightweight GameCard view model suitable for list and summary displays.

It acts as a strict boundary between domain data and UI representation.

---

## Responsibilities

- Map Game domain objects to GameCard view models
- Enforce GameCard display rules defined in `phase1_3_filtering_and_taxonomy_rules.md`
- Ensure consistent summary data across all list views

---

## Non-Responsibilities

- Filtering or sorting games
- Loading data
- Enforcing archive visibility
- Applying business rules
- Rendering UI components

---

## Inputs

- `game: Game`
  - A single visible game domain object

---

## Outputs

- `GameCard`
  - A summarized, UI-ready representation

---

## Mapping Rules

The GameCard must include:
- Title
- Player count
- Play duration
- Award indicator (boolean or count)
- Favorite indicator (if applicable)

The GameCard must explicitly exclude:
- First Play Complexity
- Long descriptions
- Internal or admin-only metadata

---

## Invariants

- Mapping must be deterministic
- No domain data mutation is allowed
- Output must not contain fields not explicitly listed

---

## Anti-Corruption Rules

- UI-specific formatting (icons, labels, localization) must not leak into this component
- Domain enums must not be transformed into display strings here
- Any change in GameCard content must update this spec first

---

## Error Handling

- Missing mandatory fields must result in explicit errors
- Silent field omission is forbidden

---

## Test Strategy

### Unit Tests

- Complete mapping of a valid Game
- Exclusion of forbidden fields
- Award indicator presence/absence
- Favorite indicator mapping

### Invariant Tests

- Deterministic output for identical input
- Input object immutability

### Negative Tests

- Game with missing mandatory fields

All tests must be executable without UI, repository, or network dependencies.

