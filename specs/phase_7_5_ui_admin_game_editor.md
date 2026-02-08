# Phase 7 — UI Specification: Admin Game Editor (7_5)

## Purpose
This document specifies the Admin Game Editor screen.

This screen is used to add or update a game.

---

## Data Sources

- AdminGameService
  - `addGame()`
  - `updateGame()`
- ImageAssetManager

---

## Displayed Elements

- Full game form (all mandatory and optional fields)
- Image upload control
- Image metadata inputs

---

## User Actions

- Submit game
- Cancel edition

---

## Validation Rules

- Client-side validation mirrors domain constraints
- Final validation delegated to AdminGameService

---

## Screen States

### Editing

- Form editable

---

### Submitting

- Submission in progress

---

### Success

- Redirect to Admin Game List

---

### Error

- Validation or persistence error displayed

---

## Invariants

- No partial updates
- UI must not bypass service validation

---

## Testability

- Screen testable with mocked services

