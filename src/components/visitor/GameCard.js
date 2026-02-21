/**
 * GameCard Component
 * 
 * Card displaying game summary information.
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

export default function GameCard({ game, onClick }) {
  return (
    <article
      onClick={() => onClick(game.id)}
      className="card cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Image placeholder */}
      <div className="aspect-video bg-border rounded-lg mb-3 flex items-center justify-center">
        {game.primaryImage ? (
          <span className="text-text-muted text-meta">Image</span>
        ) : (
          <span className="text-text-muted text-meta">Pas d'image</span>
        )}
      </div>

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
    </article>
  );
}