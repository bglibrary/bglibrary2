# Phase 7 — UI Specification: Admin Archive Management (7_6)

## Purpose
This document specifies archive and restore interactions within the Admin UI.

---

## Data Sources

- AdminGameService
  - `archiveGame()`
  - `restoreGame()`

---

## User Actions

- Archive a game
- Restore a game

---

## Confirmation Rules

- Archive and restore actions require explicit confirmation

---

## Screen States

### Idle

- Awaiting admin action

---

### Processing

- Action in progress

---

### Success

- Game status updated in Admin Game List

---

### Error

- Error displayed

---

## Invariants

- No destructive action without confirmation
- Archived games remain editable only via restore

---

## Testability

- Actions testable with mocked AdminGameService

