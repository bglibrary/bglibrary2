# Phase 7 — UI Specification: Visitor Game Library (7_2)

## Purpose
This document specifies the Visitor Game Library screen.

This screen is the primary entry point for visitors and displays the list of available games.

---

## Data Sources

- GameRepository
  - `getAllGames()`
- FilteringEngine
  - `applyFilters()`

All data must conform strictly to Phase 5 contracts.

---

## Displayed Elements

### Game List

- List of GameCard items
- Only non-archived games are displayed
- Stable order (as provided by backend)
- **Shared Component**: Uses `GameCard` from `src/components/common/GameCard.js`

### Game Card Image

- **Square format** (aspect-ratio 1:1)
- Uses `object-contain` to preserve image proportions without cropping
- Suitable for both landscape and portrait game box images
- No image cropping or distortion

### Filter Panel

- **Compact horizontal layout** on a single line
- **Filter chips with dropdown menus**:
  - Each chip shows filter label and selected value(s)
  - Clicking opens a dropdown menu to select values
  - Multi-select support for duration and complexity filters
  - Single-select for player count
- **Boolean toggle chips** for awards and favorites
- **Sort dropdown** integrated in the filter line
- **Clear all** button appears when filters are active
- Active filters highlighted with primary color

---

## User Actions

- View game list
- Apply filters
- Clear filters

---

## Screen States

### Loading

- Display loading indicator
- No partial data displayed

---

### Success — Non Empty

- Game cards are displayed
- Filter panel is enabled

---

### Success — Empty Result

- No game cards are displayed
- Filter panel remains visible

---

### Error

- Error message displayed
- No game cards displayed

---

## Error Handling Rules

- Errors are displayed using mapped, human-readable messages
- Error type must be traceable for debugging

---

## Navigation

- Selecting a game card navigates to Game Detail screen

---

## Invariants

- UI must not infer or compute domain data
- UI must not re-order games
- UI must not cache stale results

---

## Anti-Corruption Rules

- UI filter controls must not introduce additional semantics
- UI must not compensate for invalid backend data

---

## Testability

- Screen can be tested with mocked GameRepository and FilteringEngine
- Each state must be independently testable

