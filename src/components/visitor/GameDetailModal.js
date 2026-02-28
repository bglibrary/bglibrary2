/**
 * GameDetailModal Component
 * 
 * Modal displaying full game details.
 * As specified in specs/UI_guidelines.md and specs/phase_7_3_ui_visitor_game_detail.md
 */

import { useEffect, useCallback } from 'react';
import { PlayDuration, FirstPlayComplexity } from '@/domain/Game';
import { GameImage } from '@/components/common/GameCard';

const DURATION_LABELS = {
  [PlayDuration.SHORT]: 'Court (< 30 min)',
  [PlayDuration.MEDIUM]: 'Moyen (30-60 min)',
  [PlayDuration.LONG]: 'Long (> 60 min)',
};

const COMPLEXITY_LABELS = {
  [FirstPlayComplexity.LOW]: 'Simple',
  [FirstPlayComplexity.MEDIUM]: 'Moyenne',
  [FirstPlayComplexity.HIGH]: 'Complexe',
};

export default function GameDetailModal({ game, onClose }) {
  // Handle escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const playerCount = game.minPlayers === game.maxPlayers
    ? `${game.minPlayers} joueurs`
    : `${game.minPlayers}-${game.maxPlayers} joueurs`;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-modal shadow-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with image */}
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-card/80 rounded-full flex items-center justify-center hover:bg-card transition-colors z-10"
            aria-label="Fermer"
          >
            ✕
          </button>

          {/* Image - square format with object-contain */}
          <div className="p-4 bg-border rounded-t-modal">
            <GameImage 
              imageId={game.images && game.images.length > 0 ? game.images[0].id : null}
              title={game.title}
              className="max-w-md mx-auto"
            />
          </div>

          {/* Favorite badge */}
          {game.favorite && (
            <span className="absolute bottom-4 left-4 bg-card/90 px-3 py-1 rounded-pill text-favorite">
              ❤️ Favori
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h2 className="text-modal-title text-text-primary mb-4">
            {game.title}
          </h2>

          {/* Quick info */}
          <div className="flex flex-wrap gap-4 mb-6 text-body text-text-secondary">
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>{playerCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span>{DURATION_LABELS[game.playDuration]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🧠</span>
              <span>Complexité: {COMPLEXITY_LABELS[game.firstPlayComplexity]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎂</span>
              <span>Âge: {game.ageRecommendation}</span>
            </div>
          </div>

          {/* Awards */}
          {game.awards && game.awards.length > 0 && (
            <div className="mb-6">
              <h3 className="text-section-title text-text-primary mb-2 flex items-center gap-2">
                <span className="text-award">🏆</span>
                Prix
              </h3>
              <ul className="space-y-1">
                {game.awards.map((award, index) => (
                  <li key={index} className="text-body text-text-secondary">
                    {award.name}{award.year ? ` (${award.year})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <p className="text-body text-text-primary leading-relaxed">
              {game.description}
            </p>
          </div>

          {/* Categories */}
          {game.categories && game.categories.length > 0 && (
            <div className="mb-4">
              <h3 className="text-meta text-text-secondary mb-2">Catégories</h3>
              <div className="flex flex-wrap gap-2">
                {game.categories.map((category, index) => (
                  <span key={index} className="chip">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mechanics */}
          {game.mechanics && game.mechanics.length > 0 && (
            <div className="mb-6">
              <h3 className="text-meta text-text-secondary mb-2">Mécaniques</h3>
              <div className="flex flex-wrap gap-2">
                {game.mechanics.map((mechanic, index) => (
                  <span key={index} className="chip">
                    {mechanic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Close button */}
          <div className="mt-6 pt-4 border-t border-border">
            <button
              onClick={onClose}
              className="btn-secondary w-full"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}