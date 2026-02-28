/**
 * Add Game Page
 * 
 * Form for adding a new game to the library.
 * As specified in specs/phase_7_5_ui_admin_game_editor.md
 */

import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { PlayDuration, FirstPlayComplexity, createGame } from '@/domain/Game';
import { getSessionHistory } from '@/admin/SessionHistory';
import { getAdminGameService } from '@/admin/AdminGameService';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  Dropdown,
  Input,
  Textarea,
  Section,
  AwardList,
  CategoriesSelect,
  MechanicsSelect,
  DURATION_OPTIONS,
  COMPLEXITY_OPTIONS,
  AGE_OPTIONS,
  CATEGORY_OPTIONS,
  AWARD_OPTIONS,
  MECHANICS_OPTIONS,
} from '@/components/admin/GameFormComponents';

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
    mechanics: [],
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
        mechanics: formData.mechanics,
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
              <CategoriesSelect
                selectedValues={formData.categories}
                onChange={(values) => updateField('categories', values)}
                placeholder="Sélectionner les catégories..."
                options={CATEGORY_OPTIONS}
              />

              <MechanicsSelect
                selectedValues={formData.mechanics}
                onChange={(values) => updateField('mechanics', values)}
                placeholder="Sélectionner les mécaniques..."
                options={MECHANICS_OPTIONS}
              />

              <AwardList
                awards={formData.awards}
                onChange={(awards) => updateField('awards', awards)}
                awardOptions={AWARD_OPTIONS}
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