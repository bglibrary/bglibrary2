# Phase 5 — Service Contracts: GitService Errors

## Purpose
This document defines the explicit error model exposed by the GitService to higher layers.

It ensures that infrastructure failures are mapped to stable, domain-meaningful errors.

---

## Design Principles

- Errors are explicit and typed
- No raw infrastructure errors leak to application layers
- Error set is finite and documented

---

## Error Types

### AuthenticationError

- Invalid or missing credentials
- Expired or revoked token

---

### AuthorizationError

- Insufficient permissions on repository or path

---

### RepositoryUnavailable

- Network failure
- Git provider unavailable

---

### WriteConflict

- Concurrent modification detected
- Optimistic lock failure

---

### InvalidPath

- Target file or directory does not exist
- Invalid repository layout

---

### UnknownPersistenceError

- Any error not covered above
- Must include a stable error code

---

## Error Mapping Rules

- Git-specific messages must not propagate
- Errors must be mapped deterministically
- Mapping must be one-to-one

---

## Invariants

- Same failure condition must always map to the same error type
- No error swallowing

---

## Anti-Corruption Rules

- HTTP status codes must not appear in this contract
- Provider-specific terminology must not leak

---

## Test Strategy

- Simulated failures mapped to each error type
- Verification of deterministic mapping

All tests must run without a real Git provider.

