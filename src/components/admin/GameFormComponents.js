/**
 * Shared Game Form Components
 * 
 * Reusable form components for add-game and edit-game pages.
 * As specified in specs/phase_7_5_ui_admin_game_editor.md
 */

import { useState, useEffect, useRef, useCallback } from 'react';

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

/**
 * PlayerCountInput - Common component for min/max player inputs with validation
 * 
 * Validates:
 * - minPlayers >= 1
 * - maxPlayers >= 1
 * - maxPlayers >= minPlayers
 */
export function PlayerCountInput({ 
  minPlayers, 
  maxPlayers, 
  onMinChange, 
  onMaxChange,
  isModified = { min: false, max: false }
}) {
  // Compute validation errors
  const getErrors = () => {
    const errors = {};
    const min = parseInt(minPlayers);
    const max = parseInt(maxPlayers);
    
    // Validate minPlayers
    if (minPlayers !== '' && minPlayers !== undefined) {
      if (isNaN(min) || min < 1) {
        errors.min = 'Le minimum doit être au moins 1';
      }
    }
    
    // Validate maxPlayers
    if (maxPlayers !== '' && maxPlayers !== undefined) {
      if (isNaN(max) || max < 1) {
        errors.max = 'Le maximum doit être au moins 1';
      }
    }
    
    // Validate max >= min (only if both are valid numbers)
    if (!errors.min && !errors.max && 
        minPlayers !== '' && maxPlayers !== '' &&
        !isNaN(min) && !isNaN(max) &&
        max < min) {
      errors.max = 'Le maximum doit être supérieur ou égal au minimum';
    }
    
    return errors;
  };

  const errors = getErrors();

  return (
    <div className="grid grid-cols-2 gap-4">
      <Input
        label="Min joueurs"
        type="number"
        value={minPlayers}
        onChange={onMinChange}
        placeholder="1"
        min="1"
        required
        isModified={isModified.min}
        error={errors.min}
      />
      <Input
        label="Max joueurs"
        type="number"
        value={maxPlayers}
        onChange={onMaxChange}
        placeholder="6"
        min="1"
        required
        isModified={isModified.max}
        error={errors.max}
      />
    </div>
  );
}

/**
 * Validate player count values
 * Returns { valid: boolean, errors: { min?: string, max?: string } }
 */
export function validatePlayerCount(minPlayersStr, maxPlayersStr) {
  const errors = {};
  const minPlayers = parseInt(minPlayersStr);
  const maxPlayers = parseInt(maxPlayersStr);
  
  // Validate minPlayers
  if (!minPlayersStr || minPlayersStr === '') {
    errors.min = 'Le nombre minimum de joueurs est requis';
  } else if (isNaN(minPlayers) || minPlayers < 1) {
    errors.min = 'Le minimum doit être au moins 1';
  }
  
  // Validate maxPlayers
  if (!maxPlayersStr || maxPlayersStr === '') {
    errors.max = 'Le nombre maximum de joueurs est requis';
  } else if (isNaN(maxPlayers) || maxPlayers < 1) {
    errors.max = 'Le maximum doit être au moins 1';
  }
  
  // Validate max >= min (only if both are valid numbers)
  if (!errors.min && !errors.max && maxPlayers < minPlayers) {
    errors.max = 'Le maximum doit être supérieur ou égal au minimum';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
    minPlayers: isNaN(minPlayers) ? null : minPlayers,
    maxPlayers: isNaN(maxPlayers) ? null : maxPlayers,
  };
}

/**
 * ImageUpload - Component for uploading game images
 * 
 * Features:
 * - Drag and drop support
 * - Preview of selected image
 * - Base64 encoding for session storage
 * - File validation (type, size)
 * - Support for existing images (by ID)
 */
export function ImageUpload({ 
  value, 
  onChange, 
  existingImage = null, // Image ID (e.g., "catan-main")
  isModified = false 
}) {
  // Build existing image URL from ID
  const existingImageUrl = existingImage ? `/images/${existingImage}.jpg` : null;
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection - converts all images to JPG
  const handleFile = useCallback((file) => {
    setError(null);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image doit faire moins de 5 Mo');
      return;
    }
    
    // Read file and convert to JPG
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // Fill with white background (for PNG transparency)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        // Convert to JPEG (quality 0.9)
        const jpgBase64 = canvas.toDataURL('image/jpeg', 0.9);
        
        setPreview(jpgBase64);
        onChange({
          file: file,
          base64: jpgBase64,
          filename: file.name.replace(/\.[^.]+$/, '.jpg'),
          type: 'image/jpeg',
        });
        
        // Clean up
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        setError('Erreur lors du chargement de l\'image');
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      setError('Erreur lors de la lecture du fichier');
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  // Handle click to select file
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  // Handle remove image
  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Determine what to show
  const showPreview = preview || (value?.base64);
  const showExisting = !showPreview && existingImageUrl;

  return (
    <div className="space-y-1.5">
      <label className="block text-meta text-text-secondary font-medium">
        Image principale
        {isModified && <span className="ml-2 text-primary text-xs">● modifié</span>}
      </label>
      
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-lg border-2 border-dashed transition-colors
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : showPreview || showExisting
              ? 'border-primary/50 bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-cream/50'
          }
          ${isModified ? 'ring-1 ring-primary/20' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        
        {/* Preview or existing image */}
        {(showPreview || showExisting) && (
          <div className="p-3">
            <div className="relative inline-block">
              <img
                src={showPreview || existingImageUrl}
                alt="Preview"
                className="h-32 w-auto rounded-lg object-cover shadow-sm"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 p-1 bg-danger text-white rounded-full hover:bg-danger/80 transition-colors"
                title="Supprimer l'image"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Upload prompt */}
        {!showPreview && !showExisting && (
          <div className="p-6 text-center">
            <svg className="w-10 h-10 mx-auto text-text-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-body text-text-secondary">
              Glissez une image ici ou cliquez pour sélectionner
            </p>
            <p className="text-meta text-text-muted mt-1">
              JPG, PNG, WebP • Max 5 Mo
            </p>
          </div>
        )}
        
        {/* Change prompt when image exists */}
        {(showPreview || showExisting) && (
          <div className="px-3 pb-3">
            <p className="text-meta text-text-muted text-center">
              Cliquez pour changer l'image
            </p>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p className="text-meta text-danger">{error}</p>
      )}
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