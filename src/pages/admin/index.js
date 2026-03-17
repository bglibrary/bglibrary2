/**
 * Admin Dashboard Page
 * 
 * Main admin interface for managing games.
 * As specified in specs/phase_8_implementation_plan.md and specs/phase_7_4_ui_admin_game_list.md
 */

import Head from 'next/head';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getAllGames, Context } from '@/repository/GameRepository';
import { mapToGameCards } from '@/domain/GameCard';
import { getSessionHistory } from '@/admin/SessionHistory';
import { getAdminGameService } from '@/admin/AdminGameService';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminGameGrid from '@/components/admin/AdminGameGrid';
import SessionHistoryPanel from '@/components/admin/SessionHistoryPanel';
import ConfirmDialog from '@/components/common/ConfirmDialog';

export default function AdminDashboard() {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [historyVersion, setHistoryVersion] = useState(0); // Force re-render on history changes

  // Session history
  const sessionHistory = useMemo(() => getSessionHistory(), []);
  const adminService = useMemo(() => getAdminGameService(), []);

  // Load games on mount
  useEffect(() => {
    async function loadGames() {
      try {
        const allGames = await getAllGames(Context.ADMIN);
        
        // Apply pending UPDATE_GAME actions from session history
        sessionHistory.loadFromStorage();
        const actions = sessionHistory.getActions();
        let updatedGames = [...allGames];
        
        actions.forEach(action => {
          if (action.type === 'UPDATE_GAME' && action.payload) {
            updatedGames = updatedGames.map(g => 
              g.id === action.gameId ? { ...g, ...action.payload } : g
            );
          }
        });
        
        setGames(updatedGames);
      } catch (error) {
        console.error('Failed to load games:', error);
      } finally {
        setLoading(false);
      }
    }
    loadGames();
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

  // Separate active and archived games
  const { activeGames, archivedGames } = useMemo(() => {
    const active = [];
    const archived = [];
    filteredGames.forEach(game => {
      if (game.archived) {
        archived.push(game);
      } else {
        active.push(game);
      }
    });
    return { activeGames: active, archivedGames: archived };
  }, [filteredGames]);

  // Map to card view models
  const activeGameCards = useMemo(() => mapToGameCards(activeGames), [activeGames]);
  const archivedGameCards = useMemo(() => mapToGameCards(archivedGames), [archivedGames]);

  // Get history actions (re-compute when historyVersion changes)
  const historyActions = useMemo(() => sessionHistory.getActions(), [sessionHistory, historyVersion]);
  const historyCount = useMemo(() => sessionHistory.getCount(), [sessionHistory, historyVersion]);

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
          // Force history panel to update
          setHistoryVersion(v => v + 1);
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
          // Force history panel to update
          setHistoryVersion(v => v + 1);
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
          // Force history panel to update
          setHistoryVersion(v => v + 1);
        } catch (error) {
          console.error('Failed to restore game:', error);
        }
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null),
    });
  }, [games, adminService]);

  const handleDelete = useCallback(async (gameId) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    setConfirmDialog({
      title: 'Supprimer le jeu',
      message: `Supprimer définitivement "${game.title}" ? Cette action est irréversible.`,
      confirmLabel: 'Supprimer',
      onConfirm: async () => {
        try {
          await adminService.deleteGame(gameId);
          // Remove the game from local state
          setGames(prev => prev.filter(g => g.id !== gameId));
          // Force history panel to update
          setHistoryVersion(v => v + 1);
        } catch (error) {
          console.error('Failed to delete game:', error);
        }
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null),
    });
  }, [games, adminService]);

  // Handle game update from edit page
  const handleGameUpdated = useCallback((gameId, updatedData) => {
    setGames(prev => prev.map(g => 
      g.id === gameId ? { ...g, ...updatedData } : g
    ));
    setHistoryVersion(v => v + 1);
  }, []);

  const handleClearSession = useCallback(() => {
    setConfirmDialog({
      title: 'Effacer la session',
      message: 'Supprimer toutes les modifications en attente ? Cette action est irréversible.',
      onConfirm: async () => {
        sessionHistory.clearAll();
        setHistoryVersion(v => v + 1); // Force re-render
        // Reload games from repository to reset visual state
        try {
          const allGames = await getAllGames(Context.ADMIN);
          setGames(allGames);
        } catch (error) {
          console.error('Failed to reload games:', error);
        }
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null),
    });
  }, [sessionHistory]);

  const handleDeleteAction = useCallback((index) => {
    // Get the action before removing it to reverse its effect
    const action = sessionHistory.getAction(index);
    
    if (action) {
      // Reverse the visual effect based on action type
      if (action.type === 'TOGGLE_FAVORITE') {
        // Toggle back the favorite state
        setGames(prev => prev.map(g => 
          g.id === action.gameId ? { ...g, favorite: !g.favorite } : g
        ));
      } else if (action.type === 'ARCHIVE_GAME') {
        // Un-archive the game
        setGames(prev => prev.map(g => 
          g.id === action.gameId ? { ...g, archived: false } : g
        ));
      } else if (action.type === 'RESTORE_GAME') {
        // Re-archive the game
        setGames(prev => prev.map(g => 
          g.id === action.gameId ? { ...g, archived: true } : g
        ));
      } else if (action.type === 'UPDATE_GAME') {
        // Reload games from repository to get original data
        getAllGames(Context.ADMIN).then(allGames => {
          setGames(allGames);
          setHistoryVersion(v => v + 1);
        });
        sessionHistory.removeAction(index);
        return;
      }
    }
    
    sessionHistory.removeAction(index);
    setHistoryVersion(v => v + 1); // Force re-render
  }, [sessionHistory]);

  // Apply pending UPDATE_GAME actions from session history to local state
  useEffect(() => {
    const actions = sessionHistory.getActions();
    actions.forEach(action => {
      if (action.type === 'UPDATE_GAME' && action.payload) {
        setGames(prev => prev.map(g => 
          g.id === action.gameId ? { ...g, ...action.payload } : g
        ));
      }
    });
  }, [historyVersion, sessionHistory]);

  const handleExportScript = useCallback(() => {
    // Export actions as JSON for use with scripts/apply-changes.js
    const actions = sessionHistory.getActions().map(action => ({
      id: action.id,
      type: action.type,
      timestamp: action.timestamp,
      gameId: action.gameId,
      gameTitle: action.gameTitle,
      payload: action.payload,
    }));
    
    const json = JSON.stringify(actions, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'session-changes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [sessionHistory]);

  // Handle edit action from history panel
  const handleEditAction = useCallback((index, action) => {
    if (!action || !action.gameId) return;
    
    // Navigate to the edit page for the game
    router.push(`/admin/edit-game/${action.gameId}`);
  }, [router]);

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
          historyCount={historyCount}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="flex">
          {/* Main content */}
          <div className={`flex-1 p-6 ${showHistory ? 'mr-80' : ''}`}>
            <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-text-secondary">Chargement...</p>
              </div>
            ) : (
              <>
                <AdminGameGrid
                  games={activeGameCards}
                  onToggleFavorite={handleToggleFavorite}
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                  viewMode={viewMode}
                  emptyMessage="Aucun jeu actif."
                />
                <AdminGameGrid
                  games={archivedGameCards}
                  onToggleFavorite={handleToggleFavorite}
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                  viewMode={viewMode}
                  title="Jeux archivés"
                  emptyMessage="Aucun jeu archivé."
                  collapsible={true}
                  defaultCollapsed={true}
                />
              </>
            )}
            </div>
          </div>

          {/* Session History Panel */}
          {showHistory && (
            <SessionHistoryPanel
              actions={historyActions}
              onClearAll={handleClearSession}
              onExport={handleExportScript}
              onClose={() => setShowHistory(false)}
              onDeleteAction={handleDeleteAction}
              onEditAction={handleEditAction}
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