# Phase 4 — Component Spec: ImageAssetManager

## Role
The ImageAssetManager is responsible for validating and managing image assets associated with games.

It enforces image-related constraints independently from persistence or UI concerns.

---

## Responsibilities

- Validate image files
- Enforce image constraints (format, size, presence)
- Manage image metadata (source, attribution)

---

## Non-Responsibilities

- Uploading images to storage
- Rendering images
- Persisting metadata
- UI-level validation

---

## Inputs

- `ImageFile`
- `ImageMetadata`

---

## Outputs

- Validated image descriptor
- Explicit validation errors

---

## Validation Rules

- At least one image is mandatory per game
- Supported formats must be explicitly enumerated
- Image attribution metadata must be present when required

---

## Invariants

- Validation rules are deterministic
- No mutation of original image data

---

## Anti-Corruption Rules

- Storage paths must not leak into this component
- UI file picker constraints must not be relied upon

---

## Error Handling

- Unsupported format
- Missing mandatory image
- Missing attribution metadata

Errors must be explicit and typed.

---

## Test Strategy

### Unit Tests

- Valid image acceptance
- Rejection of unsupported formats
- Mandatory image enforcement
- Attribution metadata validation

### Negative Tests

- Empty image list
- Corrupted image input

All tests must be executable without UI, repository, or network dependencies.

