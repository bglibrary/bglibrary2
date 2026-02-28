/**
 * Shared Game Form Components
 * 
 * Reusable form components for add-game and edit-game pages.
 * As specified in specs/phase_7_5_ui_admin_game_editor.md
 */

import { useState, useEffect, useRef } from 'react';

// Dropdown component
export function Dropdown({ label, value, onChange, options, placeholder, isModified = false }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-meta text-text-secondary font-medium">
        {label}
        {isModified && <span className="ml-2 text-primary text-xs">● modifié</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-lg border bg-card text-body focus:outline-none transition-colors ${
          isModified 
            ? 'border-primary border-2 ring-1 ring-primary/20' 
            : 'border-border focus:border-primary'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// Input component
export function Input({ label, type = 'text', value, onChange, placeholder, required, isModified = false, min, max, error }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-meta text-text-secondary font-medium">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
        {isModified && <span className="ml-2 text-primary text-xs">● modifié</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full px-4 py-3 rounded-lg border bg-card text-body focus:outline-none transition-colors ${
          error 
            ? 'border-danger border-2 ring-1 ring-danger/20' 
            : isModified 
              ? 'border-primary border-2 ring-1 ring-primary/20' 
              : 'border-border focus:border-primary'
        }`}
      />
      {error && (
        <p className="text-meta text-danger">{error}</p>
      )}
    </div>
  );
}

// Textarea component
export function Textarea({ label, value, onChange, placeholder, rows = 4, isModified = false }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-meta text-text-secondary font-medium">
        {label}
        {isModified && <span className="ml-2 text-primary text-xs">● modifié</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 rounded-lg border bg-card text-body focus:outline-none transition-colors resize-none ${
          isModified 
            ? 'border-primary border-2 ring-1 ring-primary/20' 
            : 'border-border focus:border-primary'
        }`}
      />
    </div>
  );
}

// Section component
export function Section({ title, children }) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-section-title text-text-primary mb-4 pb-2 border-b border-border">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

// Award list component
export function AwardList({ awards, onChange, isModified = false, awardOptions }) {
  const [selectedAward, setSelectedAward] = useState('');
  const [customAwardName, setCustomAwardName] = useState('');
  const [awardYear, setAwardYear] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleAwardSelect = (value) => {
    setSelectedAward(value);
    if (value === 'Other') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setCustomAwardName('');
    }
  };

  const addAward = () => {
    const awardName = showCustomInput ? customAwardName.trim() : selectedAward;
    if (!awardName) return;
    
    const award = { name: awardName };
    if (awardYear) {
      award.year = parseInt(awardYear);
    }
    
    onChange([...awards, award]);
    // Reset form
    setSelectedAward('');
    setCustomAwardName('');
    setAwardYear('');
    setShowCustomInput(false);
  };

  const removeAward = (index) => {
    onChange(awards.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAward();
    }
  };

  const canAdd = showCustomInput ? customAwardName.trim() : selectedAward;

  return (
    <div className="space-y-1.5">
      <label className="block text-meta text-text-secondary font-medium">
        Prix et récompenses
        {isModified && <span className="ml-2 text-primary text-xs">● modifié</span>}
      </label>
      
      {/* Existing awards */}
      {awards.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {awards.map((award, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-award/20 text-award rounded-pill text-meta"
            >
              🏆 {award.name}{award.year ? ` (${award.year})` : ''}
              <button
                type="button"
                onClick={() => removeAward(index)}
                className="hover:text-danger"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      
      {/* Add new award - dropdown */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <select
            value={selectedAward}
            onChange={(e) => handleAwardSelect(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-body focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">Sélectionner un prix...</option>
            {awardOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input
            type="number"
            value={awardYear}
            onChange={(e) => setAwardYear(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Année"
            min="1900"
            max="2100"
            className="w-24 px-3 py-2 rounded-lg border border-border bg-card text-body focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={addAward}
            disabled={!canAdd}
            className="px-3 py-2 rounded-lg bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            +
          </button>
        </div>
        
        {/* Custom award name input (shown when "Other" is selected) */}
        {showCustomInput && (
          <input
            type="text"
            value={customAwardName}
            onChange={(e) => setCustomAwardName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nom du prix personnalisé..."
            className="w-full px-3 py-2 rounded-lg border border-primary/50 bg-card text-body focus:outline-none focus:border-primary transition-colors"
          />
        )}
      </div>
    </div>
  );
}

// Base multi-select component (shared logic for Categories and Mechanics)
function MultiSelectBase({ 
  selectedValues, 
  onChange, 
  placeholder, 
  isModified = false, 
  options, 
  label 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const dropdownRef = useRef(null);
  const customInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus custom input when shown
  useEffect(() => {
    if (showCustomInput && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [showCustomInput]);

  const toggleOption = (value) => {
    if (value === 'Other') {
      setShowCustomInput(true);
      setIsOpen(false);
      return;
    }
    
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const removeValue = (value) => {
    onChange(selectedValues.filter(v => v !== value));
  };

  const addCustomValue = () => {
    const trimmed = customValue.trim();
    if (trimmed && !selectedValues.includes(trimmed)) {
      onChange([...selectedValues, trimmed]);
      setCustomValue('');
      setShowCustomInput(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomValue();
    }
  };

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <label className="block text-meta text-text-secondary font-medium">
        {label}
        {isModified && <span className="ml-2 text-primary text-xs">● modifié</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 rounded-lg border bg-card text-body focus:outline-none transition-colors text-left flex items-center justify-between ${
            isModified 
              ? 'border-primary border-2 ring-1 ring-primary/20' 
              : 'border-border focus:border-primary'
          }`}
        >
          <span className={selectedValues.length > 0 ? 'text-text-primary' : 'text-text-muted'}>
            {selectedValues.length > 0 
              ? `${selectedValues.length} sélectionnée${selectedValues.length > 1 ? 's' : ''}`
              : placeholder
            }
          </span>
          <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleOption(opt.value)}
                className={`w-full text-left px-4 py-2 text-body transition-colors flex items-center gap-2 ${
                  opt.value === 'Other' && showCustomInput
                    ? 'bg-primary/10 text-primary'
                    : selectedValues.includes(opt.value)
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-primary hover:bg-cream dark:hover:bg-cream/10'
                }`}
              >
                <span className="w-4 text-center">
                  {selectedValues.includes(opt.value) ? '✓' : ''}
                </span>
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Custom input */}
      {showCustomInput && (
        <div className="flex gap-2 mt-2">
          <input
            ref={customInputRef}
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Nom de ${label.toLowerCase()}...`}
            className="flex-1 px-3 py-2 rounded-lg border border-primary/50 bg-card text-body focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={addCustomValue}
            disabled={!customValue.trim()}
            className="px-3 py-2 rounded-lg bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            +
          </button>
        </div>
      )}
      
      {/* Selected tags */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedValues.map(value => {
            const opt = options.find(o => o.value === value);
            return (
              <span
                key={value}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-pill text-meta"
              >
                {opt?.label || value}
                <button
                  type="button"
                  onClick={() => removeValue(value)}
                  className="hover:text-danger"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Categories select component
export function CategoriesSelect({ selectedValues, onChange, placeholder, isModified = false, options }) {
  return (
    <MultiSelectBase
      selectedValues={selectedValues}
      onChange={onChange}
      placeholder={placeholder}
      isModified={isModified}
      options={options}
      label="Catégories"
    />
  );
}

// Mechanics select component
export function MechanicsSelect({ selectedValues, onChange, placeholder, isModified = false, options }) {
  return (
    <MultiSelectBase
      selectedValues={selectedValues}
      onChange={onChange}
      placeholder={placeholder}
      isModified={isModified}
      options={options}
      label="Mécaniques"
    />
  );
}

// Duration options
export const DURATION_OPTIONS = [
  { value: 'SHORT', label: 'Court (< 30 min)' },
  { value: 'MEDIUM', label: 'Moyen (30-60 min)' },
  { value: 'LONG', label: 'Long (> 60 min)' },
];

// Complexity options
export const COMPLEXITY_OPTIONS = [
  { value: 'LOW', label: 'Simple' },
  { value: 'MEDIUM', label: 'Moyenne' },
  { value: 'HIGH', label: 'Complexe' },
];

// Age options
export const AGE_OPTIONS = [
  { value: '6+', label: '6+ ans' },
  { value: '8+', label: '8+ ans' },
  { value: '10+', label: '10+ ans' },
  { value: '12+', label: '12+ ans' },
  { value: '14+', label: '14+ ans' },
  { value: '16+', label: '16+ ans' },
];

// Category options
export const CATEGORY_OPTIONS = [
  { value: 'Bluff', label: 'Bluff' },
  { value: 'Coopératif', label: 'Coopératif' },
  { value: 'Affrontement', label: 'Affrontement' },
  { value: 'Mémoire', label: 'Mémoire' },
  { value: 'Chance', label: 'Chance' },
  { value: 'Rapidité', label: 'Rapidité' },
  { value: 'Devinette', label: 'Devinette' },
  { value: 'Observation', label: 'Observation' },
  { value: 'Ambiance', label: 'Ambiance' },
  { value: 'Gestion', label: 'Gestion' },
  { value: 'Aventure', label: 'Aventure' },
  { value: 'Plis', label: 'Plis' },
  { value: 'Stratégie', label: 'Stratégie' },
  { value: 'Jeu de cartes', label: 'Jeu de cartes' },
  { value: 'Jeu de plateau', label: 'Jeu de plateau' },
  { value: 'Jeu de dés', label: 'Jeu de dés' },
  { value: 'Other', label: 'Autre (préciser)' },
];

// Award options
export const AWARD_OPTIONS = [
  { value: 'Spiel des Jahres', label: 'Spiel des Jahres' },
  { value: 'Kennerspiel des Jahres', label: 'Kennerspiel des Jahres' },
  { value: 'Kinderspiel des Jahres', label: 'Kinderspiel des Jahres' },
  { value: 'Deutscher Spiele Preis', label: 'Deutscher Spiele Preis' },
  { value: "As d'Or", label: "As d'Or" },
  { value: "Jeu de l'Année", label: "Jeu de l'Année" },
  { value: 'Origins Award', label: 'Origins Award' },
  { value: 'Golden Geek', label: 'Golden Geek' },
  { value: 'International Gamers Award', label: 'International Gamers Award' },
  { value: 'Mensa Select', label: 'Mensa Select' },
  { value: "Tric Trac d'Or", label: "Tric Trac d'Or" },
  { value: "Jeu de l'Année Cannes", label: "Jeu de l'Année Cannes" },
  { value: 'Other', label: 'Autre (préciser)' },
];

// Mechanics options
export const MECHANICS_OPTIONS = [
  { value: 'Deck building', label: 'Deck building' },
  { value: "Placement d'ouvriers", label: "Placement d'ouvriers" },
  { value: 'Gestion de main', label: 'Gestion de main' },
  { value: 'Lancer de dés', label: 'Lancer de dés' },
  { value: 'Pioche de tuiles', label: 'Pioche de tuiles' },
  { value: 'Enchères', label: 'Enchères' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Contrôle de zone', label: 'Contrôle de zone' },
  { value: 'Course', label: 'Course' },
  { value: 'Coopération', label: 'Coopération' },
  { value: 'Bluff', label: 'Bluff' },
  { value: 'Déduction', label: 'Déduction' },
  { value: 'Push your luck', label: 'Push your luck' },
  { value: 'Majorité', label: 'Majorité' },
  { value: 'Collection de sets', label: 'Collection de sets' },
  { value: 'Échange', label: 'Échange' },
  { value: 'Other', label: 'Autre (préciser)' },
];