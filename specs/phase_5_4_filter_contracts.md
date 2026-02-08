# Phase 5 — Data Contracts: Filter Contracts

## Purpose
This document defines the explicit contracts for all filtering inputs applied to game lists.

Filters are domain-driven and UI-agnostic.

---

## FilterSet

The FilterSet represents a complete set of active filters.

- `playerCount?: PlayerCountFilter`
- `playDuration?: PlayDurationFilter`
- `firstPlayComplexity?: ComplexityFilter`
- `categories?: CategoryFilter`
- `mechanics?: MechanicFilter`
- `hasAwards?: boolean`
- `favoriteOnly?: boolean`

All filters are optional. Absence means no constraint.

---

## PlayerCountFilter

- `minPlayers: number`
- `maxPlayers: number`

---

## PlayDurationFilter

- `values: PlayDuration[]`

Multiple values are combined using logical OR.

---

## ComplexityFilter

- `values: FirstPlayComplexity[]`

Multiple values are combined using logical OR.

---

## CategoryFilter

- `values: Category[]`

Multiple values are combined using logical OR.

---

## MechanicFilter

- `values: Mechanic[]`

Multiple values are combined using logical OR.

---

## Invariants

- All filters are combined using logical AND
- Empty filter values are forbidden
- Filter values must come from controlled vocabularies

---

## Anti-Corruption Rules

- UI buckets or labels must not appear in contracts
- Display-specific groupings must not leak into this layer

---

## Error Conditions

- Invalid enum values
- Empty value arrays

Errors must be explicit and typed.

