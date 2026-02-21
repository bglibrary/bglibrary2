/**
 * GameCard Component (Shared)
 * 
 * Compact card with overlay info band.
 * Used by both visitor and admin views.
 * As specified in specs/UI_guidelines.md and specs/phase_7_2_ui_visitor_game_library.md
 */

import { PlayDuration } from '@/domain/Game';

// Duration displayed as hourglasses (1-3)
const DurationHourglasses = ({ duration }) => {
  const count = {
    [PlayDuration.SHORT]: 1,
    [PlayDuration.MEDIUM]: 2,
    [PlayDuration.LONG]: 3,
  }[duration] || 1;

  return (
    <span className="inline-flex items-center gap-0.5" title={duration}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i}>⏳</span>
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
};

/**
 * Info band overlay for visitor cards
 * Shows player count, duration, awards, favorite
 */
function InfoBand({ game }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-2 py-1.5 flex items-center justify-between text-white text-xs">
      <div className="flex items-center gap-2">
        <span>{game.playerCount}</span>
        <DurationHourglasses duration={game.playDuration} />
      </div>
      <div className="flex items-center gap-1.5">
        {game.hasAwards && (
          <span title="Primé">🏆</span>
        )}
        {game.isFavorite && (
          <span title="Favori">❤️</span>
        )}
      </div>
    </div>
  );
}

/**
 * Action band overlay for admin cards
 * Shows action buttons
 */
export function ActionBand({ children }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-2 py-1.5 flex items-center justify-end gap-1.5">
      {children}
    </div>
  );
}

/**
 * Visitor GameCard - compact with info overlay
 */
export function VisitorGameCard({ game, onClick, className = '' }) {
  const imageId = game.primaryImage?.id || game.primaryImage;

  return (
    <article
      onClick={onClick ? () => onClick(game.id) : undefined}
      className={`relative rounded-lg overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
    >
      {/* Game image - square format */}
      <GameImage 
        imageId={imageId} 
        title={game.title} 
        className="rounded-none"
      />

      {/* Info band overlay */}
      <InfoBand game={game} />
    </article>
  );
}

/**
 * Admin GameCard - compact with action buttons overlay
 */
export function AdminGameCard({ game, children, className = '' }) {
  const imageId = game.primaryImage?.id || game.primaryImage;

  return (
    <article
      className={`relative rounded-lg overflow-hidden ${game.isArchived ? 'opacity-60' : ''} ${className}`}
    >
      {/* Game image - square format */}
      <GameImage 
        imageId={imageId} 
        title={game.title} 
        className="rounded-none"
      />

      {/* Action buttons overlay */}
      <ActionBand>
        {children}
      </ActionBand>
    </article>
  );
}

/**
 * Base GameCard component (kept for backward compatibility)
 * Now uses the compact visitor style
 */
export default function GameCard({ 
  game, 
  onClick,
  children,
  className = ''
}) {
  return (
    <VisitorGameCard 
      game={game} 
      onClick={onClick} 
      className={className}
    >
      {children}
    </VisitorGameCard>
  );
}