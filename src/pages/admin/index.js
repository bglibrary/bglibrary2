/**
 * Admin Dashboard Page
 * 
 * Main admin interface for managing games.
 * As specified in specs/phase_8_implementation_plan.md and specs/phase_7_4_ui_admin_game_list.md
 */

import Head from 'next/head';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllGames, Context } from '@/repository/GameRepository';
import { mapToGameCards } from '@/domain/GameCard';
import { getSessionHistory } from '@/admin/SessionHistory';
import { getAdminGameService } from '@/admin/AdminGameService';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminGameGrid from '@/components/admin/AdminGameGrid';
import SessionHistoryPanel from '@/components/admin/SessionHistoryPanel';
import ConfirmDialog from '@/components/common/ConfirmDialog';

export default function AdminDashboard() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Session history
  const sessionHistory = useMemo(() => getSessionHistory(), []);
  const adminService = useMemo(() => getAdminGameService(), []);

  // Load games on mount
  useEffect(() => {
    async function loadGames() {
      try {
        const allGames = await getAllGames(Context.ADMIN);
        setGames(allGames);
      } catch (error) {
        console.error('Failed to load games:', error);
      } finally {
        setLoading(false);
      }
    }
    loadGames();

    // Load session from storage
    sessionHistory.loadFromStorage();
  }, [sessionHistory]);

  // Filter games by search query
  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) {
      return games;
    }
    const query = searchQuery.toLowerCase();
    return games.filter(game => 
      game.title.toLowerCase().includes(query)
    );
  }, [games, searchQuery]);

  // Map to card view models
  const gameCards = useMemo(() => mapToGameCards(filteredGames), [filteredGames]);

  // Actions
  const handleToggleFavorite = useCallback(async (gameId) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    setConfirmDialog({
      title: game.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris',
      message: `${game.favorite ? 'Retirer' : 'Ajouter'} "${game.title}" ${game.favorite ? 'des' : 'aux'} favoris ?`,
      onConfirm: async () => {
        try {
          await adminService.toggleFavorite(gameId);
          // Update local state
          setGames(prev => prev.map(g => 
            g.id === gameId ? { ...g, favorite: !g.favorite } : g
          ));
        } catch (error) {
          console.error('Failed to toggle favorite:', error);
        }
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null),
    });
  }, [games, adminService]);

  const handleArchive = useCallback(async (gameId) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    setConfirmDialog({
      title: 'Archiver le jeu',
      message: `Archiver "${game.title}" ? Il ne sera plus visible pour les visiteurs.`,
      onConfirm: async () => {
        try {
          await adminService.archiveGame(gameId);
          setGames(prev => prev.map(g => 
            g.id === gameId ? { ...g, archived: true } : g
          ));
        } catch (error) {
          console.error('Failed to archive game:', error);
        }
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null),
    });
  }, [games, adminService]);

  const handleRestore = useCallback(async (gameId) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    setConfirmDialog({
      title: 'Restaurer le jeu',
      message: `Restaurer "${game.title}" ? Il sera à nouveau visible pour les visiteurs.`,
      onConfirm: async () => {
        try {
          await adminService.restoreGame(gameId);
          setGames(prev => prev.map(g => 
            g.id === gameId ? { ...g, archived: false } : g
          ));
        } catch (error) {
          console.error('Failed to restore game:', error);
        }
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null),
    });
  }, [games, adminService]);

  const handleClearSession = useCallback(() => {
    setConfirmDialog({
      title: 'Effacer la session',
      message: 'Supprimer toutes les modifications en attente ? Cette action est irréversible.',
      onConfirm: () => {
        sessionHistory.clearAll();
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null),
    });
  }, [sessionHistory]);

  const handleExportScript = useCallback(() => {
    const script = sessionHistory.generatePythonScript();
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'update_library.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [sessionHistory]);

  return (
    <>
      <Head>
        <title>Admin - Notre Ludothèque</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <main className="min-h-screen bg-cream">
        <AdminHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleHistory={() => setShowHistory(!showHistory)}
          historyCount={sessionHistory.getCount()}
        />

        <div className="flex">
          {/* Main content */}
          <div className={`flex-1 p-6 ${showHistory ? 'mr-80' : ''}`}>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-text-secondary">Chargement...</p>
              </div>
            ) : (
              <AdminGameGrid
                games={gameCards}
                onToggleFavorite={handleToggleFavorite}
                onArchive={handleArchive}
                onRestore={handleRestore}
              />
            )}
          </div>

          {/* Session History Panel */}
          {showHistory && (
            <SessionHistoryPanel
              actions={sessionHistory.getActions()}
              onClearAll={handleClearSession}
              onExport={handleExportScript}
              onClose={() => setShowHistory(false)}
            />
          )}
        </div>

        {/* Confirm Dialog */}
        {confirmDialog && (
          <ConfirmDialog
            title={confirmDialog.title}
            message={confirmDialog.message}
            onConfirm={confirmDialog.onConfirm}
            onCancel={confirmDialog.onCancel}
          />
        )}
      </main>
    </>
  );
}