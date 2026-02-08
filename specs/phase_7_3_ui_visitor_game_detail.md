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
- Main image
- Player count range
- Play duration
- First play complexity
- Categories
- Mechanics
- Description

All displayed data must come from the Game domain model.

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

