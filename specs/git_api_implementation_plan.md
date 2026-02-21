# Session-Based Persistence Architecture (Python Script)

## 1. Purpose

This document defines how the Admin interface manages changes without a backend.
Instead of real-time API calls, the interface records a "Session History" and generates a Python script to be executed locally by the owner.

---

## 2. Session Flow

1. **Admin Login**: Purely local or basic auth if needed (since it's a static site).
2. **Management**: Admin adds, edits, archives, restores, or toggles favorites on games. Each action is recorded in the `SessionHistory`.
3. **Review**: Admin reviews the history, edits entries, or removes mistakes.
4. **Export**: Admin clicks "Download Update Script".
5. **Execution**: Admin runs the script at the root of the repository.

---

## 3. Session History Structure

The history is stored in memory (or `localStorage` for persistence across reloads).

```json
[
  {
    "id": "action-001",
    "type": "ADD_GAME",
    "timestamp": "2026-02-20T21:42:00Z",
    "gameId": "new-game",
    "payload": { "id": "new-game", "title": "New Game", ... },
    "summary": "Ajouter: New Game"
  },
  {
    "id": "action-002",
    "type": "UPDATE_GAME",
    "timestamp": "2026-02-20T21:45:00Z",
    "gameId": "catan",
    "payload": { "id": "catan", "title": "Catan (Updated Edition)", ... },
    "summary": "Modifier: Catan (Updated Edition)"
  },
  {
    "id": "action-003",
    "type": "ARCHIVE_GAME",
    "timestamp": "2026-02-20T21:50:00Z",
    "gameId": "old-game",
    "payload": null,
    "summary": "Archiver: Old Game"
  },
  {
    "id": "action-004",
    "type": "TOGGLE_FAVORITE",
    "timestamp": "2026-02-20T21:55:00Z",
    "gameId": "catan",
    "payload": { "favorite": true },
    "summary": "Favori: Catan"
  }
]
```

---

## 4. Action Types

| Type | Description | Payload |
|------|-------------|---------|
| `ADD_GAME` | Add a new game to the library | Full game object |
| `UPDATE_GAME` | Update an existing game | Full game object |
| `ARCHIVE_GAME` | Mark a game as archived | null |
| `RESTORE_GAME` | Restore an archived game | null |
| `TOGGLE_FAVORITE` | Toggle favorite status | `{ favorite: boolean }` |
| `DELETE_GAME` | Permanently delete a game | null (optional, use with caution) |

---

## 5. Generated Python Script (`update_library.py`)

The script is responsible for:
1. Validating the local environment (running at repo root).
2. Applying changes to `data/games/*.json`.
3. Handling image moves/renames if applicable.
4. Performing Git operations.

### Script Template

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
            
        elif action['type'] == 'TOGGLE_FAVORITE':
            game = load_game(action['gameId'])
            if game:
                game['favorite'] = action['payload']['favorite']
                save_game(action['gameId'], game)
                status = "favori" if game['favorite'] else "non favori"
                print(f"  Toggled favorite: {action['gameId']} -> {status}")
            else:
                print(f"  ERROR: Game not found: {action['gameId']}")
                
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

---

## 6. Benefits

- **Zero Backend**: No server to maintain, no Render Web Service needed.
- **Speed**: Build/Deploy is just a static export.
- **Safety**: Admin reviews all changes before any Git operation occurs.
- **Simplicity**: No complex conflict resolution; the script runs in the admin's local clone.
- **Transparency**: Full history of pending changes visible before export.
- **Flexibility**: Edit or revert individual changes before finalization.

---

## 7. UI Considerations (Admin Only)

- **Device Support**: Tablet and Desktop only (minimum width: 768px).
- **Responsiveness**: Not required for mobile phones.
- **History View**: Side panel (hidden by default, toggled via header button).
- **Session Persistence**: Optional localStorage for recovery across page reloads.
- **Search**: Local text filtering for games (no backend).

---

## 8. Session History Management

### 8.1 — Adding Actions
- Each admin operation (add, update, archive, restore, toggle favorite) adds an entry to the session history.
- The history is displayed in real-time in the Session History Panel.

### 8.2 — Editing Actions
- Only `ADD_GAME` and `UPDATE_GAME` actions can be edited.
- Clicking "Edit" opens the form pre-filled with the action's payload.
- Saving updates the action in place (does not create a new action).

### 8.3 — Deleting Actions (Revert)
- Any action can be deleted from the history.
- Deleting an action removes it from the pending changes.
- A confirmation dialog is shown before deletion.

### 8.4 — Clearing All Actions
- A "Clear Session" button removes all pending changes.
- A confirmation dialog is shown before clearing.

---

## 9. Script Execution Workflow

1. Complete session in Admin UI.
2. Review all pending changes in Session History panel.
3. Click "Download Update Script" button.
4. Save `update_library.py` to repository root.
5. Run `python3 update_library.py --dry-run` to preview changes.
6. Run `python3 update_library.py` to apply changes.
7. Confirm Git push when prompted.

---

## 10. Error Handling

### Script Errors
- **Context Error**: Script not run at repo root.
- **File Not Found**: Game file does not exist for update/archive/restore.
- **Git Error**: Git command failed (commit, push).

### UI Errors
- **Validation Error**: Invalid game data in form.
- **Duplicate ID**: Attempting to add a game with existing ID.
- **Missing Required Field**: Mandatory field not provided.

All errors must be explicit and user-friendly.