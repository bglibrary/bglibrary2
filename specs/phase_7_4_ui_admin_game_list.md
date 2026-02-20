# Phase 7 — UI Specification: Admin Game List (7_4)

## Purpose
This document specifies the Admin Game List screen with session-based management.

This screen allows administrators to view all games and manage pending changes.

---

## Device Support

- **Desktop**: Full support (primary)
- **Tablet**: Full support (secondary)
- **Mobile**: Not supported (minimum width: 768px)

---

## Data Sources

- GameRepository
  - `getAllGames(includeArchived=true)`
- SessionHistory
  - `getActions()`
  - `getCount()`

---

## Layout Structure

### Desktop (≥1024px)
```
+------------------+------------------------+
|                  |                        |
|   Game List      |   Session History      |
|   (60%)          |   Panel (40%)          |
|                  |                        |
+------------------+------------------------+
|   Action Buttons (bottom)                 |
+-------------------------------------------+
```

### Tablet (768px-1023px)
```
+-------------------------------------------+
|   Session History Panel (collapsible)     |
+-------------------------------------------+
|                                           |
|   Game List                               |
|                                           |
+-------------------------------------------+
|   Action Buttons (bottom)                 |
+-------------------------------------------+
```

---

## Displayed Elements

### Game List Panel
- List of games (active and archived)
- Archived status indicator
- Quick actions per game:
  - Edit button
  - Archive/Restore button

### Session History Panel
- Chronological list of pending actions
- Each action shows:
  - Icon indicating action type
  - Timestamp
  - Game title and ID
  - Summary of changes
  - Edit button (for ADD/UPDATE actions)
  - Delete button (to revert)
- Empty state when no pending changes
- Total change count badge

### Action Buttons
- "Add Game" button (primary)
- "Download Update Script" button (disabled if no changes)
- "Clear Session" button (with confirmation, disabled if no changes)

---

## User Actions

### Game Management
- Navigate to Add Game form
- Navigate to Edit Game form
- Archive a game (adds ARCHIVE_GAME action)
- Restore a game (adds RESTORE_GAME action)

### Session Management
- View pending changes in Session History
- Edit a pending action (opens pre-filled form)
- Delete a pending action (removes from history)
- Clear all pending changes (with confirmation)
- Download Python script

---

## Screen States

### Loading
- Display loading indicator
- No partial data displayed

### Success — With Games
- Game list displayed
- Session history panel visible
- Action buttons enabled/disabled based on state

### Success — Empty Library
- Empty state message
- "Add your first game" prompt
- Session history panel empty

### Error
- Error message displayed
- Retry button available

---

## Session History Panel States

### Empty
- Message: "Aucun changement en attente"
- Icon or illustration
- Download button disabled

### With Changes
- List of actions (newest first or oldest first)
- Each action with edit/delete buttons
- Download button enabled
- Clear session button enabled

---

## Confirmation Dialogs

### Archive Game
- Title: "Archiver le jeu"
- Message: "Voulez-vous archiver « {title} » ?"
- Actions: Annuler / Archiver

### Restore Game
- Title: "Restaurer le jeu"
- Message: "Voulez-vous restaurer « {title} » ?"
- Actions: Annuler / Restaurer

### Delete Action
- Title: "Supprimer le changement"
- Message: "Voulez-vous supprimer ce changement de la session ?"
- Actions: Annuler / Supprimer

### Clear Session
- Title: "Effacer la session"
- Message: "Voulez-vous effacer tous les changements en attente ?"
- Actions: Annuler / Effacer

---

## Invariants

- Admin list always includes archived games
- Session history persists across page navigation (in memory or localStorage)
- Download script button is disabled when no pending changes
- All destructive actions require confirmation

---

## Testability

- Screen testable with mocked repository and session history service
- Each state independently testable
- Session history operations testable in isolation