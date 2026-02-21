/**
 * GameCard Component (Shared)
 * 
 * Card displaying game summary information.
 * Used by both visitor and admin views.
 * As specified in specs/UI_guidelines.md and specs/phase_7_2_ui_visitor_game_library.md
 */

import { PlayDuration } from '@/domain/Game';

// Duration icon fill levels
const DurationIcon = ({ duration }) => {
  const fillCount = {
    [PlayDuration.SHORT]: 1,
    [PlayDuration.MEDIUM]: 2,
    [PlayDuration.LONG]: 3,
  }[duration] || 1;

  return (
    <span className="inline-flex items-center" title={duration}>
      {[1, 2, 3].map(i => (
        <span
          key={i}
          className={`inline-block w-2 h-3 mx-0.5 rounded-sm ${
            i <= fillCount ? 'bg-text-secondary' : 'bg-border'
          }`}
        />
      ))}
    </span>
  );
};

/**
 * Game image component with square aspect ratio
 * Uses object-contain to avoid cropping
 */
export function GameImage({ imageId, title, className = '' }) {
  return (
    <div className={`aspect-square bg-border rounded-lg overflow-hidden ${className}`}>
      {imageId ? (
        <img
          src={`/images/${imageId}.jpg`}
          alt={title}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-text-muted text-meta">Pas d'image</span>
        </div>
      )}
    </div>
  );
}

/**
 * Base GameCard component
 * Can be extended with additional actions via children prop
 */
export default function GameCard({ 
  game, 
  onClick,
  children,
  className = ''
}) {
  const imageId = game.primaryImage?.id || game.primaryImage;

  return (
    <article
      onClick={onClick ? () => onClick(game.id) : undefined}
      className={`card ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
    >
      {/* Game image - square format */}
      <GameImage 
        imageId={imageId} 
        title={game.title} 
        className="mb-3"
      />

      {/* Title */}
      <h3 className="text-card-title text-text-primary mb-2 line-clamp-1">
        {game.title}
      </h3>

      {/* Meta info */}
      <div className="flex items-center gap-3 text-meta text-text-secondary">
        <span>{game.playerCount}</span>
        <DurationIcon duration={game.playDuration} />
      </div>

      {/* Indicators */}
      <div className="flex items-center gap-2 mt-3">
        {game.hasAwards && (
          <span className="text-award" title="Primé">
            🏆
          </span>
        )}
        {game.isFavorite && (
          <span className="text-favorite" title="Favori">
            ❤️
          </span>
        )}
      </div>

      {/* Additional actions (admin buttons, etc.) */}
      {children}
    </article>
  );
}