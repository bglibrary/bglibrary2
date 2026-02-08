# Phase 5 — Data Contracts: Image Asset Contracts

## Purpose
This document defines the data contracts related to image assets used by games.

It formalizes the inputs and outputs exchanged between AdminGameService, ImageAssetManager, and persistence layers.

---

## ImageFile

Represents a raw image provided by the admin.

- `filename: string`
- `contentType: string`
- `sizeInBytes: number`
- `binary: Binary`

---

## ImageMetadata

Metadata associated with an image.

- `source?: string`
- `attribution?: string`

Both fields are optional but may become mandatory depending on validation rules.

---

## ImageDescriptor

Represents a validated, domain-level image reference.

- `id: string`
- `source?: string`
- `attribution?: string`

This descriptor is the only image representation allowed in the Game domain model.

---

## Validation Outcomes

Image validation returns either:
- a valid `ImageDescriptor`
- or a typed error

---

## Error Types

- `UnsupportedImageFormat`
- `ImageTooLarge`
- `MissingMandatoryImage`
- `MissingAttributionMetadata`
- `CorruptedImage`

---

## Invariants

- Raw image binaries must never appear in the Game domain model
- ImageDescriptor IDs are immutable once generated
- Validation is deterministic

---

## Anti-Corruption Rules

- Storage paths or URLs must not appear in any contract
- UI-specific file picker constraints must not leak

---

## Test Strategy

- Validation of supported formats
- Size limit enforcement
- Attribution rules enforcement
- Descriptor immutability checks

All tests must be executable without UI or real storage dependencies.

