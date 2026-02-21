/**
 * GameGrid Component
 * 
 * Responsive grid of game cards.
 * As specified in specs/UI_guidelines.md
 */

import GameCard from './GameCard';

export default function GameGrid({ games, onGameClick }) {
  if (!games || games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-text-secondary text-body">
          Aucun jeu ne correspond à vos critères.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-grid-gap">
      {games.map(game => (
        <GameCard
          key={game.id}
          game={game}
          onClick={onGameClick}
        />
      ))}
    </div>
  );
}