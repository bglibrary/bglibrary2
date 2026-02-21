# UI Specification — Notre Ludothèque  
Version: 1.1  
Status: Visual & Design System Reference  
Scope: Visitor Interface (Responsive) + Admin Interface (Tablet/Desktop Only, Offline Mode)

---

# 1. Purpose of This Document

This document defines the complete UI specification for **Notre Ludothèque**.

It provides:

- A deterministic visual reference.
- A complete design system definition.
- Explicit interaction rules.
- Clear separation between Visitor and Admin behaviors.
- Explicit definition of the Admin offline workflow.

This document is binding for all UI implementation.

---

# 2. Global Design Principles

## 2.1 Design Philosophy

- Warm, modern, curated.
- Friendly but not playful.
- Clean SaaS-grade UI.
- Content-first (board games dominate visually).
- Deterministic interactions.
- No decorative complexity.

---

# 3. Design System

## 3.1 Color Palette

### Background
- Warm cream: `#F7F4EF`

### Card Surface
- White: `#FFFFFF`

### Primary Accent
- Muted terracotta: `#C86A4A`

### Secondary Accent
- Muted green: `#6A8F7B`

### Text
- Primary: `#2E2E2E`
- Secondary: `#6B6B6B`
- Muted: `#B5B5B5`

### Borders
- `#E5E2DD`

### Semantic
- Award badge: `#C9A227`
- Favorite: `#D45C5C`
- Delete (danger): `#B94A48`
- Neutral action icons: `#555555`

No high-saturation colors.

---

## 3.2 Typography

Modern geometric sans-serif.

Hierarchy:

| Element | Weight | Size |
|----------|--------|------|
| Page Title | SemiBold | 28px |
| Modal Title | Medium | 22px |
| Section Title | Medium | 20px |
| Card Title | Medium | 18px |
| Body | Regular | 15px |
| Meta | Regular | 13px |
| Button | Medium | 14px |

---

## 3.3 Spacing System

Base unit: 8px.

Card padding: 16–20px.  
Grid gap: 16px.  
Section spacing: 24–32px.

---

## 3.4 Radius

- Cards: 16px
- Modal: 20px
- Buttons: 12px
- Chips: pill 20px

---

## 3.5 Shadows

Card:
`0 4px 12px rgba(0,0,0,0.06)`

Modal:
`0 12px 40px rgba(0,0,0,0.15)`

No aggressive elevation.

---

# 4. Icon System

Icons must be consistent stroke style, rounded edges.

Required icons:

- Trophy (award)
- Heart (favorite toggle)
- Hourglass (duration)
- Pencil (edit)
- Archive box
- Trash (delete change)
- Plus
- Search
- Download / Export
- Close (X)

Admin action buttons must be **icon-only** (no text labels).

Icons must remain understandable without tooltips.

---

# 5. Visitor Interface

## 5.1 Layout

Header:
- Title “Notre Ludothèque”
- No navigation menu.

Below header:
- Horizontal filter chips.

Main area:
- Grid of cards (3–4 columns tablet/desktop).
- Two columns on mobile.

Decision helper:
- Hidden by default.
- Appears as left-side panel on tablet/desktop.
- Drawer on mobile.

Grid must be primary visual focus.

---

## 5.2 Game Card

Contains:

- Large image
- Title
- Player count
- Duration (1–3 hourglass fill levels)
- Award badge (if exists)
- Favorite heart (if true)

Card hover:
- Slight elevation
- Cursor pointer

Clicking a card opens a modal.

---

# 6. Game Detail Modal (Visitor)

## 6.1 Behavior

- Opens centered.
- Background dimmed overlay.
- Close via:
  - X icon
  - Clicking outside
  - Escape key

No page navigation change.

---

## 6.2 Modal Layout

Top section:
- Large image (or image carousel if multiple)
- Title
- Player count
- Duration
- Complexity indicator
- Award list
- Favorite badge if applicable

Body:
- Short description
- Categories / mechanics
- Awards list with year

Footer:
- Close button only (no CTA).

Modal must feel premium, calm, breathable.

---

# 7. Admin Interface (Offline Mode)

## 7.1 Responsiveness

Admin supports:
- Tablet
- Desktop

Mobile optimization is NOT required.

---

## 7.2 Offline Philosophy

Admin does NOT push changes live.

All actions:

- Stored locally
- Session-scoped
- Accumulated into a change history

From the first change onward:

- A button “Export Changes” becomes visible.

Export generates:
- Downloadable Python script.
- Script contains instructions to apply changes and perform commits externally.

---

# 8. Admin Dashboard

Structure:

Header:
- “Notre Ludothèque”
- Search bar
- + Add Game button

Grid:
- Same visual structure as visitor
- Cards include:
  - Image
  - Title
  - Player count
  - Duration
  - Award badge
  - Icon-only action buttons at bottom:
    - Pencil (edit)
    - Archive
    - Heart toggle

No text labels on actions.

---

# 9. Admin Form (Add / Edit)

Sections:

1. Main Info
   - Title
   - Description
   - Min/Max players
   - Duration selector
   - Complexity selector

2. Images
   - Drag & drop
   - Preview thumbnails

3. Awards
   - Award name
   - Year

4. Flags
   - Favorite toggle

Submit button:
- “Valider”

No “Save & Commit”.

Form must feel consistent with design system.

---

# 10. Change History View (Admin)

Accessible from header.

Purpose:
- Visualize all pending changes in session.

---

## 10.1 Layout

List or stacked cards of changes.

Each change displays:

- Change type (Add / Update / Archive / Toggle Favorite)
- Target game
- Timestamp (session-relative)
- Summary of modification

Each change item has:

- Trash icon → delete change
- Pencil icon → edit change (if created via form)

Icon-only.

---

## 10.2 Export Section

At top or bottom:

Prominent button:
- “Export Changes”
- Download icon

Button visible only if at least one change exists.

---

# 11. Interaction Rules

- No real-time backend calls.
- No auto-save.
- All changes local until export.
- Delete change must immediately remove it from history.
- Editing a change must reopen pre-filled form.

---

# 12. Visual Tone Enforcement

Must feel:

- Curated
- Personal
- Controlled
- Stable
- Warm

Must NOT feel:

- Corporate enterprise dashboard
- Overly playful
- Over-animated
- Experimental

---

# 13. Non-Ambiguity Rule

If a UI behavior or visual rule is not defined:

- Default to consistency.
- Do not invent new components.
- Do not introduce new visual patterns.
- Do not introduce mobile adaptation for admin.

This document is the single source of visual truth.