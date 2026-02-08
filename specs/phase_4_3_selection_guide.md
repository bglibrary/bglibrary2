# Phase 4 — Component Spec: SelectionGuide

## Role
The SelectionGuide provides deterministic and explainable guidance to help users choose a board game based on their current constraints.

It does not recommend by learning or personalization. It applies explicit rules to reduce or rank a candidate set.

---

## Responsibilities

- Accept explicit user constraints (players, time, etc.)
- Reduce and/or rank a list of candidate games
- Produce an explainable result

---

## Non-Responsibilities

- Loading games
- Enforcing archive visibility
- Persisting user choices
- Learning from past behavior
- UI rendering

---

## Inputs

- `games: Game[]`
  - List of visible games
- `constraints: SelectionConstraints`
  - Explicit user-provided constraints

Constraints may include:
- Number of players
- Available time
- Preference flags (e.g. favorite-first)

---

## Outputs

- `SelectionResult`
  - `selectedGames: Game[]`
  - `explanations: Explanation[]`

Explanations must explicitly reference applied rules.

---

## Selection Logic

The SelectionGuide operates in two conceptual steps:

1. **Eligibility filtering**
   - Remove games that cannot satisfy hard constraints
2. **Optional ranking**
   - Apply simple, explicit scoring rules

No probabilistic or adaptive logic is allowed.

---

## Explainability Rules

- Every exclusion must be justifiable by a rule
- Every ranking must expose its criteria
- Explanations must be deterministic and reproducible

---

## Invariants

- Same inputs must always produce the same outputs
- No game outside the input list may appear in results
- No hidden or implicit constraints

---

## Anti-Corruption Rules

- UI phrasing must not leak into explanations
- No fuzzy or subjective language in logic
- Domain rules must not be hard-coded in UI components

---

## Error Handling

- Invalid constraint definitions must produce explicit errors
- Partial constraint sets must be accepted without assumption

---

## Test Strategy

### Unit Tests

- Single hard constraint exclusion
- Multiple hard constraints combined
- Ranking with explicit scoring
- Explainability content validation

### Invariant Tests

- Determinism across multiple runs
- Input list immutability

### Negative Tests

- Empty game list
- Impossible constraints

All tests must be executable without repository, UI, or network dependencies.

