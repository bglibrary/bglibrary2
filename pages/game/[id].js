import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GameRepository } from '../../src/repository/GameRepository';

export default function GameDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchGame = async () => {
      try {
        setLoading(true);
        setError(null);
        const gameData = await GameRepository.getGameById(id, "visitor");
        setGame(gameData);
      } catch (err) {
        console.error("Failed to fetch game:", err);
        if (err.message === "GameNotFound" || err.message === "GameArchivedNotVisible") {
          setError("Jeu non trouvé ou accès refusé.");
        } else {
          setError("Erreur : Impossible de charger les détails du jeu.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <p className="text-2xl">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <p className="text-2xl text-red-600 mb-4">{error}</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Retour à la bibliothèque
        </Link>
      </div>
    );
  }

  if (!game) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>{game.title} - Board Game Library</title>
      </Head>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:shrink-0 bg-gray-200 flex items-center justify-center h-48 md:h-auto md:w-80">
            {/* Placeholder for image */}
            <span className="text-gray-400">Image: {game.images[0]?.id}</span>
          </div>
          <div className="p-8 w-full">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900">{game.title}</h1>
              {game.favorite && (
                <span className="text-red-500 text-2xl" title="Coup de cœur">❤️</span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="font-semibold mr-1">Joueurs:</span> {game.minPlayers}{game.maxPlayers > game.minPlayers ? `-${game.maxPlayers}` : ''}
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-1">Durée:</span> {game.playDuration}
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-1">Complexité:</span> {game.firstPlayComplexity}
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-1">Âge:</span> {game.ageRecommendation}
              </div>
            </div>

            <p className="mt-6 text-gray-700 leading-relaxed">
              {game.description}
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Catégories</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {game.categories.map(cat => (
                    <li key={cat} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Mécaniques</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {game.mechanics.map(mech => (
                    <li key={mech} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                      {mech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {game.awards && game.awards.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Prix</h3>
                <ul className="mt-2 space-y-1">
                  {game.awards.map((award, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      🏆 <span className="font-medium">{award.name}</span> ({award.year})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 border-t pt-6">
              <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                &larr; Retour à la bibliothèque
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
