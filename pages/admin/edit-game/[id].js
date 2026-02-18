import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import GameForm from '../../../components/admin/GameForm';
import { GameRepository } from '../../../src/repository/GameRepository';

export default function EditGamePage() {
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
        const gameData = await GameRepository.getGameById(id, "admin");
        setGame(gameData);
      } catch (err) {
        console.error("Failed to fetch game for editing:", err);
        setError("Impossible de charger les données du jeu.");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const handleSubmit = async (formData, imageFile) => {
    try {
      // In a real app, we'd handle the image upload if a new one is provided.
      console.log("Updating game:", formData, imageFile);
      
      const response = await fetch('/api/admin/update-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, gameData: formData }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update game');
      }

      router.push('/admin');
    } catch (err) {
      alert(`Erreur : ${err.message}`);
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => router.push('/admin')} className="text-blue-600 hover:underline">
          Retour à la liste admin
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Modifier le jeu - Admin</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Modifier le jeu : {game?.title}</h1>
        <GameForm initialData={game} onSubmit={handleSubmit} isEdit={true} />
      </div>
    </div>
  );
}
