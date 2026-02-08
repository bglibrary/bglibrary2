# Phase 7 — UI Specification: Admin Game List (7_4)

## Purpose
This document specifies the Admin Game List screen.

This screen allows administrators to view and manage all games.

---

## Data Sources

- GameRepository
  - `getAllGames(includeArchived=true)`

---

## Displayed Elements

- List of games (active and archived)
- Archived status indicator

---

## User Actions

- Navigate to Add Game
- Navigate to Edit Game
- Archive game
- Restore game
n
---

## Screen States

### Loading

- Display loading indicator

---

### Success

- Game list displayed

---

### Error

- Error message displayed

---

## Invariants

- Admin list always includes archived games
- No filtering or sorting beyond backend order

---

## Testability

- Screen testable with mocked repository and admin services

