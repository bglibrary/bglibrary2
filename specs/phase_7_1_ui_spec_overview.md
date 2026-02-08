# Phase 7 — UI Specification Overview (7_1)

## Purpose
This phase specifies the user interface of the application.

UI specifications define:
- screens and navigation
- visible states and transitions
- user-triggered actions

No business logic, domain rules, or persistence logic is introduced here.

---

## Design Principles

- UI is a pure consumer of Phase 5 contracts
- No implicit behavior
- All states are explicit
- Errors are surfaced verbatim from service contracts
- UI must be responsive (desktop, tablet, mobile)

---

## User Roles

### Visitor

- Browses the game library
- Applies filters
- Views game cards

### Admin

- Manages the game library
- Adds, updates, archives, and restores games
- Uploads images and metadata

---

## Screen Inventory

### Visitor Screens

1. Game Library
2. Filter Panel (embedded)
3. Game Detail

---

### Admin Screens

1. Admin Dashboard
2. Game List (admin view)
3. Game Editor (add / edit)
4. Archive Management

---

## Navigation Rules

- Visitor and Admin areas are strictly separated
- No deep linking assumptions
- Navigation state must be reproducible on reload

---

## Global UI States

Each screen must explicitly handle:

- Loading
- Empty
- Error
- Success

---

## Empty States

### Visitor — Empty Library

- Empty listing is displayed
- Nice to have:
  - friendly illustration
  - call-to-action redirecting to Admin UI

---

## Error Display Rules

- Domain errors are displayed using human-readable messages
- No raw technical messages
- Error type must be traceable for debugging

---

## Out of Scope (Confirmed)

- Advanced mechanics mode toggle
- Similar games suggestions
- Sorting configuration UI

---

## Invariants

- UI must not reimplement domain rules
- UI must not infer missing data
- UI behavior must be testable via mocked services

