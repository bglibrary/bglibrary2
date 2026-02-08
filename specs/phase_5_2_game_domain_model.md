# Phase 5 — Data Contract: Game Domain Model

## Purpose
This document defines the canonical Game domain model.

It is the single source of truth for all game-related data across the system.

---

## Game

### Identifier

- `id: string`
  - Unique, stable identifier
  - Immutable once created

---

### Core Fields

- `title: string`
- `description: string`
- `minPlayers: number`
- `maxPlayers: number`
- `playDuration: PlayDuration`
- `ageRecommendation: AgeRange`
- `firstPlayComplexity: FirstPlayComplexity`

All core fields are mandatory.

---

### Classification

- `categories: Category[]`
- `mechanics: Mechanic[]`

Values must come from controlled vocabularies.

---

### Awards

- `awards: Award[]`

Award may be empty.

---

### Admin Flags

- `favorite: boolean`
- `archived: boolean`

Admin flags are not exposed to visitors unless explicitly mapped.

---

### Images

- `images: ImageDescriptor[]`

At least one image is mandatory.

---

## Supporting Types

### PlayDuration

- `SHORT`
- `MEDIUM`
- `LONG`

---

### FirstPlayComplexity

Discrete, ordered values:
- `LOW`
- `MEDIUM`
- `HIGH`

---

### AgeRange

Discrete typical values (explicit enum).

---

### Award

- `name: string`
- `year?: number`

---

### ImageDescriptor

- `id: string`
- `source?: string`
- `attribution?: string`

---

## Invariants

- `minPlayers <= maxPlayers`
- `images.length >= 1`
- Controlled vocabulary values must be valid
- Archived games retain full data

---

## Anti-Corruption Rules

- UI display labels must not appear in this model
- Persistence-specific fields must not appear here
- Optional fields must remain optional across all layers

---

## Error Conditions

- Missing mandatory field
- Invalid enum value
- Invalid player range

Errors must be explicit and typed.

