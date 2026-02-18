import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog';
import { getGamesForAdmin } from '../../src/infrastructure/getGames';

export async function getStaticProps() {
  const allGames = await getGamesForAdmin();
  return {
    props: {
      initialGames: allGames,
    },
  };
}

export default function AdminGameListPage({ initialGames }) {
  const [games, setGames] = useState(initialGames);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogConfig, setDialogConfig] = useState({ isOpen: false, type: null, gameId: null });

  // In a static export scenario, we can't easily "refetch" from the client 
  // without a real API. For now, since it's a static site, modifications 
  // will likely require a rebuild or we'd need to change the architecture.
  // However, we'll keep the UI structure.
  const fetchGames = async () => {
    // For static export, this might not work as expected if API routes are disabled.
    // If the user is running in dev mode, it might still work if they are not using output: export.
    // But since output: export is set, we rely on getStaticProps.
    console.warn("Dynamic refetch is not fully supported with 'output: export' without functional API routes.");
  };

  const openDialog = (type, gameId) => {
    setDialogConfig({ isOpen: true, type, gameId });
  };

  const closeDialog = () => {
    setDialogConfig({ isOpen: false, type: null, gameId: null });
  };

  const handleConfirm = async () => {
    const { type, gameId } = dialogConfig;
    try {
      const endpoint = type === 'archive' ? '/api/admin/archive-game' : '/api/admin/restore-game';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: gameId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to ${type} game`);
      }

      // After a successful action, we'd ideally refresh the list.
      // In static export, this is tricky.
      alert(`${type === 'archive' ? 'Archivé' : 'Restauré'} avec succès. Note: les changements nécessitent un rebuild pour être définitifs en production.`);
      
      // Local state update as a fallback
      setGames(games.map(g => g.id === gameId ? { ...g, archived: type === 'archive' } : g));
    } catch (err) {
      alert(`Erreur : ${err.message}`);
    } finally {
      closeDialog();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Head>
        <title>Administration - Game Library</title>
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Gestion de la Bibliothèque</h1>
          <div className="flex gap-4">
            <Link href="/" className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
              Voir le site
            </Link>
            <Link href="/admin/add-game" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Ajouter un jeu
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joueurs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Favori</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {games.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 italic">Aucun jeu dans la bibliothèque.</td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game.id} className={game.archived ? "bg-gray-50" : "bg-white"}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{game.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {game.minPlayers}{game.maxPlayers > game.minPlayers ? `-${game.maxPlayers}` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.playDuration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {game.favorite ? '❤️' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${game.archived ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {game.archived ? 'Archivé' : 'Actif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <Link href={`/admin/edit-game/${game.id}`} className="text-blue-600 hover:text-blue-900 transition-colors">
                        Modifier
                      </Link>
                      {game.archived ? (
                        <button 
                          onClick={() => openDialog('restore', game.id)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                        >
                          Restaurer
                        </button>
                      ) : (
                        <button 
                          onClick={() => openDialog('archive', game.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Archiver
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={dialogConfig.isOpen}
        title={dialogConfig.type === 'archive' ? 'Archiver le jeu' : 'Restaurer le jeu'}
        message={dialogConfig.type === 'archive' 
          ? 'Êtes-vous sûr de vouloir archiver ce jeu ? Il ne sera plus visible par les visiteurs.' 
          : 'Voulez-vous restaurer ce jeu ? Il sera de nouveau visible par les visiteurs.'
        }
        onConfirm={handleConfirm}
        onCancel={closeDialog}
      />
    </div>
  );
}
