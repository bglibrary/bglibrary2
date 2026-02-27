# Phase 7 — UI Specification: Admin Game Editor (7_5)

## Purpose
This document specifies the Admin Game Editor screen with session-based management.

This screen is used to add or update a game. All changes are stored in the session history.

---

## Device Support

- **Desktop**: Full support (primary)
- **Tablet**: Full support (secondary)
- **Mobile**: Not supported (minimum width: 768px)

---

## Data Sources

- SessionHistory
  - `addAction(type, payload)`
  - `editAction(index, newPayload)`
- GameRepository (for edit mode)
  - `getGameById(id)`
- ImageAssetManager
  - Image validation

---

## Modes

### Add Mode
- URL: `/admin/add-game`
- Form is empty
- Submit creates ADD_GAME action

### Edit Mode
- URL: `/admin/edit-game/[id]`
- Form is pre-filled with existing game data
- If a pending UPDATE_GAME action exists for this game, form shows the pending data
- Submit creates UPDATE_GAME action (replaces existing one for same game)
- If submitted data matches original repository data, action is removed from history (diff behavior)

### Edit Action Mode
- Accessed from Session History Panel
- Form is pre-filled with action payload
- Submit updates the action in place (does not create new action)

---

## Displayed Elements

### Form Fields

#### Mandatory Fields
- **Title** (text input)
- **Description** (textarea)
- **Min Players** (number input)
- **Max Players** (number input)
- **Play Duration** (select: SHORT, MEDIUM, LONG)
- **Age Recommendation** (select)
- **First Play Complexity** (select: LOW, MEDIUM, HIGH)
- **Categories** (multi-select from predefined list)
- **Mechanics** (multi-select from predefined list + custom input option)
  - Predefined mechanics: Deck building, Draft, Bluff, Placement d'ouvriers, etc.
  - "Other" option allows custom mechanic name input
- **Images** (file upload with metadata)

#### Optional Fields
- **Awards** (dropdown with predefined list + custom input option)
  - Predefined awards: Spiel des Jahres, Kennerspiel des Jahres, As d'Or, etc.
  - "Other" option allows custom award name input
  - Year field (optional)
- **Favorite** (checkbox)

### Image Upload
- File input for image selection
- Source field (text)
- Attribution field (text)
- Preview of uploaded images
- Remove image button

### Action Buttons
- "Save" button (primary)
- "Cancel" button (secondary)

### Sticky Action Bar (Edit Mode)
When editing an existing game, a sticky action bar appears at the bottom of the screen as soon as any modification is made:
- **Position**: Fixed at bottom of viewport
- **Visibility**: Only visible when form has unsaved changes
- **Content**: Same "Save" and "Cancel" buttons as inline form
- **Behavior**: 
  - Appears immediately on first field change
  - Stays visible while scrolling
  - Submits the form via the `form` attribute
- **Layout**: 
  - White background with top border and shadow
  - Centered within max-width container
  - Padding added to form container to prevent content overlap

---

## User Actions

### Save (Add Mode)
1. Validate form data
2. Generate unique game ID from title
3. Call `SessionHistory.addAction('ADD_GAME', gameData)`
4. Navigate back to Admin Dashboard

### Save (Edit Mode)
1. Validate form data
2. Call `SessionHistory.addAction('UPDATE_GAME', gameData)`
3. Navigate back to Admin Dashboard

### Save (Edit Action Mode)
1. Validate form data
2. Call `SessionHistory.editAction(actionIndex, newPayload)`
3. Navigate back to Admin Dashboard

### Cancel
- Discard changes
- Navigate back to Admin Dashboard
- No confirmation if form is unchanged
- Confirmation dialog if form has changes

---

## Validation Rules

### Client-Side Validation
- All mandatory fields must be filled
- `minPlayers >= 1` (minimum 1 player)
- `maxPlayers >= 1` (minimum 1 player)
- `minPlayers <= maxPlayers`
- At least one image required
- Categories and mechanics from controlled vocabularies
- Age recommendation from controlled vocabulary

### Validation Feedback
- Inline error messages per field
- Summary of errors at form top
- Submit button disabled until valid

---

## Screen States

### Idle (Form Ready)
- Form editable
- Save button enabled

### Validating
- Form submission in progress
- Save button disabled
- Loading indicator

### Success
- Action added/updated in session history
- Redirect to Admin Dashboard
- Success toast notification

### Error
- Validation errors displayed
- Form remains editable
- User can correct and retry

---

## Form Change Detection

- Track initial form state
- Compare current state on cancel
- Show confirmation if changes exist:
  - Title: "Modifications non enregistrées"
  - Message: "Voulez-vous abandonner vos modifications ?"
  - Actions: Annuler / Abandonner

### Visual Diff (Edit Mode Only)

When editing an existing game, modified fields are visually highlighted:

- **Border highlight**: Modified fields have a primary color border (2px) with a subtle ring
- **Label indicator**: A "● modifié" badge appears next to the field label
- **Background highlight**: For checkbox fields, a light primary background is applied

This applies to all form fields:
- Text inputs (title, mechanics)
- Number inputs (min/max players)
- Textarea (description)
- Dropdowns (duration, complexity, age)
- Multi-select (categories)
- Award list
- Checkbox (favorite)

The visual diff helps users quickly identify which fields have been modified before saving.

---

## ID Generation (Add Mode)

- Auto-generate game ID from title
- Convert to lowercase
- Replace spaces with hyphens
- Remove special characters
- Example: "Catan (Updated)" → "catan-updated"
- Check for duplicates in existing games
- Append number if duplicate: "catan-updated-2"

---

## Invariants

- No partial updates
- Form validation must pass before submission
- All changes go to session history (no direct persistence)
- Image files are validated before form submission

---

## Testability

- Screen testable with mocked session history service
- Form validation testable in isolation
- ID generation testable in isolation
- Each mode independently testable