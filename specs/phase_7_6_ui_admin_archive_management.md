# Phase 7 — UI Specification: Admin Archive Management (7_6)

## Purpose
This document specifies archive and restore interactions within the Admin UI with session-based management.

---

## Device Support

- **Desktop**: Full support (primary)
- **Tablet**: Full support (secondary)
- **Mobile**: Not supported (minimum width: 768px)

---

## Data Sources

- SessionHistory
  - `addAction(type, payload)`
  - `getActions()`

---

## User Actions

### Archive a Game
1. Admin clicks "Archive" button on a game in the list
2. Confirmation dialog appears
3. On confirm:
   - `SessionHistory.addAction('ARCHIVE_GAME', { gameId, gameTitle })`
   - Action appears in Session History Panel
   - Game remains visible in list (changes not applied until script execution)

### Restore a Game
1. Admin clicks "Restore" button on an archived game
2. Confirmation dialog appears
3. On confirm:
   - `SessionHistory.addAction('RESTORE_GAME', { gameId, gameTitle })`
   - Action appears in Session History Panel

---

## Confirmation Dialogs

### Archive Confirmation
- **Title**: "Archiver le jeu"
- **Message**: "Voulez-vous archiver « {title} » ? Le jeu ne sera plus visible pour les visiteurs."
- **Actions**: Annuler / Archiver

### Restore Confirmation
- **Title**: "Restaurer le jeu"
- **Message**: "Voulez-vous restaurer « {title} » ? Le jeu redeviendra visible pour les visiteurs."
- **Actions**: Annuler / Restaurer

---

## Session History Integration

### Archive Action Entry
```json
{
  "id": "action-001",
  "type": "ARCHIVE_GAME",
  "timestamp": "2026-02-20T21:42:00Z",
  "gameId": "old-game",
  "payload": null,
  "summary": "Archiver: Old Game"
}
```

### Restore Action Entry
```json
{
  "id": "action-002",
  "type": "RESTORE_GAME",
  "timestamp": "2026-02-20T21:45:00Z",
  "gameId": "old-game",
  "payload": null,
  "summary": "Restaurer: Old Game"
}
```

---

## Visual Indicators

### In Game List
- Archived games show "Archivé" badge
- Active games show no badge
- Archive/Restore button toggles based on current state

### In Session History
- ARCHIVE_GAME actions show archive icon
- RESTORE_GAME actions show restore icon
- Both can be deleted from history (reverted)

---

## Edge Cases

### Archive Already Archived Game
- If an ARCHIVE_GAME action already exists for the game in session history:
  - Show warning: "Ce jeu a déjà une action d'archivage en attente"
  - Option to delete the existing action first

### Restore Non-Archived Game
- If a RESTORE_GAME action exists for a non-archived game:
  - Show warning: "Ce jeu n'est pas archivé"
  - Option to delete the existing action first

### Conflicting Actions
- If both ARCHIVE_GAME and RESTORE_GAME exist for same game:
  - Show warning in Session History Panel
  - Admin must resolve by deleting one

---

## Screen States

### Idle
- Awaiting admin action
- Archive/Restore buttons enabled

### Processing
- Action being added to session history
- Button shows loading state

### Success
- Action added to session history
- Session History Panel updated
- Toast notification: "Action ajoutée à la session"

### Error
- Error displayed
- User can retry

---

## Invariants

- No destructive action without confirmation
- Archive/Restore actions are always added to session history (not applied immediately)
- Actions can be deleted from history before script execution
- Multiple actions for same game are allowed (admin must resolve conflicts)

---

## Testability

- Actions testable with mocked SessionHistory service
- Confirmation dialogs testable in isolation
- Edge cases testable with pre-populated session history