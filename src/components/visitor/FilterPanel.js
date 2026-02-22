/**
 * FilterPanel Component
 * 
 * Compact horizontal filter chips with dropdown menus.
 * As specified in specs/UI_guidelines.md and specs/phase_7_2_ui_visitor_game_library.md
 */

import { useState, useRef, useEffect } from 'react';
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
  [FirstPlayComplexity.MEDIUM]: 'Moyenne',
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

// Dropdown component for filter chips
function FilterDropdown({ label, icon, value, options, onSelect, isActive, multiSelect = false, selectedValues = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (multiSelect) {
      const isCurrentlySelected = selectedValues.includes(optionValue);
      onSelect(isCurrentlySelected 
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue]
      );
    } else {
      onSelect(optionValue);
      setIsOpen(false);
    }
  };

  const displayValue = multiSelect 
    ? (selectedValues.length > 0 ? selectedValues.map(v => options.find(o => o.value === v)?.label || v).join(', ') : null)
    : value;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-meta transition-colors ${
          isActive 
            ? 'bg-primary text-white' 
            : 'bg-white border border-border text-text-primary hover:border-primary'
        }`}
      >
        {icon && <span>{icon}</span>}
        <span className="font-medium">{label}</span>
        {displayValue && (
          <span className={isActive ? 'text-white/80' : 'text-text-secondary'}>
            {displayValue}
          </span>
        )}
        <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 min-w-[150px] py-1">
          {options.map((option) => {
            const isSelected = multiSelect 
              ? selectedValues.includes(option.value)
              : value === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-3 py-2 text-meta transition-colors ${
                  isSelected 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-primary hover:bg-cream'
                }`}
              >
                {multiSelect && (
                  <span className="mr-2">{isSelected ? '✓' : ' '}</span>
                )}
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Boolean filter chip (toggle)
function BooleanChip({ label, icon, isActive, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-meta transition-colors ${
        isActive 
          ? 'bg-primary text-white' 
          : 'bg-white border border-border text-text-primary hover:border-primary'
      }`}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

export default function FilterPanel({ filters, onFiltersChange, sortMode, onSortModeChange }) {
  const playerCountOptions = PLAYER_COUNT_BUCKETS.map(b => ({ value: b.label, label: b.label, ...b }));
  const durationOptions = Object.entries(DURATION_LABELS).map(([value, label]) => ({ value, label }));
  const complexityOptions = Object.entries(COMPLEXITY_LABELS).map(([value, label]) => ({ value, label }));
  const sortOptions = Object.entries(SORT_LABELS).map(([value, label]) => ({ value, label }));

  const activePlayerBucket = PLAYER_COUNT_BUCKETS.find(b => 
    filters.playerCount?.minPlayers === b.min && filters.playerCount?.maxPlayers === b.max
  );

  const handlePlayerCountSelect = (selectedLabel) => {
    const bucket = PLAYER_COUNT_BUCKETS.find(b => b.label === selectedLabel);
    if (bucket) {
      onFiltersChange({
        ...filters,
        playerCount: { minPlayers: bucket.min, maxPlayers: bucket.max },
      });
    }
  };

  const handleDurationSelect = (selectedValues) => {
    onFiltersChange({
      ...filters,
      playDuration: selectedValues.length > 0 ? { values: selectedValues } : null,
    });
  };

  const handleComplexitySelect = (selectedValues) => {
    onFiltersChange({
      ...filters,
      firstPlayComplexity: selectedValues.length > 0 ? { values: selectedValues } : null,
    });
  };

  const handleSortSelect = (value) => {
    onSortModeChange(value);
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

  const handleClearPlayerCount = () => {
    onFiltersChange({
      ...filters,
      playerCount: null,
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

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        {/* Player count filter */}
        <FilterDropdown
          label="Joueurs"
          icon="👥"
          value={activePlayerBucket?.label}
          options={playerCountOptions}
          onSelect={handlePlayerCountSelect}
          isActive={!!filters.playerCount}
        />

        {/* Duration filter */}
        <FilterDropdown
          label="Durée"
          icon="⏳"
          options={durationOptions}
          onSelect={handleDurationSelect}
          multiSelect
          selectedValues={filters.playDuration?.values || []}
          isActive={!!filters.playDuration}
        />

        {/* Complexity filter */}
        <FilterDropdown
          label="Complexité"
          icon="🧠"
          options={complexityOptions}
          onSelect={handleComplexitySelect}
          multiSelect
          selectedValues={filters.firstPlayComplexity?.values || []}
          isActive={!!filters.firstPlayComplexity}
        />

        {/* Boolean filters */}
        <BooleanChip
          label="Primés"
          icon="🏆"
          isActive={!!filters.hasAwards}
          onToggle={handleAwardsToggle}
        />

        <BooleanChip
          label="Favoris"
          icon="❤️"
          isActive={!!filters.favoriteOnly}
          onToggle={handleFavoriteToggle}
        />

        {/* Sort dropdown */}
        <FilterDropdown
          label="Trier"
          value={sortMode}
          options={sortOptions}
          onSelect={handleSortSelect}
          isActive={false}
        />

        {/* Clear filters */}
        {hasActiveFilters(filters) && (
          <button
            onClick={handleClearFilters}
            className="text-meta text-primary hover:underline ml-2"
          >
            Effacer tout
          </button>
        )}
      </div>
    </div>
  );
}