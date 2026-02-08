# Phase 8 — Implementation Plan (Commit-Oriented)

## Purpose
This document defines the implementation plan for the MVP.

The plan is structured as a sequence of **small, testable, incremental commits**.

Each step is a *logical milestone*, not a single commit.

Each milestone is expected to be decomposed into multiple **atomic commits**.

---

## Global Rules

- One concern per commit
- Commits must be **atomic**: minimal diff, minimal files
- Large steps are decomposed into multiple commits
- No UI and backend changes mixed unless strictly required
- Tests are written in the same commit as the feature
- No speculative implementation

---

## Step 1 — Project Skeleton

**Milestone goal**: Runnable empty project

### Expected commits (examples)
- Initialize repository and tooling
- Configure test framework
- Add CI configuration

Each commit must remain independently buildable.

---

## Step 2 — Core Domain Model

**Goal**: Game domain model exists

- Implement Game domain entities
- Enforce invariants via validation

**Acceptance**:
- Domain validation tests pass

---

## Step 3 — GameRepository (Read Only)

**Goal**: Read access to games

- Implement GameRepository interface
- Load games from persistence

**Acceptance**:
- `getAllGames()` returns non-archived games
- `getGameById()` works for active games

---

## Step 4 — Filtering Engine

**Goal**: Filtering works in isolation

- Implement FilteringEngine
- Apply AND logic

**Acceptance**:
- Filtering tests pass
- Zero-result filtering handled

---

## Step 5 — Visitor UI: Game Library

**Goal**: Visitor can browse games

- Implement Game Library screen
- Connect to repository + filtering

**Acceptance**:
- Games displayed
- Filters applied correctly

---

## Step 6 — Visitor UI: Game Detail

**Goal**: Visitor can view game details

- Implement Game Detail screen
- Navigation from library

**Acceptance**:
- Correct game displayed
- Errors handled

---

## Step 7 — Admin Services

**Goal**: Admin backend actions available

- Implement AdminGameService
- Implement archive / restore

**Acceptance**:
- Admin service tests pass

---

## Step 8 — Image Asset Handling

**Goal**: Image validation and persistence

- Implement ImageAssetManager
- Enforce validation rules

**Acceptance**:
- Invalid images rejected
- Valid images accepted

---

## Step 9 — Admin UI: Game List

**Goal**: Admin can see all games

- Implement Admin Game List screen

**Acceptance**:
- Active and archived games visible

---

## Step 10 — Admin UI: Game Editor

**Goal**: Admin can add and update games

- Implement Game Editor screen
- Wire image upload

**Acceptance**:
- Game creation works
- Validation errors surfaced

---

## Step 11 — Admin UI: Archive Management

**Goal**: Archive and restore flows complete

- Confirmation dialogs
- Status refresh

**Acceptance**:
- Archive / restore behavior correct

---

## Step 12 — End-to-End Validation

**Goal**: MVP complete and stable

- Manual smoke tests
- Edge cases verification

**Acceptance**:
- All acceptance criteria met

---

## Commit Message Guidelines

All commits must follow a structured format.

### Subject Line

- Maximum 50 characters
- Imperative mood
- Describes *what* changes

Example:
- `Add game domain validation`

---

### Body — Why

- Explain **why** the change is needed
- Reference constraints, specs, or decisions
- Avoid restating the code

---

### Body — What (optional)

- High-level summary of the change
- Only if it adds clarity

---

### Body — Tests

- List added or affected tests
- Indicate how to verify manually if relevant

Example:
```
Tests:
- GameValidationTest
- GameRepositoryReadTest
```

---

### General Best Practices

- One logical change per commit
- Avoid formatting-only commits unless isolated
- Prefer many small commits over one large commit
- Commits must be revertible without breaking the build

---

## Explicit Exclusions

- Any nice-to-have feature
- Any UI polish beyond specifications

These will be planned in a later iteration.

