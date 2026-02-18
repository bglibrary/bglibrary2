import { useState, useMemo } from 'react';
import Head from 'next/head';
import * as FilteringEngine from '../src/filtering/FilteringEngine';
import * as SortingEngine from '../src/filtering/SortingEngine';
import * as GameCardMapper from '../src/mapper/GameCardMapper';
import GameCard from '../components/GameCard';
import FilterPanel from '../components/FilterPanel';
import { getGamesForVisitor } from '../src/infrastructure/getGames';

export async function getStaticProps() {
  const games = await getGamesForVisitor();
  return {
    props: {
      initialGames: games,
    },
  };
}

export default function Home({ initialGames }) {
  const [filters, setFilters] = useState({});
  const [sortMode, setSortMode] = useState(null);

  const displayedGames = useMemo(() => {
    let filtered = FilteringEngine.applyFilters(initialGames, filters);
    let sorted = SortingEngine.applySorting(filtered, sortMode);
    return sorted.map((game) => GameCardMapper.mapGameToCard(game));
  }, [initialGames, filters, sortMode]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortMode) => {
    setSortMode(newSortMode);
  };

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
            sortMode={sortMode || ""}
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
          />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-8">
            {displayedGames.length > 0 ? (
              displayedGames.map((gameCard) => (
                <GameCard key={gameCard.id} card={gameCard} />
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
