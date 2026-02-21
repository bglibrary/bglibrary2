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

### Image Reference

- `primaryImage: ImageDescriptor | null`
  - Reference to the primary image for display
  - Contains `id` field for constructing image path: `/images/{id}.jpg`
  - Used by shared `GameCard` component

---

## Image Display Rules

- **Format**: Square (aspect-ratio 1:1)
- **Fit**: `object-contain` to preserve proportions without cropping
- **Fallback**: Display "Pas d'image" placeholder when `primaryImage` is null
- **Shared Component**: `src/components/common/GameCard.js` exports:
  - `GameCard`: Base card component
  - `GameImage`: Reusable image component with square format

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

