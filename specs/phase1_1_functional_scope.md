# phase1_1_functional_scope.md

## In Scope

### Game Library
- The system must maintain a single board game library.
- Each game must have a dedicated detail view.
- Each game must expose sufficient information to support decision-making.

### Game Information
Each game must support, at minimum:
- Title
- One or more images (mandatory)
- Short description
- Player count (minimum and maximum)
- Typical play duration
  - Short: less than 20 minutes
  - Medium: betwenen 20 and 45 minutes
  - Long: more than 45 minutes
- Age recommendation (discrete typical games values)
- First Play Complexity:
  - A single indicator representing the overall effort required for a first play
  - Includes rules explanation, setup effort, and initial cognitive load
  - Intentionally coarse-grained and subjective
- Game categories and/or mechanics
- Awards:
  - Zero or more awards
  - Each award must include at least a name and a year (if applicable)
- Admin-only flags:
  - “Favorite” (coup de cœur), controlled exclusively by the owner

### Browsing & Discovery
- Users must be able to browse the full list of games.
- Users must be able to filter games using multiple criteria:
  - Number of players
  - Play duration
  - First Play Complexity
  - Categories or mechanics
  - Games with at least one award
  - Admin “Favorite” flag
- Users must be able to sort game lists using simple ordering rules (e.g. duration, first play complexity).

### Game Selection Assistance
- The system must provide guidance to help users choose a game.
- Assistance must be based on explicit user inputs (e.g. number of players, available time).
- The guidance must be deterministic and explainable.
- The system must not rely on opaque or learning-based recommendations.

### Administration (Owner Only)
- The owner must be able to:
  - Add a new game
  - Update existing game information
  - Mark or unmark a game as “Favorite”
  - Add, update, or remove awards for a game
  - Archive a game
  - Restore an archived game
- Archived games:
  - Must not be visible to visitors
  - Must remain accessible to the owner for restoration
- Administrative actions must result in a consistent and updated public library.

### Device Support
- The product must be usable on:
  - Tablets (primary)
  - Mobile phones (secondary)
  - Desktop / laptop computers (tertiary)
- All core functionalities must be available on all supported devices.

### Language
- The site content is monolingual.
- All user-facing content is in French.

---

## Explicit Non-Goals

- Multiple libraries or collections
- User accounts for visitors
- Social features (comments, ratings, reviews)
- Multiplayer or real-time collaboration
- Usage analytics or tracking
- Monetization or advertising
- Offline usage
- Game availability or stock management
- Versioning of game information
