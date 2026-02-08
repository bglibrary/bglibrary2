# Phase 4 — Component Spec: FilteringEngine

## Role
The FilteringEngine applies deterministic filtering rules to a list of games based on explicit user-selected criteria.

It is a pure domain component with no knowledge of persistence, UI, or user context.

---

## Responsibilities

- Apply filtering rules defined in `phase1_3_filtering_and_taxonomy_rules.md`
- Combine multiple filters deterministically
- Return a filtered subset of the input list

---

## Non-Responsibilities

- Loading games from storage
- Enforcing archive visibility rules
- Sorting results
- Scoring or recommendation
- Mapping to view models

---

## Inputs

- `games: Game[]`
  - List of **already visible** games
- `filters: FilterSet`
  - Explicit filter selections from the UI

The engine must assume that all games provided are valid and visible.

---

## Outputs

- `Game[]`
  - Subset of the input list
  - Order must be preserved

---

## Filtering Rules

### Global Rules
- Filters across different filter types are combined using logical **AND**
- Behavior within a filter type depends on its nature

### Numeric / Range Filters
Examples:
- Number of players
- First play complexity

Rule:
- A game must satisfy all numeric constraints

---

### Categorical Multi-Value Filters
Examples:
- Categories
- Mechanics
- Play duration

Rule:
- Selected values within the same filter are combined using **OR**
- Different filters are combined using **AND**

---

### Boolean Filters
Examples:
- Favorite
- Has awards

Rule:
- Simple on/off behavior
- Always combined using **AND**

---

## Invariants

- The engine must never mutate the input list or game objects
- The same inputs must always produce the same outputs
- No game outside the input list may appear in the output

---

## Anti-Corruption Rules

- The engine must not interpret missing filter values
- No default filters may be assumed
- UI-specific concepts (labels, display buckets) must not leak into this component

---

## Error Handling

- Invalid filter definitions must result in explicit errors
- Silent fallback behavior is forbidden

---

## Test Strategy

### Unit Tests

- Single numeric filter
- Multiple numeric filters (AND)
- Single categorical filter with multiple values (OR)
- Multiple categorical filters (AND across filters)
- Boolean filters on/off
- Combination of numeric, categorical, and boolean filters

### Invariant Tests

- Input list remains unchanged
- Output order matches input order

### Negative Tests

- Empty game list
- Empty filter set
- Invalid filter values

All tests must be executable without repository, UI, or network dependencies.

