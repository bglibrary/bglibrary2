# Phase 4 — Component Spec: GitService (Contract)

## Role
The GitService encapsulates all interactions with the Git-based persistence layer.

It exposes a stable, technology-agnostic contract to the application layer.

---

## Responsibilities

- Persist game data changes
- Persist image assets
- Create atomic commits representing admin operations

---

## Non-Responsibilities

- Validating domain data
- Orchestrating admin workflows
- Exposing Git concepts to higher layers
- Reading data for visitor use

---

## Public Interface

The interface is defined as an explicit contract:

- `addGame(gameData)`
- `updateGame(gameId, gameData)`
- `archiveGame(gameId)`
- `restoreGame(gameId)`

All methods are asynchronous and return success or explicit errors.

---

## Persistence Guarantees

- Each operation results in a single atomic commit
- Partial writes are forbidden
- Commit messages must be deterministic and structured

---

## Invariants

- No operation may silently overwrite unrelated files
- Data written must be exactly what was provided by the caller
- No implicit data normalization

---

## Anti-Corruption Rules

- Git concepts (branches, tokens, PRs) must not leak beyond this component
- File formats (JSON vs Markdown) must be opaque to callers
- Repository layout must not be assumed by higher layers

---

## Error Handling

- Authentication failure
- Write conflict
- Repository unavailable
- Invalid path or permissions

Errors must be explicit and typed.

---

## Test Strategy

### Contract Tests

- Successful execution of each public method
- Atomicity verification

### Negative Tests

- Simulated Git failures
- Partial write prevention

All tests must run against mocks or fakes, never a real repository.

