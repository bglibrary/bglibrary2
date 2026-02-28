# phase1_3_filtering_and_taxonomy_rules.md

## Filtering Rules

### Global Rule
- Filters are combined using logical AND across filter types.
- Behavior within a filter depends on its nature.

### Numeric / Range Filters
Examples:
- Number of players
- First play complexity

Rule:
- A game must satisfy all numeric constraints to be included.

### Categorical Multi-Value Filters
Examples:
- Categories
- Mechanics
- Play duration
- Themes

Rule:
- Multiple selected values within the same filter are combined using OR.
- Different filters are combined using AND.

### Boolean Filters
Examples:
- Favorite
- Has awards

Rule:
- Simple on/off behavior.
- Always combined using AND.

---

## Game Summary (GameCard) Rules

The game summary must display:
- Player count
- Play duration
- Award indicator (if any)
- Favorite indicator (if applicable)

First Play Complexity must not be displayed in the summary view.

---

## Player Count Bucketing

Filtering UI must expose predefined buckets:
- 1
- 2
- 3–4
- 5
- 6+

Definition:
- "6+" includes any game with maxPlayers >= 6.

---

## Controlled Vocabularies

### Awards
- Awards must be selected from a predefined enumeration.
- An "Other" option is allowed with free text.
- The admin is responsible for maintaining the relevance of the enum.

### Categories
- Categories must use predefined values from a controlled vocabulary.
- Predefined categories: Bluff, Coopératif, Affrontement, Mémoire, Chance, Rapidité, Devinette, Observation, Ambiance, Gestion, Aventure, Plis, Stratégie, Jeu de cartes, Jeu de plateau, Jeu de dés.
- An "Other" option is allowed with free text input.
- Custom values entered via "Other" are stored as-is but are not filterable individually.
- In filters, "Other" can be selected to find all games with custom categories.
- The admin decides if a new value should be promoted to the enum.

### Mechanics
- Mechanics must use predefined values from a controlled vocabulary.
- Predefined mechanics: Deck building, Placement d'ouvriers, Gestion de main, Lancer de dés, Pioche de tuiles, Enchères, Draft, Contrôle de zone, Course, Coopération, Bluff, Déduction, Push your luck, Majorité, Collection de sets, Échange.
- An "Other" option is allowed with free text input.
- Custom values entered via "Other" are stored as-is but are not filterable individually.
- In filters, "Other" can be selected to find all games with custom mechanics.
- The admin decides if a new value should be promoted to the enum.

