/**
 * Edit Game Page
 * 
 * Form for editing an existing game in the library.
 * As specified in specs/phase_7_5_ui_admin_game_editor.md
 */

import Head from 'next/head';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import { PlayDuration, FirstPlayComplexity } from '@/domain/Game';
import { getAllGames, Context } from '@/repository/GameRepository';
import { getSessionHistory, ActionType } from '@/admin/SessionHistory';
import { getAdminGameService } from '@/admin/AdminGameService';
import AdminHeader from '@/components/admin/AdminHeader';

// Dropdown component with change indicator
function Dropdown({ label, value, onChange, options, placeholder, isModified = false }) {
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

// Award list component with dropdown and custom input
function AwardList({ awards, onChange, isModified = false, awardOptions }) {
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

// Mechanics select component with multi-select and custom input
function MechanicsSelect({ selectedValues, onChange, placeholder, isModified = false, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMechanic, setCustomMechanic] = useState('');
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

  const addCustomMechanic = () => {
    const trimmed = customMechanic.trim();
    if (trimmed && !selectedValues.includes(trimmed)) {
      onChange([...selectedValues, trimmed]);
      setCustomMechanic('');
      setShowCustomInput(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomMechanic();
    }
  };

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <label className="block text-meta text-text-secondary font-medium">
        Mécaniques
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
      
      {/* Custom mechanic input */}
      {showCustomInput && (
        <div className="flex gap-2 mt-2">
          <input
            ref={customInputRef}
            type="text"
            value={customMechanic}
            onChange={(e) => setCustomMechanic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nom de la mécanique..."
            className="flex-1 px-3 py-2 rounded-lg border border-primary/50 bg-card text-body focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={addCustomMechanic}
            disabled={!customMechanic.trim()}
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

// Categories select component with multi-select and custom input (similar to MechanicsSelect)
function CategoriesSelect({ selectedValues, onChange, placeholder, isModified = false, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
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

  const addCustomCategory = () => {
    const trimmed = customCategory.trim();
    if (trimmed && !selectedValues.includes(trimmed)) {
      onChange([...selectedValues, trimmed]);
      setCustomCategory('');
      setShowCustomInput(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomCategory();
    }
  };

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <label className="block text-meta text-text-secondary font-medium">
        Catégories
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
      
      {/* Custom category input */}
      {showCustomInput && (
        <div className="flex gap-2 mt-2">
          <input
            ref={customInputRef}
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nom de la catégorie..."
            className="flex-1 px-3 py-2 rounded-lg border border-primary/50 bg-card text-body focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={addCustomCategory}
            disabled={!customCategory.trim()}
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

// Input component with change indicator and error state
function Input({ label, type = 'text', value, onChange, placeholder, required, isModified = false, min, max, error }) {
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

// Textarea component with change indicator
function Textarea({ label, value, onChange, placeholder, rows = 4, isModified = false }) {
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
function Section({ title, children }) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-section-title text-text-primary mb-4 pb-2 border-b border-border">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

// Duration options
const DURATION_OPTIONS = [
  { value: PlayDuration.SHORT, label: 'Court (< 30 min)' },
  { value: PlayDuration.MEDIUM, label: 'Moyen (30-60 min)' },
  { value: PlayDuration.LONG, label: 'Long (> 60 min)' },
];

// Complexity options
const COMPLEXITY_OPTIONS = [
  { value: FirstPlayComplexity.LOW, label: 'Simple' },
  { value: FirstPlayComplexity.MEDIUM, label: 'Moyenne' },
  { value: FirstPlayComplexity.HIGH, label: 'Complexe' },
];

// Age options
const AGE_OPTIONS = [
  { value: '6+', label: '6+ ans' },
  { value: '8+', label: '8+ ans' },
  { value: '10+', label: '10+ ans' },
  { value: '12+', label: '12+ ans' },
  { value: '14+', label: '14+ ans' },
  { value: '16+', label: '16+ ans' },
];

// Category options - predefined list of common board game categories
const CATEGORY_OPTIONS = [
  { value: 'Stratégie', label: 'Stratégie' },
  { value: 'Négociation', label: 'Négociation' },
  { value: 'Chance', label: 'Chance' },
  { value: 'Ambiance', label: 'Ambiance' },
  { value: 'Coopératif', label: 'Coopératif' },
  { value: 'Famille', label: 'Famille' },
  { value: 'Expert', label: 'Expert' },
  { value: 'Other', label: 'Autre (préciser)' },
];

// Award options - predefined list of common board game awards
const AWARD_OPTIONS = [
  { value: 'Spiel des Jahres', label: 'Spiel des Jahres' },
  { value: 'Kennerspiel des Jahres', label: 'Kennerspiel des Jahres' },
  { value: 'Kinderspiel des Jahres', label: 'Kinderspiel des Jahres' },
  { value: 'Deutscher Spiele Preis', label: 'Deutscher Spiele Preis' },
  { value: 'As d\'Or', label: 'As d\'Or' },
  { value: 'Jeu de l\'Année', label: 'Jeu de l\'Année' },
  { value: 'Origins Award', label: 'Origins Award' },
  { value: 'Golden Geek', label: 'Golden Geek' },
  { value: 'International Gamers Award', label: 'International Gamers Award' },
  { value: 'Mensa Select', label: 'Mensa Select' },
  { value: 'Tric Trac d\'Or', label: 'Tric Trac d\'Or' },
  { value: 'Jeu de l\'Année Cannes', label: 'Jeu de l\'Année Cannes' },
  { value: 'Other', label: 'Autre (préciser)' },
];

// Mechanics options - predefined list of common board game mechanics
const MECHANICS_OPTIONS = [
  { value: 'Deck building', label: 'Deck building' },
  { value: 'Placement d\'ouvriers', label: 'Placement d\'ouvriers' },
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

export default function EditGamePage() {
  const router = useRouter();
  const { id } = router.query;
  const sessionHistory = getSessionHistory();
  const adminService = getAdminGameService();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [game, setGame] = useState(null);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [inlineButtonsVisible, setInlineButtonsVisible] = useState(false);
  const inlineButtonsRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minPlayers: '',
    maxPlayers: '',
    playDuration: '',
    firstPlayComplexity: '',
    ageRecommendation: '',
    categories: [],
    mechanics: [],
    awards: [],
    favorite: false,
  });

  // Load game data
  useEffect(() => {
    async function loadGame() {
      if (!id) return;
      
      try {
        // Load original game data from repository first
        const allGames = await getAllGames(Context.ADMIN);
        const originalGame = allGames.find(g => g.id === id);
        
        if (!originalGame) {
          router.push('/admin');
          return;
        }

        // Set original form data for comparison (from repository)
        const originalData = {
          title: originalGame.title || '',
          description: originalGame.description || '',
          minPlayers: originalGame.minPlayers?.toString() || '',
          maxPlayers: originalGame.maxPlayers?.toString() || '',
          playDuration: originalGame.playDuration || '',
          firstPlayComplexity: originalGame.firstPlayComplexity || '',
          ageRecommendation: originalGame.ageRecommendation || '',
          categories: originalGame.categories || [],
          mechanics: originalGame.mechanics || [],
          awards: originalGame.awards || [],
          favorite: originalGame.favorite || false,
        };
        setOriginalFormData(originalData);

        // Check if there's a pending UPDATE_GAME action for this game
        sessionHistory.loadFromStorage();
        const actions = sessionHistory.getActionsForGame(id);
        const pendingUpdate = actions.find(a => a.type === ActionType.UPDATE_GAME);
        
        if (pendingUpdate && pendingUpdate.payload) {
          // Use the pending update data for display (modified data)
          const foundGame = pendingUpdate.payload;
          setGame(foundGame);
          setFormData({
            title: foundGame.title || '',
            description: foundGame.description || '',
            minPlayers: foundGame.minPlayers?.toString() || '',
            maxPlayers: foundGame.maxPlayers?.toString() || '',
            playDuration: foundGame.playDuration || '',
            firstPlayComplexity: foundGame.firstPlayComplexity || '',
            ageRecommendation: foundGame.ageRecommendation || '',
            categories: foundGame.categories || [],
            mechanics: foundGame.mechanics || [],
            awards: foundGame.awards || [],
            favorite: foundGame.favorite || false,
          });
        } else {
          // No pending update, use original data
          setGame(originalGame);
          setFormData(originalData);
        }
      } catch (error) {
        console.error('Failed to load game:', error);
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [id, router, sessionHistory]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Check if form has been modified
  const hasChanges = useMemo(() => {
    if (!originalFormData) return false;
    
    return (
      formData.title !== originalFormData.title ||
      formData.description !== originalFormData.description ||
      formData.minPlayers !== originalFormData.minPlayers ||
      formData.maxPlayers !== originalFormData.maxPlayers ||
      formData.playDuration !== originalFormData.playDuration ||
      formData.firstPlayComplexity !== originalFormData.firstPlayComplexity ||
      formData.ageRecommendation !== originalFormData.ageRecommendation ||
      JSON.stringify(formData.categories.sort()) !== JSON.stringify(originalFormData.categories.sort()) ||
      JSON.stringify(formData.mechanics.sort()) !== JSON.stringify(originalFormData.mechanics.sort()) ||
      JSON.stringify(formData.awards) !== JSON.stringify(originalFormData.awards) ||
      formData.favorite !== originalFormData.favorite
    );
  }, [formData, originalFormData]);

  // Track which individual fields have been modified
  const fieldChanges = useMemo(() => {
    if (!originalFormData) return {};
    
    return {
      title: formData.title !== originalFormData.title,
      description: formData.description !== originalFormData.description,
      minPlayers: formData.minPlayers !== originalFormData.minPlayers,
      maxPlayers: formData.maxPlayers !== originalFormData.maxPlayers,
      playDuration: formData.playDuration !== originalFormData.playDuration,
      firstPlayComplexity: formData.firstPlayComplexity !== originalFormData.firstPlayComplexity,
      ageRecommendation: formData.ageRecommendation !== originalFormData.ageRecommendation,
      categories: JSON.stringify(formData.categories.sort()) !== JSON.stringify(originalFormData.categories.sort()),
      mechanics: JSON.stringify(formData.mechanics.sort()) !== JSON.stringify(originalFormData.mechanics.sort()),
      awards: JSON.stringify(formData.awards) !== JSON.stringify(originalFormData.awards),
      favorite: formData.favorite !== originalFormData.favorite,
    };
  }, [formData, originalFormData]);

  // Validation errors for player count
  const playerErrors = useMemo(() => {
    const errors = {};
    const minPlayers = parseInt(formData.minPlayers);
    const maxPlayers = parseInt(formData.maxPlayers);
    
    // Validate minPlayers
    if (formData.minPlayers !== '') {
      if (isNaN(minPlayers) || minPlayers < 1) {
        errors.minPlayers = 'Le minimum doit être au moins 1';
      }
    }
    
    // Validate maxPlayers
    if (formData.maxPlayers !== '') {
      if (isNaN(maxPlayers) || maxPlayers < 1) {
        errors.maxPlayers = 'Le maximum doit être au moins 1';
      }
    }
    
    // Validate max >= min (only if both are valid numbers)
    if (!errors.minPlayers && !errors.maxPlayers && 
        formData.minPlayers !== '' && formData.maxPlayers !== '' &&
        maxPlayers < minPlayers) {
      errors.maxPlayers = 'Le maximum doit être supérieur ou égal au minimum';
    }
    
    return errors;
  }, [formData.minPlayers, formData.maxPlayers]);

  // Check if form has validation errors
  const hasValidationErrors = Object.keys(playerErrors).length > 0;

  // Observe inline buttons visibility to hide sticky bar when they're visible
  useEffect(() => {
    if (!inlineButtonsRef.current || !hasChanges) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // If inline buttons are visible (intersecting with viewport), hide sticky
        setInlineButtonsVisible(entry.isIntersecting && entry.intersectionRatio > 0.5);
      },
      {
        threshold: 0.5,
        rootMargin: '0px 0px -80px 0px', // Account for sticky bar height
      }
    );

    observer.observe(inlineButtonsRef.current);

    return () => observer.disconnect();
  }, [hasChanges]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check required fields
    if (!formData.title || !formData.minPlayers || !formData.maxPlayers) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    // Check for validation errors
    if (hasValidationErrors) {
      alert('Veuillez corriger les erreurs de validation');
      return;
    }

    // Parse and validate player counts
    const minPlayers = parseInt(formData.minPlayers);
    const maxPlayers = parseInt(formData.maxPlayers);
    
    if (minPlayers < 1 || maxPlayers < 1) {
      alert('Le nombre de joueurs doit être au moins 1');
      return;
    }
    
    if (maxPlayers < minPlayers) {
      alert('Le maximum doit être supérieur ou égal au minimum');
      return;
    }

    setSaving(true);
    try {
      // Load original game data from repository for fields not in the form
      const allGames = await getAllGames(Context.ADMIN);
      const originalGame = allGames.find(g => g.id === id);
      
      if (!originalGame) {
        alert('Jeu non trouvé');
        setSaving(false);
        return;
      }

      const gameData = {
        ...originalGame,
        title: formData.title,
        description: formData.description || '',
        minPlayers: minPlayers,
        maxPlayers: maxPlayers,
        playDuration: formData.playDuration || PlayDuration.MEDIUM,
        firstPlayComplexity: formData.firstPlayComplexity || FirstPlayComplexity.MEDIUM,
        ageRecommendation: formData.ageRecommendation || '10+',
        categories: formData.categories,
        mechanics: formData.mechanics,
        awards: formData.awards,
        favorite: formData.favorite,
      };

      await adminService.updateGame(id, gameData);
      router.push('/admin');
    } catch (error) {
      console.error('Failed to update game:', error);
      alert('Erreur lors de la mise à jour du jeu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-text-secondary">Chargement...</p>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Modifier {game?.title} - Notre Ludothèque</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <main className="min-h-screen bg-cream">
        <AdminHeader
          searchQuery=""
          onSearchChange={() => {}}
          onToggleHistory={() => {}}
          historyCount={sessionHistory.getCount()}
          viewMode="grid"
          onViewModeChange={() => {}}
        />

        <div className={`max-w-2xl mx-auto p-6 ${hasChanges ? 'pb-24' : ''}`}>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-page-title text-text-primary mb-2">Modifier un jeu</h1>
            <p className="text-body text-text-secondary">
              Modifiez les informations de « {game?.title} ». Les modifications seront enregistrées dans l'historique de session.
            </p>
          </div>

          <form id="edit-game-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Main Info */}
            <Section title="Informations principales">
              <Input
                label="Titre"
                value={formData.title}
                onChange={(v) => updateField('title', v)}
                placeholder="Nom du jeu"
                required
                isModified={fieldChanges.title}
              />
              
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(v) => updateField('description', v)}
                placeholder="Description courte du jeu..."
                rows={4}
                isModified={fieldChanges.description}
              />
            </Section>

            {/* Players & Duration */}
            <Section title="Joueurs et durée">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Min joueurs"
                  type="number"
                  value={formData.minPlayers}
                  onChange={(v) => updateField('minPlayers', v)}
                  placeholder="1"
                  min="1"
                  required
                  isModified={fieldChanges.minPlayers}
                  error={playerErrors.minPlayers}
                />
                <Input
                  label="Max joueurs"
                  type="number"
                  value={formData.maxPlayers}
                  onChange={(v) => updateField('maxPlayers', v)}
                  placeholder="6"
                  min="1"
                  required
                  isModified={fieldChanges.maxPlayers}
                  error={playerErrors.maxPlayers}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Dropdown
                  label="Durée"
                  value={formData.playDuration}
                  onChange={(v) => updateField('playDuration', v)}
                  options={DURATION_OPTIONS}
                  placeholder="Sélectionner..."
                  isModified={fieldChanges.playDuration}
                />
                <Dropdown
                  label="Complexité"
                  value={formData.firstPlayComplexity}
                  onChange={(v) => updateField('firstPlayComplexity', v)}
                  options={COMPLEXITY_OPTIONS}
                  placeholder="Sélectionner..."
                  isModified={fieldChanges.firstPlayComplexity}
                />
              </div>

              <Dropdown
                label="Âge recommandé"
                value={formData.ageRecommendation}
                onChange={(v) => updateField('ageRecommendation', v)}
                options={AGE_OPTIONS}
                placeholder="Sélectionner..."
                isModified={fieldChanges.ageRecommendation}
              />
            </Section>

            {/* Categories */}
            <Section title="Classification">
              <CategoriesSelect
                selectedValues={formData.categories}
                onChange={(values) => updateField('categories', values)}
                placeholder="Sélectionner les catégories..."
                isModified={fieldChanges.categories}
                options={CATEGORY_OPTIONS}
              />

              <MechanicsSelect
                selectedValues={formData.mechanics}
                onChange={(values) => updateField('mechanics', values)}
                placeholder="Sélectionner les mécaniques..."
                isModified={fieldChanges.mechanics}
                options={MECHANICS_OPTIONS}
              />

              <AwardList
                awards={formData.awards}
                onChange={(awards) => updateField('awards', awards)}
                isModified={fieldChanges.awards}
                awardOptions={AWARD_OPTIONS}
              />
            </Section>

            {/* Flags */}
            <Section title="Options">
              <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-colors ${fieldChanges.favorite ? 'bg-primary/5 border border-primary/20' : ''}`}>
                <input
                  type="checkbox"
                  checked={formData.favorite}
                  onChange={(e) => updateField('favorite', e.target.checked)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-body text-text-primary">
                  Marquer comme coup de cœur ❤️
                </span>
                {fieldChanges.favorite && <span className="ml-auto text-primary text-xs">● modifié</span>}
              </label>
            </Section>

            {/* Actions - inline buttons with ref for visibility detection */}
            <div ref={inlineButtonsRef} className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="flex-1 py-3 px-6 rounded-button border border-border bg-card text-text-primary hover:bg-cream dark:hover:bg-cream/10 transition-colors text-button"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 btn-primary py-3 px-6 disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>

        {/* Sticky action bar - visible when form has changes AND inline buttons are NOT visible */}
        {hasChanges && !inlineButtonsVisible && (
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
            <div className="max-w-2xl mx-auto p-4 flex gap-3">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="flex-1 py-3 px-6 rounded-button border border-border bg-card text-text-primary hover:bg-cream dark:hover:bg-cream/10 transition-colors text-button"
              >
                Annuler
              </button>
              <button
                type="submit"
                form="edit-game-form"
                disabled={saving}
                className="flex-1 btn-primary py-3 px-6 disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}