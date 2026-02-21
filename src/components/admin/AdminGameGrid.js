/**
 * AdminGameGrid Component
 * 
 * Grid of game cards with admin actions.
 * Uses the shared GameCard component.
 * As specified in specs/phase_7_4_ui_admin_game_list.md
 */

import GameCard from '@/components/common/GameCard';

function AdminGameCard({ game, onToggleFavorite, onArchive, onRestore }) {
  return (
    <GameCard 
      game={game} 
      className={game.isArchived ? 'opacity-60' : ''}
    >
      {/* Archived indicator */}
      {game.isArchived && (
        <span className="text-meta text-text-muted ml-2">(archivé)</span>
      )}

      {/* Action buttons - icon only */}
      <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-border">
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
    </GameCard>
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