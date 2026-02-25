/**
 * GameCard Component (Shared)
 * 
 * Card with title below image and overlay info band.
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
    <div className={`aspect-square bg-border overflow-hidden ${className}`}>
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
 * Info band overlay for visitor cards
 * Shows player count, duration, awards, favorite - in fixed positions (35% 35% 15% 15%)
 */
function InfoBand({ game }) {
  // Extract just the player range (e.g., "3-4" from "3-4 joueurs")
  const playerRange = game.playerCount?.replace(/\s*joueurs?\s*/gi, '').trim() || game.playerCount;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-2 py-2 flex items-center text-white text-sm">
      {/* Position 1: Players - 32% - aligné à gauche */}
      <div className="w-[32%] flex items-center justify-start gap-1 pl-1" title={game.playerCount}>
        <span>👥</span>
        <span>{playerRange}</span>
      </div>
      
      {/* Position 2: Duration - 32% - centré */}
      <div className="w-[32%] flex items-center justify-center">
        <DurationHourglasses duration={game.playDuration} />
      </div>
      
      {/* Position 3: Awards - 18% - centré */}
      <div className="w-[18%] flex items-center justify-center">
        {game.hasAwards ? (
          <span title="Primé">🏆</span>
        ) : (
          <span className="invisible">🏆</span>
        )}
      </div>
      
      {/* Position 4: Favorite - 18% - aligné à droite */}
      <div className="w-[18%] flex items-center justify-end pr-1">
        {game.isFavorite ? (
          <span title="Favori">❤️</span>
        ) : (
          <span className="invisible">❤️</span>
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
 * Visitor GameCard - card with title below image and info overlay
 * Cream background wraps the entire card
 */
export function VisitorGameCard({ game, onClick, className = '' }) {
  const imageId = game.primaryImage?.id || game.primaryImage;

  return (
    <article
      onClick={onClick ? () => onClick(game.id) : undefined}
      className={`bg-card rounded-xl shadow-md border border-border overflow-hidden 
        ${onClick ? 'cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1' : ''} 
        ${className}`}
    >
      {/* Image container with overlay - overlay width matches image */}
      <div className="relative p-2 pb-0">
        <div className="relative rounded-lg overflow-hidden">
          <GameImage 
            imageId={imageId} 
            title={game.title}
          />
          <InfoBand game={game} />
        </div>
      </div>

      {/* Title below image */}
      <h3 className="text-card-title text-text-primary px-3 py-2 truncate">
        {game.title}
      </h3>
    </article>
  );
}

/**
 * Admin GameCard - same style as visitor card but with action buttons overlay
 */
export function AdminGameCard({ game, children, className = '' }) {
  const imageId = game.primaryImage?.id || game.primaryImage;

  return (
    <article
      className={`bg-card rounded-xl shadow-md border border-border overflow-hidden ${game.isArchived ? 'opacity-60' : ''} ${className}`}
    >
      {/* Image container with overlay - same style as visitor card */}
      <div className="relative p-2 pb-0">
        <div className="relative rounded-lg overflow-hidden">
          <GameImage 
            imageId={imageId} 
            title={game.title}
          />
          {/* Action buttons overlay instead of info band */}
          <ActionBand>
            {children}
          </ActionBand>
        </div>
      </div>

      {/* Title below image - same style as visitor card */}
      <h3 className="text-card-title text-text-primary px-3 py-2 truncate">
        {game.title}
      </h3>
    </article>
  );
}

/**
 * Base GameCard component (kept for backward compatibility)
 * Now uses the visitor style with title
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