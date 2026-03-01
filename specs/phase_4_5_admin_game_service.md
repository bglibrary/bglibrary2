# Phase 4 — Component Spec: AdminGameService (Session-Based)

## Role
The AdminGameService orchestrates all administrative operations on games within a browser session.

It acts as the single application-level entry point for creating, updating, archiving, restoring, and toggling favorites on games, storing all changes in the SessionHistory.

---

## Responsibilities

- Validate admin-provided game data
- Orchestrate add, update, archive, restore, and toggle favorite workflows
- Coordinate with SessionHistory for change tracking
- Guarantee consistency of admin operations within session

---

## Non-Responsibilities

- UI form handling
- Direct file system or Git interactions
- Rendering or routing concerns
- Read-only access for visitors
- Persistence to repository (handled by Python script)

---

## Dependencies

- **SessionHistory**: Stores all pending actions
- **GameRepository**: Reads existing games for validation
- **ImageAssetManager**: Validates image assets

---

## Inputs

- `GameData`
  - Full game definition as provided by the admin UI
- `AdminAction`
  - One of: add, update, archive, restore, toggleFavorite

---

## Outputs

- Operation result (success or explicit error)
- No game data is returned to the caller
- Action is added to SessionHistory on success

---

## Supported Operations

### Add Game

- Validate mandatory fields
- Ensure game ID uniqueness (check existing games + pending ADD actions)
- Add ADD_GAME action to SessionHistory
- Return success

### Update Game

- Validate mandatory fields
- Ensure target game exists (in repository or pending ADD action)
- Add UPDATE_GAME action to SessionHistory
- Return success

### Archive Game

- Ensure target game exists
- Add ARCHIVE_GAME action to SessionHistory
- Return success

### Restore Game

- Ensure target game exists and is archived
- Add RESTORE_GAME action to SessionHistory
- Return success

### Toggle Favorite

- Ensure target game exists
- Determine new favorite state (toggle current state)
- Add TOGGLE_FAVORITE action to SessionHistory
- Return success
- **Note**: This is a quick action shortcut for partial updates

---

## Action Deduplication

The session history automatically deduplicates actions to avoid redundant operations:

- **TOGGLE_FAVORITE**: If a toggle favorite action already exists for a game, the new toggle removes the existing action (returning to original state) instead of creating a duplicate.
- **ARCHIVE_GAME / RESTORE_GAME**: These are mutually exclusive. If an archive action exists and a restore is added (or vice versa), the existing action is removed.

This ensures the exported script only contains meaningful changes without redundant operations.

---

## Action Removal and Visual Reversal

When an action is removed from the session history (via the trash icon in the UI):
- The visual effect of the action is reversed in the UI
- For TOGGLE_FAVORITE: the favorite state is toggled back
- For ARCHIVE_GAME: the game is unarchived
- For RESTORE_GAME: the game is re-archived

---

## Session History Actions

### Action Structure
```javascript
{
  id: string,           // unique action identifier (UUID)
  type: ActionType,     // ADD_GAME | UPDATE_GAME | ARCHIVE_GAME | RESTORE_GAME | TOGGLE_FAVORITE
  timestamp: string,    // ISO 8601 timestamp
  gameId: string,       // target game ID
  payload: object | null, // action-specific data
  summary: string       // human-readable summary for UI display
}
```

### Action Types
- `ADD_GAME`: Full game object in payload
- `UPDATE_GAME`: Full game object in payload
- `ARCHIVE_GAME`: No payload (just gameId)
- `RESTORE_GAME`: No payload (just gameId)
- `TOGGLE_FAVORITE`: `{ favorite: boolean }` in payload

---

## Validation Rules

- Mandatory fields must be present
- Controlled vocabularies must be respected
- Images must be validated via ImageAssetManager
- Partial updates are forbidden (except via TOGGLE_FAVORITE)
- Game ID must be unique (for ADD operations)

---

## Invariants

- Admin operations are atomic within session
- No operation may leave the session in an inconsistent state
- All operations are reversible by deleting from SessionHistory
- No direct persistence to repository

---

## Anti-Corruption Rules

- Git-specific concepts (commits, branches, tokens) must not leak into this component
- UI-specific validation (field-level UX) must not be implemented here
- Persistence format (JSON vs Markdown) must remain opaque
- Python script details must not leak into this component

---

## Error Handling

- Invalid input data
- Game not found
- Duplicate game ID
- Validation failure

All errors must be explicit and typed.

---

## Test Strategy

### Unit Tests

- Add valid game
- Reject invalid game data
- Reject duplicate game ID
- Update existing game
- Reject update of non-existing game
- Archive and restore workflows
- Toggle favorite workflow
- Session history integration

### Invariant Tests

- No direct persistence
- All operations add to session history
- Operations are reversible

### Negative Tests

- Duplicate IDs
- Invalid controlled vocabulary values
- Missing mandatory fields

All tests must be executable without UI, file system, or Git dependencies.

---

## Python Script Generation

The SessionHistory component can generate a Python script that applies all pending changes. The script follows a safe workflow:

### Script Workflow

1. **Branch Creation**: Creates a new branch named `admin-session-YYYYMMDD-HHMMSS` before making any changes
2. **Action Application**: Applies each action individually with one commit per action
3. **User Validation**: Asks for confirmation before rebasing on main
4. **Merge**: Merges the session branch on main with `--no-ff`
5. **Cleanup**: Deletes the session branch after successful merge
6. **Push**: Asks for confirmation before pushing to remote

### Script Features

- **Dry-run mode**: `--dry-run` flag to preview changes without applying
- **No-commit mode**: `--no-commit` flag to apply changes without Git operations
- **Index management**: Automatically updates `public/data/games/index.json`
- **Error handling**: Validates context and handles missing games gracefully

### User Confirmations

The script includes interactive prompts at critical steps:

```
Rebase on main? [y/N]: 
Push to remote? [y/N]: 
```

If the user declines the rebase, the script stops and leaves them on the session branch for manual intervention.

### Generated Script Structure

```python
# Configuration
GAMES_DIR = Path("public/data/games")
INDEX_FILE = GAMES_DIR / "index.json"
BRANCH_PREFIX = "admin-session"

# Key functions
def create_session_branch()  # Creates timestamped branch
def ask_confirmation(prompt, default)  # Interactive user input
def apply_actions(dry_run, no_commit)  # Main workflow
```

---

## Key Changes from Previous Architecture

| Aspect | Previous | New (Session-Based) |
|--------|----------|---------------------|
| Persistence | Immediate (Git) | Deferred (SessionHistory) |
| Atomicity | Per-operation | Per-session |
| Reversibility | Not supported | Delete from history |
| Backend | Required | None |
| Quick Actions | Not supported | TOGGLE_FAVORITE |
| Git Workflow | Direct push | Branch → Validate → Merge |
| Commits | Single commit | One commit per action |
