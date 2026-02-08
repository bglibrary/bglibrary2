# Phase 6 — Acceptance Criteria

## Purpose
This document defines the acceptance criteria for the MVP.

Each criterion must be testable, deterministic, and traceable to the functional scope.

---

## Global Acceptance Criteria

### System Startup

- System starts with an empty or populated library
- No runtime error occurs during initial load

---

### Empty Library (MVP)

- Visitor views render without errors
- No game cards are displayed

---

### Empty Library (Nice to Have)

- UI displays a friendly illustration
- UI invites the user to access the admin interface
- UI provides a clear call-to-action to add a first game

This behavior is explicitly excluded from MVP.

---

## Game Listing

- Only non-archived games are listed
- Games are displayed using GameCard model only
- Order is stable and deterministic

---

## Filtering

- Filters apply using logical AND
- Invalid filter values are rejected
- Empty filter set returns all non-archived games
- Zero-result filtering is handled gracefully

---

## Game Details Access

- Game details are accessible for existing, non-archived games
- Access to archived games is forbidden in visitor context

---

## Admin — Add Game

- Admin can add a valid game
- Mandatory fields are enforced
- Mandatory image is enforced
- Game becomes visible in visitor listing

---

## Admin — Update Game

- Admin can update an existing game
- Full replacement is enforced
- Partial updates are rejected
n
---

## Admin — Archive / Restore

- Archived games are hidden from visitor views
- Restored games reappear in listings

---

## Image Handling

- Only validated images are accepted
- Invalid images produce typed errors

---

## Persistence

- All write operations are atomic
- Failed writes leave no partial state

---

## Error Handling

- All errors are explicit and typed
- No raw infrastructure error is exposed

---

## MVP Exclusions (Confirmed)

- Sorting configuration
- Selection guide component
- Advanced mechanics / expert mode
- Similar game suggestions
- Concurrent admin sessions

---

## Invariants

- All acceptance criteria must be automatable
- No UI-dependent logic is required to validate MVP correctness

