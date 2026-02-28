# Phase 7 — UI Specification: Visitor Game Detail (7_3)

## Purpose
This document specifies the Visitor Game Detail screen.

This screen displays detailed information for a single game.

---

## Data Sources

- GameRepository
  - `getGameById(id)`

---

## Displayed Elements

- Game title
- **Main image** (square format, aspect-ratio 1:1)
  - Uses `object-contain` to preserve image proportions without cropping
  - Centered within the modal header
  - **Shared Component**: Uses `GameImage` from `src/components/common/GameCard.js`
- Player count range
- Play duration
- First play complexity
- Categories
- Mechanics
- Description

All displayed data must come from the Game domain model.

---

## Dark Mode Support

The Game Detail Modal fully supports dark mode by using CSS variables defined in `globals.css`:

- **Modal container**: Uses `bg-card` class (adapts to dark mode via CSS variable)
- **Close button**: Uses `bg-card/80` class with proper transparency
- **Favorite badge**: Uses `bg-card/90` class
- **Text colors**: Uses `text-text-primary` and `text-text-secondary` classes
- **Borders**: Uses `border-border` class
- **Chips (categories/mechanics)**: Uses `chip` class with `bg-card` background

All components automatically switch colors when the `.dark` class is applied to the HTML element.

---

## User Actions

- Navigate back to Game Library

---

## Screen States

### Loading

- Display loading indicator

---

### Success

- All game details are displayed

---

### Error

- Game not found
- Access to archived game

---

## Navigation

- Accessed from Game Library only

---

## Invariants

- UI must not enrich or reinterpret domain data
- Archived games are never displayed

---

## Testability

- Screen testable with mocked GameRepository

