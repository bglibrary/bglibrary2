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

### Header
- Title "Notre Ludothèque"
- **Search bar**: Text input to filter games by name (local filtering)
- **+ Add Game button**: Primary action
- **History toggle button**: Icon button to show/hide Session History Panel

### Main Area
```
+--------------------------------------------------+
| Header: Title | Search | + Add | History toggle |
+--------------------------------------------------+
|                                    |              |
|   Game Grid                        |  Session     |
|   (filtered by search)             |  History     |
|                                    |  Panel       |
|   Cards with icon-only actions:    |  (hidden     |
|   - Pencil (edit)                  |   by         |
|   - Archive/Restore                |   default)   |
|   - Heart (toggle favorite)        |              |
|                                    |              |
+--------------------------------------------------+
```

### Session History Panel
- **Visibility**: Hidden by default, toggled via header button
- **Position**: Right side panel (slides in)
- **Width**: ~40% on desktop, full width overlay on tablet

---

## Displayed Elements

### Header Components
- **Search bar**: 
  - Placeholder: "Rechercher un jeu..."
  - Local text filtering (no backend)
  - Debounce: 300ms
- **+ Add Game button**: Primary styled button
- **History toggle button**: 
  - Icon button (history/list icon)
  - Badge showing pending change count (if any)

### View Mode Toggle
- **Grid view** (default): Shows game cards with images and details
- **List view**: Simplified view showing only title and action buttons
- Toggle buttons in header: ⊞ (grid) / ☰ (list)

### Game Grid (Grid View)
- Grid of game cards (3-4 columns on desktop, 2 on tablet)
- Filtered by search text (game title)
- **Shared Component**: Uses `GameCard` from `src/components/common/GameCard.js`
- Cards include:
  - **Square image** (aspect-ratio 1:1)
    - Uses `object-contain` to preserve image proportions without cropping
    - Suitable for both landscape and portrait game box images
  - Title
  - Player count
  - Duration
  - Award badge (if exists)
  - Favorite heart (if true)
  - Archived badge (if archived)
  - **Icon-only action buttons at bottom**:
    - Pencil (edit)
    - Archive/Restore
    - Heart (toggle favorite)

### Game List (List View)
- Simplified list rows showing:
  - Title (with archived indicator if applicable)
  - Action buttons only (edit, archive/restore, toggle favorite)
- No thumbnail, player count, or other metadata displayed
- Designed for quick administrative actions on multiple games

### Session History Panel
- **Header**: "Changements en attente" with close button
- **Content**: Chronological list of pending actions
- Each action shows:
  - Icon indicating action type
  - Timestamp (relative or absolute)
  - Game title and ID
  - Summary of changes
  - Edit button (for ADD/UPDATE actions)
  - Delete button (to revert)
- **Footer**:
  - "Download Update Script" button (disabled if no changes)
  - "Clear Session" button (with confirmation, disabled if no changes)

---

## User Actions

### Search
- Type in search bar to filter games by title
- Filtering is local (no API call)
- Empty search shows all games

### Game Management
- Click card to view game details (optional)
- Click **pencil icon** to edit game (opens edit form)
- Click **archive/restore icon** to archive or restore game
- Click **heart icon** to toggle favorite status

### Session Management
- Click **history toggle** to show/hide Session History Panel
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
- Game grid displayed
- Search bar functional
- History toggle available

### Success — Empty Library
- Empty state message
- "Add your first game" prompt
- Search bar disabled

### Success — No Search Results
- Message: "Aucun jeu trouvé pour « {search} »"
- Clear search button

### Error
- Error message displayed
- Retry button available

---

## Session History Panel States

### Hidden (Default)
- Panel not visible
- History toggle shows badge with change count (if any)

### Visible — Empty
- Message: "Aucun changement en attente"
- Icon or illustration
- Download button disabled

### Visible — With Changes
- List of actions (newest first)
- Each action with edit/delete buttons
- Download button enabled
- Clear session button enabled

---

## Icon-Only Action Buttons

Each game card has three icon-only action buttons at the bottom:

| Icon | Action | Behavior |
|------|--------|----------|
| Pencil | Edit | Opens edit form for the game |
| Archive/Restore | Archive/Restore | Adds ARCHIVE_GAME or RESTORE_GAME action to session |
| Heart | Toggle Favorite | Adds TOGGLE_FAVORITE action to session |

**Important**: Icons must be understandable without tooltips.

---

## Confirmation Dialogs

### Toggle Favorite
- No confirmation needed (quick action)
- Toast notification: "Favori mis à jour"

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
- Session History Panel is hidden by default
- Download script button is disabled when no pending changes
- All destructive actions require confirmation (except toggle favorite)
- Search is local text filtering only (no backend)

---

## Testability

- Screen testable with mocked repository and session history service
- Each state independently testable
- Session history operations testable in isolation
- Search filtering testable in isolation