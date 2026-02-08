# Phase 5 — Service Contracts: AdminGameService

## Purpose
This document defines the public service contracts exposed by the AdminGameService.

These contracts are consumed by the Admin UI layer and orchestrate all administrative actions.

---

## Design Principles

- Explicit commands, no implicit behavior
- Full validation before persistence
- No partial updates
- Errors are first-class results

---

## Commands

### AddGame

**Input**
- `game: Game`

**Rules**
- `id` must be unique
- `archived` must be `false`

**Errors**
- DuplicateGameId
- InvalidGameData
- ValidationFailed

---

### UpdateGame

**Input**
- `id: string`
- `game: Game`

**Rules**
- Target game must exist
- Full replacement, not patch

**Errors**
- GameNotFound
- InvalidGameData
- ValidationFailed

---

### ArchiveGame

**Input**
- `id: string`

**Rules**
- Game must exist and be active

**Errors**
- GameNotFound
- GameAlreadyArchived

---

### RestoreGame

**Input**
- `id: string`

**Rules**
- Game must exist and be archived

**Errors**
- GameNotFound
- GameNotArchived

---

## Outputs

All commands return:
- `Success`
- or a typed error (no data payload)

---

## Invariants

- Commands are idempotent only when explicitly stated
- No read access is provided by this service

---

## Anti-Corruption Rules

- UI form structure must not leak into contracts
- Infrastructure errors must be mapped to domain errors

---

## Testability Guarantees

- Each command can be tested with mocked dependencies
- No reliance on UI or real persistence

