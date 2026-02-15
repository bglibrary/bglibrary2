import { useState, useEffect, useMemo } from 'react';
import { GameRepository } from '../src/repository/GameRepository';
import { FilteringEngine } from '../src/filtering/FilteringEngine';
import { SortingEngine } from '../src/filtering/SortingEngine';
import { GameCardMapper } from '../src/mapper/GameCardMapper';
import GameCard from './GameCard';
import FilterPanel from './FilterPanel';

export default function GameLibrary() {
  const [rawGames, setRawGames] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortMode, setSortMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        const games = await GameRepository.getAllGames("visitor");
        setRawGames(games);
      } catch (err) {
        console.error("Failed to fetch games:", err);
        setError("Erreur : Impossible de charger les jeux.");
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const displayedGames = useMemo(() => {
    let filtered = FilteringEngine.applyFilters(rawGames, filters);
    let sorted = SortingEngine.applySort(filtered, sortMode);
    return sorted.map(GameCardMapper.toGameCard);
  }, [rawGames, filters, sortMode]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortMode) => {
    setSortMode(newSortMode);
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <p className="text-2xl">Chargement des jeux...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-2xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-6xl mx-auto">
      <FilterPanel
        filters={filters}
        sortMode={sortMode}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
      />
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-8">
        {displayedGames.length > 0 ? (
          displayedGames.map((gameCard) => (
            <GameCard key={gameCard.id} game={gameCard} />
          ))
        ) : (
          <p className="text-xl col-span-full text-center">Aucun jeu ne correspond à vos critères.</p>
        )}
      </div>
    </div>
  );
}
