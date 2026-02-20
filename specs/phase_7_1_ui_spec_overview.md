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
- **Visitor UI**: Responsive (desktop, tablet, mobile)
- **Admin UI**: Desktop and tablet only (no mobile phone support)

---

## User Roles

### Visitor

- Browses the game library
- Applies filters
- Views game cards
- Fully responsive experience

### Admin

- Manages the game library via session-based interface
- Adds, updates, archives, and restores games
- Reviews and edits pending changes in Session History
- Downloads Python script for persistence
- Desktop/tablet only (minimum width: 768px)

---

## Screen Inventory

### Visitor Screens

1. Game Library (responsive)
2. Filter Panel (embedded, responsive)
3. Game Detail (responsive)

---

### Admin Screens

1. Admin Dashboard (desktop/tablet only)
2. Game List with Session History Panel (desktop/tablet only)
3. Game Editor - Add/Edit (desktop/tablet only)
4. Archive Management (integrated in Game List)

---

## Navigation Rules

- Visitor and Admin areas are strictly separated
- No deep linking assumptions
- Navigation state must be reproducible on reload
- Admin session history persists across navigation (in memory or localStorage)

---

## Global UI States

Each screen must explicitly handle:

- Loading
- Empty
- Error
- Success

---

## Device Support Matrix

| Screen | Desktop | Tablet | Mobile |
|--------|---------|--------|--------|
| Game Library | ✓ | ✓ | ✓ |
| Game Detail | ✓ | ✓ | ✓ |
| Filter Panel | ✓ | ✓ | ✓ |
| Admin Dashboard | ✓ | ✓ | ✗ |
| Admin Game List | ✓ | ✓ | ✗ |
| Admin Game Editor | ✓ | ✓ | ✗ |
| Session History Panel | ✓ | ✓ | ✗ |

**Minimum width for Admin**: 768px

---

## Empty States

### Visitor — Empty Library

- Empty listing is displayed
- Nice to have:
  - friendly illustration
  - call-to-action redirecting to Admin UI

### Admin — Empty Session History

- Message: "Aucun changement en attente"
- Download button disabled

---

## Error Display Rules

- Domain errors are displayed using human-readable messages
- No raw technical messages
- Error type must be traceable for debugging

---

## Session History UI

### Purpose
Display all pending changes before script export.

### Features
- Chronological list of actions
- Edit button for form-based actions (ADD, UPDATE)
- Delete button for any action (revert)
- Clear all button (with confirmation)
- Download script button

### Visual Indicators
- Icons for action types
- Timestamps
- Game titles
- Summary of changes

---

## Out of Scope (Confirmed)

- Advanced mechanics mode toggle
- Similar games suggestions
- Sorting configuration UI
- Admin mobile phone support

---

## Invariants

- UI must not reimplement domain rules
- UI must not infer missing data
- UI behavior must be testable via mocked services
- Admin UI must not be accessible on screens < 768px wide

---

## Testability

- All screens testable with mocked services
- Each state independently testable
- Session history operations testable in isolation