# Phase 8 — Comprehensive Implementation Plan (Session-Based Admin)

## Purpose
This document defines an extremely detailed, step-by-step implementation plan for the MVP, ensuring strict adherence to the simplified session-based admin model. This approach eliminates the need for a backend by historizing changes within the browser session and providing a Python script for bulk updates and Git commits.

---

## Global Implementation Rules
- **Atomic Commits**: Each commit must address a single, isolated concern.
- **Test-Driven Development**: Write tests concurrently with feature implementation.
- **Simplified Admin**: No backend required. Admin actions are saved in a local session history.
- **Python-Based Persistence**: A generated Python script handles data/games modifications and Git operations.
- **Responsive Visitor, Desktop/Tablet Admin**: The admin interface is optimized for tablet/desktop usage only (no mobile phone support required).

---

## Session-Based Admin Architecture

### Core Concept
The admin interface operates entirely in-memory during a browser session. All changes are tracked in a `SessionHistory` object that can be:
- **Reviewed**: Display a chronological list of all pending changes
- **Edited**: Modify form-based changes before finalization
- **Deleted**: Revert individual changes by removing them from history
- **Exported**: Generate a Python script to apply all changes to the repository

### Session Lifecycle
1. **Session Start**: Admin opens the admin interface
2. **Session Active**: Admin performs add/update/archive/restore operations
3. **Session Review**: Admin reviews the history, edits or deletes entries as needed
4. **Session Export**: Admin downloads the generated Python script
5. **Session End**: Admin closes the browser tab (session data is lost if not exported)
6. **Script Execution**: Admin runs the Python script locally at repo root

### Persistence Strategy
- **localStorage**: Optional persistence for session recovery across page reloads
- **No Backend**: All data remains in the browser until script export
- **No Authentication**: Admin access is not protected (static site assumption)

---

## Initial Setup: Dummy Games for Testing
**Goal**: Provide a minimal dataset for immediate UI testing and feature validation.

### Step 0.1 — Create Dummy Game Data
- **Action**: Create two JSON files in `data/games/`.
  - `data/games/catan.json`
  - `data/games/azul.json`
- **Acceptance**: Files exist and are valid JSON.

---

## Step 1 — Project Foundation & Tooling
**Goal**: Environment ready for development with enforced standards.

### 1.1 — Initialize Next.js Project (Static Mode)
- **Action**: Configure `next.config.js` for `output: 'export'`.
- **Rationale**: Ensures the site remains fully static.

### 1.2 — Configure Test Frameworks (Jest)
- **Action**: Set up Jest for unit and integration testing.

---

## Step 2 — Core Domain & Validation Layer
**Goal**: Stable and validated data structures for games, awards, and images.

### 2.1 — Implement Game Domain Entity & Factory
- **Action**: Implement `src/domain/Game.js` with factory and validation.
- **Acceptance**: Unit tests cover all validation scenarios.

---

## Step 3 — Infrastructure: Session-Based Admin Service
**Goal**: Implement the admin logic that tracks changes within a session.

### 3.1 — Define SessionHistory Interface
- **Action**: Create `src/admin/SessionHistory.js`.
- **Interface**:
  ```javascript
  class SessionHistory {
    constructor()
    
    // Get all actions in chronological order
    getActions(): Action[]
    
    // Add a new action to the history
    addAction(type: ActionType, payload: object): number // returns index
    
    // Remove an action by index (revert)
    removeAction(index: number): void
    
    // Edit an existing action's payload
    editAction(index: number, newPayload: object): void
    
    // Clear all actions
    clearAll(): void
    
    // Get action count
    getCount(): number
    
    // Check if session has any changes
    hasChanges(): boolean
    
    // Persist to localStorage (optional)
    saveToStorage(): void
    
    // Restore from localStorage (optional)
    loadFromStorage(): void
    
    // Generate Python script
    generatePythonScript(): string
  }
  ```

### 3.2 — Define Action Types
- **Action Types**:
  - `ADD_GAME`: Add a new game
  - `UPDATE_GAME`: Update an existing game
  - `ARCHIVE_GAME`: Archive a game
  - `RESTORE_GAME`: Restore an archived game
  - `DELETE_GAME`: Permanently delete a game (optional, use with caution)

### 3.3 — Action Structure
```javascript
{
  id: string,           // unique action identifier
  type: ActionType,     // type of action
  timestamp: string,    // ISO 8601 timestamp
  gameId: string,       // target game ID
  payload: object,      // action-specific data
  summary: string       // human-readable summary for UI display
}
```

### 3.4 — Implement Action History Tracking
- **Action**: The service must store a chronological list of all modifications made during the session.
- **Rationale**: Allows the admin to follow, edit, and delete changes before finalization.
- **UI Integration**: The history panel displays each action with:
  - Timestamp
  - Action type (translated to French)
  - Game ID and title
  - Summary of changes
  - Edit button (for form-based actions)
  - Delete button (to revert the action)

---

## Step 4 — Game Repository (Read Layer)
**Goal**: Provide a consistent read interface for game data.

### 4.1 — Implement GameRepository Read Methods
- **Action**: Implement `src/repository/GameRepository.js`.
- **Note**: In a static site, this loads from the static JSON files served by the site.
- **Methods**:
  - `getAllGames(includeArchived = false)`
  - `getGameById(id)`
  - `gameExists(id)`

---

## Step 5 — Logic Engines: Filtering & Sorting
**Goal**: Provide robust and deterministic logic for game discovery.

### 5.1 — Implement FilteringEngine & SortingEngine
- **Action**: Implement pure, stateless engines as previously specified.

---

## Step 6 — Visitor UI: Discovery Flow
**Goal**: Deliver a responsive and intuitive browsing experience for visitors.

### 6.1 — Implement Responsive GameCard & FilterPanel
- **Action**: Build visitor-facing components with mobile-first Tailwind styling.
- **Note**: Visitor UI must remain fully responsive (mobile, tablet, desktop).

---

## Step 7 — Admin UI: Simplified Session Management
**Goal**: Provide a desktop/tablet compatible interface for session-based management.

### 7.1 — Admin Layout Requirements
- **Device Support**: Desktop and tablet only (minimum width: 768px)
- **Not Responsive for Mobile**: No mobile phone optimization required
- **Layout**: Two-column layout on desktop, single column on tablet

### 7.2 — Implement Admin Session Dashboard
- **Action**: Create `pages/admin/index.js`.
- **Components**:
  - **Game List Panel**: Display all games (active and archived)
  - **Session History Panel**: Display pending changes with edit/delete options
  - **Action Buttons**: 
    - "Add Game" button
    - "Download Update Script" button (disabled if no changes)
    - "Clear Session" button (with confirmation)

### 7.3 — Implement Session History Panel
- **Action**: Create `components/admin/SessionHistoryPanel.js`.
- **Features**:
  - Chronological list of all pending actions
  - Each entry shows:
    - Icon indicating action type
    - Timestamp (relative or absolute)
    - Game title and ID
    - Summary of changes
    - Edit button (opens pre-filled form for UPDATE actions)
    - Delete button (removes action from history)
  - Empty state message when no changes
  - Total change count indicator

### 7.4 — Implement Admin Game Editor
- **Action**: Create forms for adding/editing games.
- **Behavior**: Submitting the form adds an entry to the `SessionHistory` instead of calling an API.
- **Forms**:
  - `pages/admin/add-game.js`: Add new game form
  - `pages/admin/edit-game/[id].js`: Edit existing game form

### 7.5 — Implement Archive/Restore Actions
- **Action**: Add archive and restore buttons to game list.
- **Behavior**: Clicking archive/restore adds an action to the session history.
- **Confirmation**: Show confirmation dialog before adding to history.

---

## Step 8 — Python Script Generation (Persistence Layer)
**Goal**: Provide a tool to bridge the gap between the static UI and the Git repository.

### 8.1 — Script Template Structure
- **Action**: Create a Python script template that:
  - Validates execution context (must run at repo root)
  - Checks for `data/games/` directory existence
  - Applies each action in order
  - Handles errors gracefully
  - Creates atomic Git commits

### 8.2 — Script Template
```python
#!/usr/bin/env python3
"""
Board Game Library Update Script
Generated: {timestamp}
Total Actions: {actionCount}

This script applies pending changes to the game library.
Run this script at the root of the repository.

Usage:
    python3 update_library.py [--dry-run] [--no-commit]
"""

import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

# Configuration
GAMES_DIR = Path("data/games")
IMAGES_DIR = Path("public/images")

def validate_context():
    """Ensure script is run at repo root."""
    if not GAMES_DIR.exists():
        print("ERROR: Must be run at repository root (data/games/ not found)")
        sys.exit(1)

def load_game(game_id):
    """Load a game JSON file."""
    path = GAMES_DIR / f"{game_id}.json"
    if path.exists():
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def save_game(game_id, data):
    """Save a game JSON file."""
    path = GAMES_DIR / f"{game_id}.json"
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def delete_game(game_id):
    """Delete a game JSON file."""
    path = GAMES_DIR / f"{game_id}.json"
    if path.exists():
        path.unlink()

def git_add_commit(message):
    """Stage and commit changes."""
    subprocess.run(['git', 'add', '.'], check=True)
    subprocess.run(['git', 'commit', '-m', message], check=True)

def apply_actions(dry_run=False, no_commit=False):
    """Apply all pending actions."""
    validate_context()
    
    actions = [
        # {ACTIONS_ARRAY} - Generated dynamically
    ]
    
    print(f"Applying {len(actions)} action(s)...")
    
    for i, action in enumerate(actions, 1):
        print(f"\n[{i}/{len(actions)}] {action['type']}: {action['gameId']}")
        
        if action['type'] == 'ADD_GAME':
            save_game(action['gameId'], action['payload'])
            print(f"  Created: {action['gameId']}.json")
            
        elif action['type'] == 'UPDATE_GAME':
            save_game(action['gameId'], action['payload'])
            print(f"  Updated: {action['gameId']}.json")
            
        elif action['type'] == 'ARCHIVE_GAME':
            game = load_game(action['gameId'])
            if game:
                game['archived'] = True
                save_game(action['gameId'], game)
                print(f"  Archived: {action['gameId']}")
            else:
                print(f"  ERROR: Game not found: {action['gameId']}")
                
        elif action['type'] == 'RESTORE_GAME':
            game = load_game(action['gameId'])
            if game:
                game['archived'] = False
                save_game(action['gameId'], game)
                print(f"  Restored: {action['gameId']}")
            else:
                print(f"  ERROR: Game not found: {action['gameId']}")
                
        elif action['type'] == 'DELETE_GAME':
            delete_game(action['gameId'])
            print(f"  Deleted: {action['gameId']}.json")
    
    if not dry_run and not no_commit:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
        git_add_commit(f"Admin session update ({timestamp})")
        print("\nChanges committed to Git.")
        
        # Ask before pushing
        response = input("\nPush to remote? (y/N): ")
        if response.lower() == 'y':
            subprocess.run(['git', 'push'], check=True)
            print("Pushed to remote.")
    else:
        print("\nDry run complete. No changes made.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Apply library updates')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without applying')
    parser.add_argument('--no-commit', action='store_true', help='Apply changes without committing')
    args = parser.parse_args()
    
    apply_actions(dry_run=args.dry_run, no_commit=args.no_commit)
```

### 8.3 — Script Generation Logic
- **Action**: Implement `generatePythonScript()` in `SessionHistory.js`.
- **Process**:
  1. Collect all actions from history
  2. Generate actions array as Python list
  3. Inject into template
  4. Return complete script as string

### 8.4 — Script Execution Workflow
- **Action**: Document how the admin downloads and runs the script:
  1. Complete session in Admin UI
  2. Review all pending changes in Session History panel
  3. Click "Download Update Script" button
  4. Save `update_library.py` to repository root
  5. Run `python3 update_library.py --dry-run` to preview
  6. Run `python3 update_library.py` to apply changes
  7. Confirm Git push when prompted

---

## Step 9 — Admin UI Components Detail

### 9.1 — Session History Panel Component
- **File**: `components/admin/SessionHistoryPanel.js`
- **Props**:
  - `actions`: Array of action objects
  - `onEditAction(index)`: Callback for editing
  - `onDeleteAction(index)`: Callback for deletion
  - `onClearAll()`: Callback for clearing all

### 9.2 — Action Summary Display
- **ADD_GAME**: "Ajouter: {title}"
- **UPDATE_GAME**: "Modifier: {title}"
- **ARCHIVE_GAME**: "Archiver: {title}"
- **RESTORE_GAME**: "Restaurer: {title}"
- **DELETE_GAME**: "Supprimer: {title}"

### 9.3 — Edit Action Flow
- **For UPDATE_GAME actions**:
  - Clicking "Edit" opens the edit form pre-filled with the payload
  - Saving updates the action in place (does not add new action)
- **For other actions**:
  - Edit button is disabled or hidden

### 9.4 — Delete Action Flow
- **Action**: Clicking "Delete" removes the action from history
- **Confirmation**: Show confirmation dialog
- **Result**: Action is removed, no changes are applied

---

## Step 10 — Deployment
**Goal**: Fast build and deployment on static hosting.

### 10.1 — Configure Static Deployment (Render/GitHub Pages)
- **Action**: Deploy the `out` directory produced by `next export`.
- **Rationale**: No backend to manage, resulting in maximum deployment speed.

### 10.2 — Build Process
- **Command**: `npm run build` (produces static files in `out/`)
- **No Server**: All files are static HTML, CSS, and JS
- **Fast Deployment**: Direct upload to static hosting

---

## Summary: Key Changes from Previous Architecture

| Aspect | Previous | New (Session-Based) |
|--------|----------|---------------------|
| Backend | Next.js API routes | None (static only) |
| Persistence | GitHub API calls | Python script |
| Admin Auth | Token-based | None (static site) |
| Admin Responsive | Full responsive | Desktop/tablet only |
| Change Tracking | None | Session history |
| Undo/Revert | Not supported | Delete from history |
| Edit Pending Changes | Not supported | Edit in history |

---

## Benefits of Session-Based Approach

1. **Zero Backend**: No server to maintain, no Render Web Service needed
2. **Speed**: Build/Deploy is just a static export
3. **Safety**: Admin reviews all changes before any Git operation occurs
4. **Simplicity**: No complex conflict resolution; the script runs in the admin's local clone
5. **Transparency**: Full history of pending changes visible before export
6. **Flexibility**: Edit or revert individual changes before finalization