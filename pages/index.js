import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { GameRepository } from '../src/repository/GameRepository';
import { FilteringEngine } from '../src/filtering/FilteringEngine';
import { SortingEngine } from '../src/filtering/SortingEngine';
import { GameCardMapper } from '../src/mapper/GameCardMapper';
import GameCard from '../components/GameCard';
import FilterPanel from '../components/FilterPanel';

export default function Home() {
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
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <Head>
          <title>Board Game Library</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <p className="text-2xl">Chargement des jeux...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <Head>
          <title>Board Game Library</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <p className="text-2xl text-red-600">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center py-2">
      <Head>
        <title>Board Game Library</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center px-20">
        <h1 className="text-6xl font-bold mb-8">Ma Bibliothèque de Jeux</h1>

        <div className="flex w-full max-w-6xl">
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
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t mt-8">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4" />
        </a>
      </footer>
    </div>
  );
}
