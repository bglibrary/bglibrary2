import React, { useState, useEffect } from "react";
import { PLAY_DURATION_VALUES, FIRST_PLAY_COMPLEXITY_VALUES, CATEGORIES, MECHANICS } from "../src/domain/types";
import { SORT_MODES, SORT_MODE_VALUES } from "../src/filtering/sortingTypes";

/**
 * Filter panel — optional filters and sort mode. No domain logic; values passed from parent.
 * @param {{ filters: import("../src/filtering/filterTypes").FilterSet, sortMode: import("../src/filtering/sortingTypes").SortMode, onFiltersChange: (filters: import("../src/filtering/filterTypes").FilterSet) => void, onSortChange: (sortMode: import("../src/filtering/sortingTypes").SortMode) => void }}
 * @see specs/phase_7_2_ui_visitor_game_library.md, phase1_3_filtering_and_taxonomy_rules.md
 */
export default function FilterPanel({ filters, sortMode, onFiltersChange, onSortChange }) {
  const [currentFilters, setCurrentFilters] = useState(filters || {});
  const [currentSortMode, setCurrentSortMode] = useState(sortMode || "");

  useEffect(() => {
    setCurrentFilters(filters);
  }, [filters]);

  useEffect(() => {
    setCurrentSortMode(sortMode);
  }, [sortMode]);

  const handlePlayerCountChange = (e) => {
    const value = e.target.value;
    let newPlayerCountFilter = undefined;
    if (value !== "") {
      const [min, max] = value.split("-").map(Number);
      newPlayerCountFilter = { minPlayers: min, maxPlayers: max || min };
    }
    const newFilters = { ...currentFilters, playerCount: newPlayerCountFilter };
    if (newPlayerCountFilter === undefined) delete newFilters.playerCount;
    setCurrentFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleMultiValueChange = (filterName, value, isChecked) => {
    const currentValues = currentFilters[filterName]?.values || [];
    const newValues = isChecked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    const newFilter = { values: newValues };
    const newFilters = { ...currentFilters, [filterName]: newFilter };
    if (newValues.length === 0) delete newFilters[filterName];
    setCurrentFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleBooleanFilterChange = (filterName, isChecked) => {
    const newFilters = { ...currentFilters, [filterName]: isChecked };
    if (!isChecked) delete newFilters[filterName];
    setCurrentFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSortModeChange = (e) => {
    const newMode = e.target.value;
    setCurrentSortMode(newMode);
    onSortChange(newMode);
  };

  const handleClearFilters = () => {
    setCurrentFilters({});
    setCurrentSortMode("");
    onFiltersChange({});
    onSortChange("");
  };

  const playerCountOptions = [
    { label: "1 joueur", value: "1-1", min: 1, max: 1 },
    { label: "2 joueurs", value: "2-2", min: 2, max: 2 },
    { label: "3-4 joueurs", value: "3-4", min: 3, max: 4 },
    { label: "5 joueurs", value: "5-5", min: 5, max: 5 },
    { label: "6+ joueurs", value: "6-100", min: 6, max: 100 }, // Arbitrary max for "6+"
  ];

  const isPlayerCountSelected = (optionMin, optionMax) => {
    const filter = currentFilters.playerCount;
    if (!filter) return false;
    // Simple check: if filter range is within option range, or vice versa for exact match
    // More complex logic might be needed for precise range overlap
    return filter.minPlayers === optionMin && filter.maxPlayers === optionMax; // Strict equality for now
  };

  return (
    <aside data-testid="filter-panel" className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 flex flex-wrap gap-4">
      {/* Sort Mode */}
      <div className="flex items-center">
        <label htmlFor="sort-mode" className="text-gray-700 mr-2">Trier par :</label>
        <select
          id="sort-mode"
          data-testid="sort-select"
          className="border rounded-md p-2"
          value={currentSortMode || ""}
          onChange={handleSortModeChange}
        >
          <option value="">(Aucun tri)</option>
          {SORT_MODE_VALUES.map((mode) => (
            <option key={mode} value={mode}>
              {mode === SORT_MODES.PLAY_DURATION_ASC && "Durée (croissante)"}
              {mode === SORT_MODES.PLAY_DURATION_DESC && "Durée (décroissante)"}
              {mode === SORT_MODES.FIRST_PLAY_COMPLEXITY_ASC && "Complexité (croissante)"}
              {mode === SORT_MODES.FIRST_PLAY_COMPLEXITY_DESC && "Complexité (décroissante)"}
            </option>
          ))}
        </select>
      </div>

      {/* Player Count Filter */}
      <div className="flex items-center">
        <label htmlFor="player-count" className="text-gray-700 mr-2">Joueurs :</label>
        <select
          id="player-count"
          data-testid="player-count-select"
          className="border rounded-md p-2"
          value={currentFilters.playerCount ? `${currentFilters.playerCount.minPlayers}-${currentFilters.playerCount.maxPlayers}` : ""}
          onChange={handlePlayerCountChange}
        >
          <option value="">(Tous)</option>
          {playerCountOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Play Duration Filter */}
      <div className="flex flex-col">
        <span className="text-gray-700 mb-1">Durée :</span>
        <div className="flex gap-2">
          {PLAY_DURATION_VALUES.map((duration) => (
            <label key={duration} className="flex items-center">
              <input
                type="checkbox"
                className="mr-1"
                checked={currentFilters.playDuration?.values?.includes(duration) || false}
                onChange={(e) => handleMultiValueChange("playDuration", duration, e.target.checked)}
              />
              {duration}
            </label>
          ))}
        </div>
      </div>

      {/* First Play Complexity Filter */}
      <div className="flex flex-col">
        <span className="text-gray-700 mb-1">Complexité :</span>
        <div className="flex gap-2">
          {FIRST_PLAY_COMPLEXITY_VALUES.map((complexity) => (
            <label key={complexity} className="flex items-center">
              <input
                type="checkbox"
                className="mr-1"
                checked={currentFilters.firstPlayComplexity?.values?.includes(complexity) || false}
                onChange={(e) => handleMultiValueChange("firstPlayComplexity", complexity, e.target.checked)}
              />
              {complexity}
            </label>
          ))}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-col">
        <span className="text-gray-700 mb-1">Catégories :</span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                className="mr-1"
                checked={currentFilters.categories?.values?.includes(category) || false}
                onChange={(e) => handleMultiValueChange("categories", category, e.target.checked)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      {/* Mechanics Filter */}
      <div className="flex flex-col">
        <span className="text-gray-700 mb-1">Mécaniques :</span>
        <div className="flex flex-wrap gap-2">
          {MECHANICS.map((mechanic) => (
            <label key={mechanic} className="flex items-center">
              <input
                type="checkbox"
                className="mr-1"
                checked={currentFilters.mechanics?.values?.includes(mechanic) || false}
                onChange={(e) => handleMultiValueChange("mechanics", mechanic, e.target.checked)}
              />
              {mechanic}
            </label>
          ))}
        </div>
      </div>

      {/* Boolean Filters */}
      <div className="flex items-center">
        <label className="flex items-center mr-4">
          <input
            type="checkbox"
            className="mr-1"
            checked={currentFilters.hasAwards || false}
            onChange={(e) => handleBooleanFilterChange("hasAwards", e.target.checked)}
          />
          Avec récompenses
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-1"
            checked={currentFilters.favoriteOnly || false}
            onChange={(e) => handleBooleanFilterChange("favoriteOnly", e.target.checked)}
          />
          Favoris uniquement
        </label>
      </div>

      <button type="button" onClick={handleClearFilters} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150">
        Effacer les filtres
      </button>
    </aside>
  );
}
