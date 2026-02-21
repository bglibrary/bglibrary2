/**
 * FilterPanel Component
 * 
 * Horizontal filter chips for visitor interface.
 * As specified in specs/UI_guidelines.md and specs/phase_7_2_ui_visitor_game_library.md
 */

import { PlayDuration, FirstPlayComplexity } from '@/domain/Game';
import { SortMode } from '@/engines/SortingEngine';
import { hasActiveFilters } from '@/domain/Filters';

// Player count buckets as defined in specs
const PLAYER_COUNT_BUCKETS = [
  { label: '1 joueur', min: 1, max: 1 },
  { label: '2 joueurs', min: 2, max: 2 },
  { label: '3-4 joueurs', min: 3, max: 4 },
  { label: '5 joueurs', min: 5, max: 5 },
  { label: '6+ joueurs', min: 6, max: 99 },
];

const DURATION_LABELS = {
  [PlayDuration.SHORT]: 'Court',
  [PlayDuration.MEDIUM]: 'Moyen',
  [PlayDuration.LONG]: 'Long',
};

const COMPLEXITY_LABELS = {
  [FirstPlayComplexity.LOW]: 'Simple',
  [FirstPlayComplexity.MEDIUM]: 'Moyen',
  [FirstPlayComplexity.HIGH]: 'Complexe',
};

const SORT_LABELS = {
  [SortMode.TITLE_ASC]: 'Titre A-Z',
  [SortMode.TITLE_DESC]: 'Titre Z-A',
  [SortMode.PLAY_DURATION_ASC]: 'Durée ↑',
  [SortMode.PLAY_DURATION_DESC]: 'Durée ↓',
  [SortMode.FIRST_PLAY_COMPLEXITY_ASC]: 'Complexité ↑',
  [SortMode.FIRST_PLAY_COMPLEXITY_DESC]: 'Complexité ↓',
};

export default function FilterPanel({ filters, onFiltersChange, sortMode, onSortModeChange }) {
  const handlePlayerCountToggle = (bucket) => {
    const currentFilter = filters.playerCount;
    const isActive = currentFilter && 
      currentFilter.minPlayers === bucket.min && 
      currentFilter.maxPlayers === bucket.max;
    
    onFiltersChange({
      ...filters,
      playerCount: isActive ? null : { minPlayers: bucket.min, maxPlayers: bucket.max },
    });
  };

  const handleDurationToggle = (duration) => {
    const currentValues = filters.playDuration?.values || [];
    const isActive = currentValues.includes(duration);
    
    const newValues = isActive
      ? currentValues.filter(d => d !== duration)
      : [...currentValues, duration];
    
    onFiltersChange({
      ...filters,
      playDuration: newValues.length > 0 ? { values: newValues } : null,
    });
  };

  const handleComplexityToggle = (complexity) => {
    const currentValues = filters.firstPlayComplexity?.values || [];
    const isActive = currentValues.includes(complexity);
    
    const newValues = isActive
      ? currentValues.filter(c => c !== complexity)
      : [...currentValues, complexity];
    
    onFiltersChange({
      ...filters,
      firstPlayComplexity: newValues.length > 0 ? { values: newValues } : null,
    });
  };

  const handleAwardsToggle = () => {
    onFiltersChange({
      ...filters,
      hasAwards: filters.hasAwards ? null : true,
    });
  };

  const handleFavoriteToggle = () => {
    onFiltersChange({
      ...filters,
      favoriteOnly: filters.favoriteOnly ? null : true,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      playerCount: null,
      playDuration: null,
      firstPlayComplexity: null,
      categories: null,
      mechanics: null,
      hasAwards: null,
      favoriteOnly: null,
    });
  };

  const isPlayerCountActive = (bucket) => {
    return filters.playerCount && 
      filters.playerCount.minPlayers === bucket.min && 
      filters.playerCount.maxPlayers === bucket.max;
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Player count filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-meta text-text-secondary mr-2">Joueurs:</span>
        {PLAYER_COUNT_BUCKETS.map(bucket => (
          <button
            key={bucket.label}
            onClick={() => handlePlayerCountToggle(bucket)}
            className={`chip ${isPlayerCountActive(bucket) ? 'chip-active' : ''}`}
          >
            {bucket.label}
          </button>
        ))}
      </div>

      {/* Duration filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-meta text-text-secondary mr-2">Durée:</span>
        {Object.entries(DURATION_LABELS).map(([value, label]) => (
          <button
            key={value}
            onClick={() => handleDurationToggle(value)}
            className={`chip ${(filters.playDuration?.values || []).includes(value) ? 'chip-active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Complexity filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-meta text-text-secondary mr-2">Complexité:</span>
        {Object.entries(COMPLEXITY_LABELS).map(([value, label]) => (
          <button
            key={value}
            onClick={() => handleComplexityToggle(value)}
            className={`chip ${(filters.firstPlayComplexity?.values || []).includes(value) ? 'chip-active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Boolean filters and sort */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleAwardsToggle}
          className={`chip ${filters.hasAwards ? 'chip-active' : ''}`}
        >
          🏆 Primés
        </button>
        
        <button
          onClick={handleFavoriteToggle}
          className={`chip ${filters.favoriteOnly ? 'chip-active' : ''}`}
        >
          ❤️ Favoris
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-meta text-text-secondary">Trier:</span>
          <select
            value={sortMode}
            onChange={(e) => onSortModeChange(e.target.value)}
            className="chip bg-white cursor-pointer"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters(filters) && (
        <button
          onClick={handleClearFilters}
          className="text-meta text-primary hover:underline"
        >
          Effacer les filtres
        </button>
      )}
    </div>
  );
}