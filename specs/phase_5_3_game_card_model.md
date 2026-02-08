# Phase 5 — Data Contract: GameCard Model

## Purpose
This document defines the GameCard view model used for list and summary displays.

It is a projection of the Game domain model with strictly limited scope.

---

## GameCard

### Mandatory Fields

- `id: string`
- `title: string`
- `playerCount: string`
- `playDuration: PlayDuration`

---

### Optional Indicators

- `hasAwards: boolean`
- `isFavorite: boolean`

---

## Explicit Exclusions

The GameCard must not include:
- Description text
- First play complexity
- Categories or mechanics
- Images metadata beyond the primary image reference
- Any admin-only metadata

---

## Mapping Rules

- `playerCount` must be a preformatted domain-derived value
- Indicators are boolean-only; no counts or labels

---

## Invariants

- One GameCard maps to exactly one Game
- Mapping is deterministic
- No hidden or computed business logic

---

## Anti-Corruption Rules

- UI formatting (icons, colors, labels) must not appear in this contract
- Localization must not appear in this contract

---

## Error Conditions

- Missing mandatory fields in source Game
- Invalid domain reference

Errors must be explicit and typed.

