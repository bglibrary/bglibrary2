# Render + Git Admin Backend Architecture Guide

## 1. Purpose

This document defines:

* How the Admin part of the application performs Git commits
* How the backend is structured
* How everything is hosted on the free tier of Render
* A step-by-step implementation plan suitable for a junior developer

This document resolves the architectural risk related to:

* Hosting on Render
* Performing Git operations from the Admin interface

---

# 2. Target Architecture (MVP Compatible)

## High-Level Flow

```
Visitor → Render Web Service → Backend → Read JSON data
Admin → Render Web Service → Backend → Git clone → Modify file → Commit → Push
```

## Core Principles

* Git is the source of truth.
* The backend performs Git operations.
* The frontend NEVER talks directly to Git.
* Git authentication is done via environment variables.
* No persistent disk storage is assumed.

---

# 3. Render Free Tier Constraints

The free Web Service on Render provides:

* Node.js backend execution
* Environment variables support
* Temporary filesystem
* Outbound internet access (required for Git push)

Important constraints:

* Filesystem is ephemeral (lost on redeploy)
* Services sleep after inactivity
* No background workers on free tier

Design implication:

> The backend must clone the repository on-demand for each write operation.

We must NOT rely on a permanently cloned repo.

---

# 4. Recommended Technical Model

## Use Case

Admin adds or updates a game.

## Implementation Strategy

Instead of:

* Keeping a permanent local Git clone

We do:

1. Create temporary directory
2. Clone repository using HTTPS + token
3. Modify JSON file
4. Commit
5. Push
6. Delete temporary directory

This ensures compatibility with Render's ephemeral filesystem.

---

# 5. Backend Responsibilities

The backend must expose:

* `GET /games`
* `GET /games/:id`
* `POST /admin/games`
* `PUT /admin/games/:id`
* `POST /admin/games/:id/archive`
* `POST /admin/games/:id/restore`

Admin endpoints trigger Git operations.

---

# 6. Git Authentication Model

Use a GitHub Personal Access Token (PAT).

Store in Render environment variables:

```
GIT_REPO_URL=https://github.com/username/repository.git
GIT_USERNAME=your-username
GIT_TOKEN=your-token
```

Never store token in code.

Clone URL format:

```
https://<username>:<token>@github.com/username/repository.git
```

---

# 7. Detailed Implementation Plan (Junior-Friendly)

## Step 1 — Create Backend Project

Use Node.js + Express.

```bash
npm init -y
npm install express
npm install --save-dev jest supertest
```

Create:

```
src/
  server.js
  routes/
  services/
tests/
```

---

## Step 2 — Create Basic Express Server

`server.js`:

* Start Express
* Add JSON middleware
* Add health route `/health`

Test:

* Server starts
* `/health` returns 200

Commit.

---

## Step 3 — Add Game Read Endpoint (Read-Only)

For MVP simplicity:

* Store games in `data/games.json`
* Load file
* Return content

Do NOT implement Git yet.

Test:

* GET returns valid JSON

Commit.

---

## Step 4 — Implement Git Service (Isolated)

Install dependency:

```bash
npm install simple-git
```

Create `GitService` with methods:

* cloneRepo(tempPath)
* commitAndPush(message)

Pseudo-flow:

1. Create temp directory using `fs.mkdtemp`
2. Clone repo using simple-git
3. Return path

Test using mocks (do not hit real Git yet).

Commit.

---

## Step 5 — Implement Write Flow

Inside Admin route:

1. Call GitService.cloneRepo()
2. Modify JSON file inside cloned repo
3. Commit with message:

   * "Add game <id>"
   * "Update game <id>"
4. Push
5. Cleanup directory

Add try/catch:

* On failure → return 500 with typed error
* Always delete temp directory

Commit.

---

## Step 6 — Add Conflict Handling

If push fails:

* Return error
* Do not retry automatically
* Surface clean error message

Commit.

---

## Step 7 — Deploy to Render

On Render:

1. Create new Web Service
2. Connect GitHub repo
3. Set:

   * Runtime: Node
   * Build command: `npm install`
   * Start command: `node src/server.js`

Add environment variables:

* GIT_REPO_URL
* GIT_USERNAME
* GIT_TOKEN

Deploy.

---

# 8. Security Considerations

* Admin routes must be protected (even basic token auth)
* Git token must have minimal permissions
* Never log token
* Do not return raw Git errors

---

# 9. Failure Scenarios and Expected Behavior

| Scenario          | Expected Behavior |
| ----------------- | ----------------- |
| Git clone fails   | Return 500        |
| Push conflict     | Return 409        |
| Network failure   | Return 500        |
| Invalid game data | Return 400        |

System must never:

* Leave temp directories
* Corrupt repository
* Crash process

---

# 10. Why This Works on Render Free Tier

Because:

* No persistent disk required
* Git operations are short-lived
* Only outbound HTTPS needed
* No background job required
* No database required

The system is stateless between requests.

---

# 11. Explicit Non-Goals

* No background queue
* No long-running Git daemon
* No database
* No multi-admin concurrency handling

---

# 12. Future Improvements (Post-MVP)

* Switch to GitHub REST API instead of clone
* Add conflict resolution strategy
* Add commit history viewer
* Add staging branch flow

---

# 13. Final Validation Checklist

Before going live:

* Can clone repo from Render?
* Can push manually triggered update?
* Are env variables correctly configured?
* Does service restart break anything?
* Does sleeping instance still work?

If all yes → architecture is valid.