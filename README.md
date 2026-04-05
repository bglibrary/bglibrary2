# Board Game Library

Personal board game library management web application, built with Next.js.

## Overview

This application manages a board game collection with two distinct interfaces:
- **Visitor interface** (`/`): Browse the game library with filters and search
- **Admin interface** (`/admin`): Full game management

## Installation

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
├── public/
│   ├── data/games/        # Game JSON files
│   └── images/            # Game images
├── src/
│   ├── admin/             # Administration services
│   ├── components/        # React components
│   ├── domain/            # Domain models
│   ├── engines/           # Filtering and sorting engines
│   ├── pages/             # Next.js pages
│   └── repository/        # Data access
├── scripts/
│   └── apply-changes.js   # Script to apply modifications
└── specs/                 # Functional specifications
```

## Admin Interface

### Access

The admin interface is accessible at `/admin`. It provides full management of the game library.

### Features

#### Dashboard (`/admin`)

The dashboard displays all games organized in two sections:
- **Active games**: Games visible to visitors
- **Archived games**: Games hidden from visitors (collapsible section)

**Available actions**:
- ❤️ **Favorite**: Mark/unmark a game as a favorite (heart icon)
- 📥 **Archive**: Hide a game from visitors (inbox tray icon)
- 📤 **Restore**: Make an archived game visible again (outbox tray icon)
- 🗑️ **Delete**: Permanently remove a game (trash icon, only for archived games)
- ✏️ **Edit**: Modify game details (pencil icon)

**Filters and options**:
- Search by title
- Toggle between grid and list view
- Session history panel (clock icon)

#### Add a game (`/admin/add-game`)

Complete form to add a new game:

| Field | Description |
|-------|-------------|
| Title | Game name (required) |
| Description | Short description |
| Image | Image upload (JPG/PNG/WebP, converted to JPG) |
| Players | Min and max (required) |
| Duration | Short/Medium/Long |
| Complexity | Easy/Medium/Complex |
| Age | Age recommendation |
| Categories | Multiple selection |
| Mechanics | Multiple selection |
| Awards/Labels | Multiple selection |

#### Edit a game (`/admin/edit-game/[id]`)

Access by clicking on a game in the dashboard. The pre-filled form allows editing all fields.

**Visual indicators**:
- Modified fields are highlighted in orange
- A "modified" label appears next to affected fields
- Sticky action bar at the bottom when scrolling

### Session History

All modifications made in the admin interface are stored locally in the browser (localStorage) via the session history.

**Features**:
- View all pending actions
- Delete individual actions
- Export modifications as JSON
- Clear the entire session

### Persistence Workflow

Modifications are not applied immediately to files. The workflow is as follows:

1. **Modification in the interface** → Storage in session history (localStorage)
2. **JSON Export** → Download of a `session-changes.json` file
3. **Application via script** → File modifications and Git commit

#### apply-changes.js Script

The `scripts/apply-changes.js` script applies exported modifications:

```bash
# Apply modifications
node scripts/apply-changes.js session-changes.json

# Preview without modifying
node scripts/apply-changes.js session-changes.json --dry-run

# Apply without Git workflow
node scripts/apply-changes.js session-changes.json --no-commit
```

**Git Workflow**:
1. Create a branch `admin-session-YYYYMMDDTHHMMSS`
2. One commit per action
3. Update `index.json`
4. Merge to `main` (with validation)
5. Push to remote (with validation)
6. Delete session file

**Supported action types**:
- `ADD_GAME`: Create JSON file + image
- `UPDATE_GAME`: Update JSON file + image
- `ARCHIVE_GAME`: Mark as archived
- `RESTORE_GAME`: Mark as not archived
- `TOGGLE_FAVORITE`: Change favorite status
- `DELETE_GAME`: Remove JSON file + image

## Data Format

### Game file (`public/data/games/[id].json`)

```json
{
  "id": "catane",
  "title": "Les Colons de Catane",
  "description": "Strategy game...",
  "minPlayers": 3,
  "maxPlayers": 4,
  "playDuration": "MEDIUM",
  "firstPlayComplexity": "MEDIUM",
  "ageRecommendation": "10+",
  "categories": ["STRATEGY", "TRADING"],
  "mechanics": ["DICE_ROLLING", "RESOURCE_MANAGEMENT"],
  "awards": ["SDJ"],
  "favorite": true,
  "archived": false,
  "images": [{ "id": "catane-main" }]
}
```

### Index (`public/data/games/index.json`)

```json
{
  "games": ["7-wonders", "agricola", "catane", ...]
}
```

## Testing

```bash
npm test
```

Tests cover components, services, and scripts.

## Specifications

Detailed specifications are in the `specs/` folder:
- `phase_7_4_ui_admin_game_list.md`: Admin interface
- `phase_7_5_ui_admin_game_editor.md`: Game editing
- `phase_4_5_admin_game_service.md`: Admin service
- `UI_guidelines.md`: UI guidelines