/**
 * AdminGameGrid Component
 * 
 * Grid of game cards with admin actions.
 * As specified in specs/phase_7_4_ui_admin_game_list.md
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

function AdminGameCard({ game, onToggleFavorite, onArchive, onRestore }) {
  return (
    <article className={`card ${game.isArchived ? 'opacity-60' : ''}`}>
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
        {game.isArchived && (
          <span className="text-meta text-text-muted ml-2">(archivé)</span>
        )}
      </h3>

      {/* Meta info */}
      <div className="flex items-center gap-3 text-meta text-text-secondary mb-3">
        <span>{game.playerCount}</span>
        <DurationIcon duration={game.playDuration} />
      </div>

      {/* Indicators */}
      <div className="flex items-center gap-2 mb-3">
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

      {/* Action buttons - icon only */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
        {/* Edit */}
        <a
          href={`/admin/edit-game/${game.id}`}
          className="p-2 rounded-button hover:bg-cream transition-colors text-action"
          title="Modifier"
        >
          ✏️
        </a>

        {/* Archive/Restore */}
        {game.isArchived ? (
          <button
            onClick={() => onRestore(game.id)}
            className="p-2 rounded-button hover:bg-cream transition-colors text-secondary"
            title="Restaurer"
          >
            📤
          </button>
        ) : (
          <button
            onClick={() => onArchive(game.id)}
            className="p-2 rounded-button hover:bg-cream transition-colors text-action"
            title="Archiver"
          >
            📦
          </button>
        )}

        {/* Favorite toggle */}
        <button
          onClick={() => onToggleFavorite(game.id)}
          className={`p-2 rounded-button hover:bg-cream transition-colors ${
            game.isFavorite ? 'text-favorite' : 'text-action'
          }`}
          title={game.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          {game.isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
    </article>
  );
}

export default function AdminGameGrid({ games, onToggleFavorite, onArchive, onRestore }) {
  if (!games || games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-text-secondary text-body">
          Aucun jeu trouvé.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-grid-gap">
      {games.map(game => (
        <AdminGameCard
          key={game.id}
          game={game}
          onToggleFavorite={onToggleFavorite}
          onArchive={onArchive}
          onRestore={onRestore}
        />
      ))}
    </div>
  );
}