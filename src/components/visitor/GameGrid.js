/**
 * GameGrid Component
 * 
 * Responsive grid of game cards with 6-7 columns on desktop.
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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