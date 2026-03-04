import Head from 'next/head';
import { useState, useEffect, useMemo } from 'react';
import { getAllGames, Context } from '@/repository/GameRepository';
import { applyFilters } from '@/engines/FilteringEngine';
import { applySorting, SortMode, getDefaultSortMode } from '@/engines/SortingEngine';
import { mapToGameCards } from '@/domain/GameCard';
import { createEmptyFilterSet } from '@/domain/Filters';
import Header from '@/components/layout/Header';
import FilterPanel from '@/components/visitor/FilterPanel';
import GameGrid from '@/components/visitor/GameGrid';
import GameDetailModal from '@/components/visitor/GameDetailModal';

export default function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(createEmptyFilterSet());
  const [sortMode, setSortMode] = useState(getDefaultSortMode());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameId, setSelectedGameId] = useState(null);

  // Load games on mount
  useEffect(() => {
    async function loadGames() {
      try {
        const allGames = await getAllGames(Context.VISITOR);
        setGames(allGames);
      } catch (error) {
        console.error('Failed to load games:', error);
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, []);

  // Apply filters, search, and sorting
  const displayedGames = useMemo(() => {
    let result = applyFilters(games, filters);
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(game => 
        game.title.toLowerCase().includes(query)
      );
    }
    
    return applySorting(result, sortMode);
  }, [games, filters, sortMode, searchQuery]);

  // Map to card view models
  const gameCards = useMemo(() => mapToGameCards(displayedGames), [displayedGames]);

  // Get selected game for modal
  const selectedGame = useMemo(() => {
    if (!selectedGameId) return null;
    return games.find(g => g.id === selectedGameId);
  }, [games, selectedGameId]);

  const handleGameClick = (gameId) => {
    setSelectedGameId(gameId);
  };

  const handleCloseModal = () => {
    setSelectedGameId(null);
  };

  return (
    <>
      <Head>
        <title>Notre Ludothèque</title>
        <meta name="description" content="Découvrez notre collection de jeux de société" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <main className="min-h-screen bg-cream">
        <Header title="Notre Ludothèque" />
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            sortMode={sortMode}
            onSortModeChange={setSortMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            games={games}
          />
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-text-secondary">Chargement...</p>
            </div>
          ) : (
            <GameGrid
              games={gameCards}
              onGameClick={handleGameClick}
            />
          )}
        </div>

        {selectedGame && (
          <GameDetailModal
            game={selectedGame}
            onClose={handleCloseModal}
          />
        )}
      </main>
    </>
  );
}