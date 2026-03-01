# Apply Changes Script Documentation

## Overview

`scripts/apply-changes.js` is a Node.js script that applies session changes exported from the admin panel to the file system and Git repository.

## Usage

```bash
node scripts/apply-changes.js <session-history.json> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Preview changes without applying them |
| `--no-commit` | Apply changes without Git workflow (for testing) |
| `--help` | Show help message |

## Workflow

1. **Validate context** - Ensures script is run at repository root
2. **Check for uncommitted changes** - Stashes if necessary
3. **Create session branch** - `admin-session-YYYYMMDDTHHMMSS`
4. **Apply actions** - One commit per action
5. **Update index.json** - Regenerates the games index
6. **Ask for validation** - Before merging to main
7. **Ask for validation** - Before pushing to remote
8. **Cleanup** - Deletes session JSON file, restores stash

## Supported Actions

### ADD_GAME
- Creates game JSON file in `public/data/games/`
- Saves image from base64 to `public/images/`
- Sets `images` array with image ID

### UPDATE_GAME
- Updates existing game JSON file
- Replaces image if new one provided
- Merges with existing data

### ARCHIVE_GAME
- Sets `archived: true` in game JSON

### RESTORE_GAME
- Sets `archived: false` in game JSON

### TOGGLE_FAVORITE
- Toggles `favorite` boolean in game JSON

### DELETE_GAME
- Deletes game JSON file
- Deletes associated image file

## Session JSON Format

The session file must contain an array of actions:

```json
[
  {
    "id": "action-123",
    "type": "ADD_GAME",
    "timestamp": "2026-01-03T22:00:00.000Z",
    "gameId": "my-new-game",
    "gameTitle": "My New Game",
    "payload": {
      "id": "my-new-game",
      "title": "My New Game",
      "minPlayers": 2,
      "maxPlayers": 4,
      "_imageData": {
        "base64": "data:image/jpeg;base64,/9j/4AAQ...",
        "type": "image/jpeg",
        "filename": "photo.jpg"
      }
    }
  }
]
```

## Image Handling

Images are stored as base64 in the session JSON. The script:
1. Extracts base64 data (removes `data:image/xxx;base64,` prefix)
2. Converts to Buffer
3. Determines file extension from MIME type
4. Saves to `public/images/{gameId}-main.{ext}`

Supported formats: JPEG, PNG, WebP, GIF

## Examples

### Preview changes
```bash
node scripts/apply-changes.js session-changes.json --dry-run
```

### Apply without Git (testing)
```bash
node scripts/apply-changes.js session-changes.json --no-commit
```

### Full workflow
```bash
node scripts/apply-changes.js session-changes.json
# Follow prompts to merge and push
```

## Error Handling

- **Invalid JSON**: Script exits with error
- **Missing file**: Script exits with error
- **Game not found**: Warning logged, continues
- **Invalid image format**: Warning logged, continues without image

## Dependencies

- Node.js (built-in modules only)
- Git CLI

## Testing

Tests are located in `tests/scripts/apply-changes.test.js`.

Run tests:
```bash
npm test -- --testPathPattern="apply-changes"