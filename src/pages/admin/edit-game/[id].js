/**
 * Edit Game Page
 * 
 * Form for editing an existing game in the library.
 * As specified in specs/phase_7_5_ui_admin_game_editor.md
 */

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PlayDuration, FirstPlayComplexity } from '@/domain/Game';
import { getAllGames, Context } from '@/repository/GameRepository';
import { getSessionHistory, ActionType } from '@/admin/SessionHistory';
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
        className="w-full px-4 py-3 rounded-lg border border-border bg-white text-body focus:outline-none focus:border-primary transition-colors"
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
        className="w-full px-4 py-3 rounded-lg border border-border bg-white text-body focus:outline-none focus:border-primary transition-colors"
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
        className="w-full px-4 py-3 rounded-lg border border-border bg-white text-body focus:outline-none focus:border-primary transition-colors resize-none"
      />
    </div>
  );
}

// Section component
function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
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

export default function EditGamePage() {
  const router = useRouter();
  const { id } = router.query;
  const sessionHistory = getSessionHistory();
  const adminService = getAdminGameService();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [game, setGame] = useState(null);

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
    favorite: false,
  });

  // Load game data
  useEffect(() => {
    async function loadGame() {
      if (!id) return;
      
      try {
        // First check if there's a pending UPDATE_GAME action for this game
        sessionHistory.loadFromStorage();
        const actions = sessionHistory.getActionsForGame(id);
        const pendingUpdate = actions.find(a => a.type === ActionType.UPDATE_GAME);
        
        if (pendingUpdate && pendingUpdate.payload) {
          // Use the pending update data for display
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
            mechanics: (foundGame.mechanics || []).join(', '),
            favorite: foundGame.favorite || false,
          });
          setLoading(false);
          return;
        }

        // Otherwise load from repository
        const allGames = await getAllGames(Context.ADMIN);
        const foundGame = allGames.find(g => g.id === id);
        
        if (!foundGame) {
          router.push('/admin');
          return;
        }

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
          mechanics: (foundGame.mechanics || []).join(', '),
          favorite: foundGame.favorite || false,
        });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.minPlayers || !formData.maxPlayers) {
      alert('Veuillez remplir les champs obligatoires');
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
        minPlayers: parseInt(formData.minPlayers),
        maxPlayers: parseInt(formData.maxPlayers),
        playDuration: formData.playDuration || PlayDuration.MEDIUM,
        firstPlayComplexity: formData.firstPlayComplexity || FirstPlayComplexity.MEDIUM,
        ageRecommendation: formData.ageRecommendation || '10+',
        categories: formData.categories,
        mechanics: formData.mechanics ? formData.mechanics.split(',').map(m => m.trim()) : [],
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

        <div className="max-w-2xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-page-title text-text-primary mb-2">Modifier un jeu</h1>
            <p className="text-body text-text-secondary">
              Modifiez les informations de « {game?.title} ». Les modifications seront enregistrées dans l'historique de session.
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
              <Dropdown
                label="Catégorie principale"
                value={formData.categories[0] || ''}
                onChange={(v) => updateField('categories', v ? [v] : [])}
                options={CATEGORY_OPTIONS}
                placeholder="Sélectionner..."
              />

              <Input
                label="Mécaniques"
                value={formData.mechanics}
                onChange={(v) => updateField('mechanics', v)}
                placeholder="Séparer par des virgules: Deck building, Placement, ..."
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
                className="flex-1 py-3 px-6 rounded-button border border-border bg-white text-text-primary hover:bg-cream transition-colors text-button"
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
      </main>
    </>
  );
}