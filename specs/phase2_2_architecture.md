# phase2_2architecture.md (updated)

## System Overview

The system is a **static web application** with a **modular admin GUI**. Two logical roles remain:

1. **Owner / Admin**
   - Uses Admin GUI to manage games via forms
   - Actions handled by **Admin API layer**
   - GitHub interaction fully encapsulated in a **GitService module**
   - Admin GUI generates JSON/Markdown files, uploads images, creates commits
   - Admin can archive and restore games

2. **Visitor / Player**
   - Browses games, filters and sorts by criteria
   - Views game details including images, description, player count, duration, first play complexity, awards, and favorite flags
   - Receives deterministic guidance for game selection

---

## Core Components

1. **Static Site Generator (Next.js)**
   - Generates fully static HTML pages for visitors
   - Admin pages and API routes handled via Next.js
   - Components unchanged from previous architecture

2. **Data Layer**
   - JSON/Markdown files with:
     - Game metadata
     - Images (local assets)
     - Favorites (admin-only)
     - Awards
   - Archive metadata separate for admin-only access

3. **Frontend Components**
   - GameCard, GameDetail, FilterPanel, SelectionGuide (same as before)
   - **Admin Components**
     - GameForm (Add / Edit / Archive)
     - AwardForm
     - AdminDashboard (lists archived and active games)

4. **Admin API Layer**
   - Receives form submissions from Admin GUI
   - Validates data
   - Calls **GitService** to push updates

5. **GitService (isolated module)**
   - Encapsulates all GitHub interactions:
     - create/update JSON or Markdown files
     - upload images
     - commit with message
   - Provides standard interface:
     ```ts
     interface GitService {
       addGame(data: GameData): Promise<void>;
       updateGame(id: string, data: GameData): Promise<void>;
       archiveGame(id: string): Promise<void>;
     }
     ```
   - Can be replaced by alternative storage or repo system without impacting frontend or SSG

6. **Build & Deployment**
   - Commit triggers automatic rebuild on Render
   - Static site updated for visitors

---

## Interaction Flow (updated)

1. **Admin adds/updates a game**
   - Submits Admin GUI form
   - Admin API validates data
   - GitService pushes JSON/Markdown + images to GitHub repo
   - Commit triggers static site rebuild
   - Site updated for all visitors

2. **Visitor browsing**
   - Same as before

---

## Architectural Principles (updated)

- **Static-first approach**
- **Deterministic behavior**
- **Device-friendly UI**
- **Exhaustive documentation**
- **Extensible metadata**
- **Modular GitHub integration**: allows replacing GitHub dependency with minimal changes
- **Admin GUI isolated from visitor-facing static site generation**

---

## Deployment Diagram (Conceptual, updated)

[ Admin GUI (React) ]
|
v
[ Admin API (Next.js API Routes) ]
|
v
[ GitService module (GitHub) ]
|
v
[ JSON/Markdown Game Data + Images in Repo ]
|
v
[ Next.js SSG Build Process ] ---> [ Static HTML + CSS + JS ]
|
v
[ Render Hosting (Static Site) ]
|
v
[ Visitor Devices: Tablet, Mobile, Desktop ]