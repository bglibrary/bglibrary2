/**
 * Add Game Page
 * 
 * Form for adding a new game to the library.
 * As specified in specs/phase_7_5_ui_admin_game_editor.md
 */

import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { PlayDuration, FirstPlayComplexity, createGame } from '@/domain/Game';
import { getSessionHistory } from '@/admin/SessionHistory';
import { getAdminGameService } from '@/admin/AdminGameService';
import AdminHeader from '@/components/admin/AdminHeader';

// Dropdown component
function Dropdown({ label, value, onChange, options, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-meta text-text-secondary font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-body focus:outline-none focus:border-primary transition-colors"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// Award list component
function AwardList({ awards, onChange }) {
  const [newAwardName, setNewAwardName] = useState('');
  const [newAwardYear, setNewAwardYear] = useState('');

  const addAward = () => {
    if (!newAwardName.trim()) return;
    
    const award = { name: newAwardName.trim() };
    if (newAwardYear) {
      award.year = parseInt(newAwardYear);
    }
    
    onChange([...awards, award]);
    setNewAwardName('');
    setNewAwardYear('');
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

  return (
    <div className="space-y-1.5">
      <label className="block text-meta text-text-secondary font-medium">Prix et récompenses</label>
      
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
      
      {/* Add new award */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newAwardName}
          onChange={(e) => setNewAwardName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nom du prix..."
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-body focus:outline-none focus:border-primary transition-colors"
        />
        <input
          type="number"
          value={newAwardYear}
          onChange={(e) => setNewAwardYear(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Année"
          min="1900"
          max="2100"
          className="w-24 px-3 py-2 rounded-lg border border-border bg-card text-body focus:outline-none focus:border-primary transition-colors"
        />
        <button
          type="button"
          onClick={addAward}
          disabled={!newAwardName.trim()}
          className="px-3 py-2 rounded-lg bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

// Multi-select component for categories
function MultiSelect({ label, options, selectedValues, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const toggleOption = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const removeValue = (value) => {
    onChange(selectedValues.filter(v => v !== value));
  };

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <label className="block text-meta text-text-secondary font-medium">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 rounded-lg border border-border bg-card text-body focus:outline-none focus:border-primary transition-colors text-left flex items-center justify-between"
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
                  selectedValues.includes(opt.value)
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

// Input component
function Input({ label, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-meta text-text-secondary font-medium">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-body focus:outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}

// Textarea component
function Textarea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-meta text-text-secondary font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-body focus:outline-none focus:border-primary transition-colors resize-none"
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

// Category options
const CATEGORY_OPTIONS = [
  { value: 'Stratégie', label: 'Stratégie' },
  { value: 'Négociation', label: 'Négociation' },
  { value: 'Chance', label: 'Chance' },
  { value: 'Ambiance', label: 'Ambiance' },
  { value: 'Coopératif', label: 'Coopératif' },
  { value: 'Famille', label: 'Famille' },
  { value: 'Expert', label: 'Expert' },
];

export default function AddGamePage() {
  const router = useRouter();
  const sessionHistory = getSessionHistory();
  const adminService = getAdminGameService();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minPlayers: '',
    maxPlayers: '',
    playDuration: '',
    firstPlayComplexity: '',
    ageRecommendation: '',
    categories: [],
    mechanics: '',
    awards: [],
    favorite: false,
  });

  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.minPlayers || !formData.maxPlayers) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const gameData = {
        title: formData.title,
        description: formData.description || '',
        minPlayers: parseInt(formData.minPlayers),
        maxPlayers: parseInt(formData.maxPlayers),
        playDuration: formData.playDuration || PlayDuration.MEDIUM,
        firstPlayComplexity: formData.firstPlayComplexity || FirstPlayComplexity.MEDIUM,
        ageRecommendation: formData.ageRecommendation || '10+',
        categories: formData.categories,
        mechanics: formData.mechanics ? formData.mechanics.split(',').map(m => m.trim()) : [],
        awards: formData.awards,
        favorite: formData.favorite,
        archived: false,
        images: [],
      };

      await adminService.addGame(gameData);
      router.push('/admin');
    } catch (error) {
      console.error('Failed to add game:', error);
      alert('Erreur lors de l\'ajout du jeu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Ajouter un jeu - Notre Ludothèque</title>
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

        <div className="max-w-2xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-page-title text-text-primary mb-2">Ajouter un jeu</h1>
            <p className="text-body text-text-secondary">
              Remplissez les informations du jeu. Les modifications seront enregistrées dans l'historique de session.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Main Info */}
            <Section title="Informations principales">
              <Input
                label="Titre"
                value={formData.title}
                onChange={(v) => updateField('title', v)}
                placeholder="Nom du jeu"
                required
              />
              
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(v) => updateField('description', v)}
                placeholder="Description courte du jeu..."
                rows={4}
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
                  required
                />
                <Input
                  label="Max joueurs"
                  type="number"
                  value={formData.maxPlayers}
                  onChange={(v) => updateField('maxPlayers', v)}
                  placeholder="6"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Dropdown
                  label="Durée"
                  value={formData.playDuration}
                  onChange={(v) => updateField('playDuration', v)}
                  options={DURATION_OPTIONS}
                  placeholder="Sélectionner..."
                />
                <Dropdown
                  label="Complexité"
                  value={formData.firstPlayComplexity}
                  onChange={(v) => updateField('firstPlayComplexity', v)}
                  options={COMPLEXITY_OPTIONS}
                  placeholder="Sélectionner..."
                />
              </div>

              <Dropdown
                label="Âge recommandé"
                value={formData.ageRecommendation}
                onChange={(v) => updateField('ageRecommendation', v)}
                options={AGE_OPTIONS}
                placeholder="Sélectionner..."
              />
            </Section>

            {/* Categories */}
            <Section title="Classification">
              <MultiSelect
                label="Catégories"
                options={CATEGORY_OPTIONS}
                selectedValues={formData.categories}
                onChange={(values) => updateField('categories', values)}
                placeholder="Sélectionner les catégories..."
              />

              <Input
                label="Mécaniques"
                value={formData.mechanics}
                onChange={(v) => updateField('mechanics', v)}
                placeholder="Séparer par des virgules: Deck building, Placement, ..."
              />

              <AwardList
                awards={formData.awards}
                onChange={(awards) => updateField('awards', awards)}
              />
            </Section>

            {/* Flags */}
            <Section title="Options">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.favorite}
                  onChange={(e) => updateField('favorite', e.target.checked)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-body text-text-primary">
                  Marquer comme coup de cœur ❤️
                </span>
              </label>
            </Section>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="flex-1 py-3 px-6 rounded-button border border-border bg-card text-text-primary hover:bg-cream dark:hover:bg-cream/10 transition-colors text-button"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3 px-6 disabled:opacity-50"
              >
                {loading ? 'Enregistrement...' : 'Ajouter le jeu'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}