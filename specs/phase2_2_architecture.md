# phase2_2_architecture.md (updated)

## System Overview

The system is a **fully static web application** with a **session-based admin interface**. Two logical roles remain:

1. **Owner / Admin**
   - Uses Admin GUI to manage games via forms
   - All changes are stored in **Session History** (browser memory)
   - Admin can review, edit, or delete pending changes
   - Admin exports a **Python script** to apply changes
   - Script is executed locally at repository root
   - Admin can archive and restore games

2. **Visitor / Player**
   - Browses games, filters and sorts by criteria
   - Views game details including images, description, player count, duration, first play complexity, awards, and favorite flags
   - Receives deterministic guidance for game selection

---

## Core Components

1. **Static Site Generator (Next.js)**
   - Generates fully static HTML pages for visitors
   - Admin pages are also static (no server-side rendering)
   - All admin logic runs in the browser

2. **Data Layer**
   - JSON files with:
     - Game metadata
     - Images (local assets)
     - Favorites (admin-only)
     - Awards
   - Archive metadata included in game files

3. **Frontend Components**
   - GameCard, GameDetail, FilterPanel, SelectionGuide (same as before)
   - **Admin Components**
     - SessionHistoryPanel (tracks pending changes)
     - GameForm (Add / Edit)
     - AdminDashboard (lists games and session history)

4. **Session History Service**
   - Stores all pending admin actions in browser memory
   - Provides methods:
     - `addAction(type, payload)` - Add new action
     - `removeAction(index)` - Delete/revert action
     - `editAction(index, newPayload)` - Modify action
     - `clearAll()` - Clear session
     - `generatePythonScript()` - Export script
   - Optional localStorage persistence for session recovery

5. **Python Script Generator**
   - Generates executable Python script from session history
   - Script handles:
     - File operations (create, update, delete JSON files)
     - Git operations (add, commit, push)
     - Error handling and validation

6. **Build & Deployment**
   - Commit triggers automatic rebuild on Render
   - Static site updated for visitors

---

## Interaction Flow (updated)

1. **Admin adds/updates a game**
   - Opens Admin GUI in browser
   - Fills out game form
   - Submits form → Action added to Session History
   - No API call, no backend interaction

2. **Admin reviews changes**
   - Views Session History panel
   - Can edit form-based actions (ADD, UPDATE)
   - Can delete any action to revert

3. **Admin exports and runs script**
   - Clicks "Download Update Script"
   - Saves `update_library.py` to repo root
   - Runs script locally: `python3 update_library.py`
   - Script applies changes and commits to Git
   - Push triggers rebuild of static site

4. **Visitor browsing**
   - Same as before

---

## Architectural Principles (updated)

- **Static-first approach**
- **Deterministic behavior**
- **Device-friendly UI** (visitor: all devices; admin: desktop/tablet only)
- **Exhaustive documentation**
- **Extensible metadata**
- **Zero backend**: No server, no API routes, no authentication
- **Session-based admin**: All changes tracked in browser memory
- **Python-based persistence**: Script handles Git operations locally

---

## Deployment Diagram (Conceptual, updated)

```
[ Admin GUI (React - Browser) ]
|
| (Session History in memory)
|
v
[ Download Python Script ]
|
v
[ Admin runs script locally ]
|
v
[ Python Script: update_library.py ]
|
| (Modifies files, Git commit/push)
|
v
[ JSON Game Data + Images in Repo ]
|
v
[ Next.js SSG Build Process ] ---> [ Static HTML + CSS + JS ]
|
v
[ Render Hosting (Static Site) ]
|
v
[ Visitor Devices: Tablet, Mobile, Desktop ]
```

---

## Session History Flow

```
[ Admin Action ]
      |
      v
[ SessionHistory.addAction() ]
      |
      v
[ Session History Panel (UI) ]
      |
      +---> [ Edit Action ] ---> [ Update in place ]
      |
      +---> [ Delete Action ] ---> [ Remove from history ]
      |
      +---> [ Clear All ] ---> [ Empty session ]
      |
      v
[ Download Script Button ]
      |
      v
[ generatePythonScript() ]
      |
      v
[ update_library.py (downloaded) ]
```

---

## Key Architectural Decisions

### Why No Backend?
- **Simplicity**: No server to maintain, no authentication to manage
- **Speed**: Build/deploy is instant (pure static)
- **Cost**: No server costs, only static hosting
- **Safety**: Admin reviews all changes before any Git operation

### Why Session-Based?
- **Transparency**: Full history of pending changes visible
- **Flexibility**: Edit or revert individual changes
- **Offline-capable**: Session can persist in localStorage

### Why Python Script?
- **Local execution**: Runs in admin's local clone
- **Git integration**: Direct access to Git commands
- **Atomicity**: All changes applied in single commit
- **Error handling**: Script can validate and report errors

---

## Admin Device Support

| Device | Support | Notes |
|--------|---------|-------|
| Desktop | Full | Primary target |
| Tablet | Full | Secondary target |
| Mobile | None | Not supported (minimum width: 768px) |

Visitor interface remains fully responsive for all devices.