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

### Light Mode (Default)

#### Background
- Warm cream: `#F7F4EF`

#### Card Surface
- White: `#FFFFFF`

#### Primary Accent
- Muted terracotta: `#C86A4A`

#### Secondary Accent
- Muted green: `#6A8F7B`

#### Text
- Primary: `#2E2E2E`
- Secondary: `#6B6B6B`
- Muted: `#B5B5B5`

#### Borders
- `#E5E2DD`

#### Semantic
- Award badge: `#C9A227`
- Favorite: `#D45C5C`
- Delete (danger): `#B94A48`
- Neutral action icons: `#555555`

### Dark Mode

#### Background
- Dark charcoal: `#1A1A1A`

#### Card Surface
- Dark gray: `#2A2A2A`

#### Primary Accent
- Light terracotta: `#D4856A`

#### Secondary Accent
- Light green: `#7AA88B`

#### Text
- Primary: `#F0F0F0`
- Secondary: `#A0A0A0`
- Muted: `#6B6B6B`

#### Borders
- `#3A3A3A`

#### Semantic
- Award badge: `#D4B227`
- Favorite: `#E06060`
- Delete (danger): `#D45A58`
- Neutral action icons: `#B0B0B0`

No high-saturation colors.

---

## 3.2 Theme Management

### Theme Toggle
- **Location**: Header (both visitor and admin interfaces)
- **Icon**: Sun (☀️) for light mode, Moon (🌙) for dark mode
- **Behavior**: 
  - Click toggles between light and dark themes
  - Theme preference is persisted in localStorage
  - Default follows OS preference (`prefers-color-scheme`)

### System Preference Detection
- On first load, the application checks:
  1. localStorage for saved preference
  2. OS preference via `prefers-color-scheme` media query
- If no saved preference, follows OS setting
- Automatically updates when OS theme changes (if using system preference)

### Implementation
- Theme is managed via `ThemeContext` provider
- Dark mode is applied by adding `.dark` class to `<html>` element
- CSS variables are redefined in dark mode for automatic color switching

### Dark Mode Support for Components
All UI components must support dark mode using CSS variables:
- **Background colors**: Use `bg-card` instead of `bg-white`
- **Text colors**: Use `text-text-primary`, `text-text-secondary`, `text-text-muted`
- **Border colors**: Use `border-border`
- **Hover states**: Use `hover:bg-cream dark:hover:bg-cream/10` pattern
- **Confirmation dialogs**: Must use `bg-card` background and proper text/border variables

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
- Brain (complexity)
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

## 5.2 Game Card (Visitor)

**Card with title below image and overlay info band:**

- **Card container**:
  - White background with rounded corners (`rounded-xl`)
  - Shadow and border for "tile" appearance
  - Padding around image to create cream/white frame effect
  - Hover effect: elevation + slight lift (`hover:shadow-xl hover:-translate-y-1`)

- **Square image** (aspect-ratio 1:1)
  - Uses `object-contain` to preserve image proportions without cropping
  - Rounded corners inside the padding

- **Info band overlay** at bottom of image:
  - Semi-transparent black background with blur (`bg-black/60 backdrop-blur-sm`)
  - Fixed layout: **32% 32% 18% 18%** for 4 positions
  - Position 1 (32%): Players 👥 + range - left aligned
  - Position 2 (32%): Duration hourglasses (⏳⏳⏳) - centered
  - Position 3 (18%): Award trophy (🏆) - centered (invisible if not applicable)
  - Position 4 (18%): Favorite heart (❤️) - right aligned (invisible if not applicable)
  - Each position is fixed regardless of whether the icon is displayed

- **Title below image**:
  - Truncated if too long
  - Padding for spacing

Card hover:
- Shadow elevation + slight vertical lift
- Cursor pointer

Clicking a card opens a modal.

**Grid Layout**: 5-6 columns on desktop (`lg:grid-cols-5 xl:grid-cols-6`).

**Shared Component**: `src/components/common/GameCard.js` exports:
- `VisitorGameCard`: Card with title and info overlay
- `AdminGameCard`: Compact card with action buttons overlay
- `GameImage`: Reusable image component

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
- **Square image** (aspect-ratio 1:1)
  - Uses `object-contain` to preserve image proportions without cropping
  - Centered within the modal header
  - Maximum width constraint to avoid excessive size
- Title
- Player count
- Duration
- Complexity indicator
- Award list
- Favorite badge if applicable

**Shared Component**: Uses `GameImage` component from `src/components/common/GameCard.js`.

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
- "Notre Ludothèque"
- Search bar
- + Add Game button

Grid:
- **Compact cards** with action buttons overlay
- **Square image** (aspect-ratio 1:1) with `object-contain`
- **Action band overlay** at bottom of image:
  - Semi-transparent black background with blur
  - Icon-only action buttons (white):
    - Pencil (edit)
    - Archive/Restore
    - Heart toggle (favorite)
- **Grid Layout**: 6 columns on desktop for compact display
- No title or info displayed on card (image only)

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