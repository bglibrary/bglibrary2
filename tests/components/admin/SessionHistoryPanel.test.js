/**
 * Tests for SessionHistoryPanel Component
 * 
 * Tests the edit button functionality in the history panel
 */

import { render, screen, fireEvent } from '@testing-library/react';
import SessionHistoryPanel from '@/components/admin/SessionHistoryPanel';
import { ActionType } from '@/admin/SessionHistory';

// Mock router
const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('SessionHistoryPanel', () => {
  const mockActions = [
    {
      id: 'action-1',
      type: ActionType.UPDATE_GAME,
      gameId: 'catan',
      gameTitle: 'Catan',
      summary: 'Modifier: Catan',
      timestamp: new Date().toISOString(),
      payload: { title: 'Catan Updated' },
    },
    {
      id: 'action-2',
      type: ActionType.ADD_GAME,
      gameId: 'new-game',
      gameTitle: 'New Game',
      summary: 'Ajouter: New Game',
      timestamp: new Date().toISOString(),
      payload: { title: 'New Game' },
    },
    {
      id: 'action-3',
      type: ActionType.TOGGLE_FAVORITE,
      gameId: 'azul',
      gameTitle: 'Azul',
      summary: 'Favori: Azul',
      timestamp: new Date().toISOString(),
      payload: { favorite: true },
    },
  ];

  const defaultProps = {
    actions: mockActions,
    onClearAll: jest.fn(),
    onExport: jest.fn(),
    onClose: jest.fn(),
    onDeleteAction: jest.fn(),
    onEditAction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the panel with title', () => {
      render(<SessionHistoryPanel {...defaultProps} />);
      
      expect(screen.getByText('Modifications')).toBeInTheDocument();
    });

    it('should display action count badge', () => {
      render(<SessionHistoryPanel {...defaultProps} />);
      
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should render all actions', () => {
      render(<SessionHistoryPanel {...defaultProps} />);
      
      expect(screen.getByText('Modifier: Catan')).toBeInTheDocument();
      expect(screen.getByText('Ajouter: New Game')).toBeInTheDocument();
      expect(screen.getByText('Favori: Azul')).toBeInTheDocument();
    });

    it('should show empty state when no actions', () => {
      render(<SessionHistoryPanel {...defaultProps} actions={[]} />);
      
      expect(screen.getByText('Aucune modification en attente.')).toBeInTheDocument();
    });
  });

  describe('edit button', () => {
    it('should show edit button for UPDATE_GAME action', () => {
      render(<SessionHistoryPanel {...defaultProps} />);
      
      // There should be 2 edit buttons (for UPDATE_GAME and ADD_GAME)
      const editButtons = screen.getAllByTitle('Modifier');
      expect(editButtons).toHaveLength(2);
    });

    it('should NOT show edit button for TOGGLE_FAVORITE action', () => {
      render(<SessionHistoryPanel {...defaultProps} />);
      
      // Get all action items
      const actionItems = screen.getAllByRole('button');
      
      // The TOGGLE_FAVORITE action should only have delete button, not edit
      // We can verify by counting - 2 edit buttons + 3 delete buttons + header buttons
      const editButtons = screen.getAllByTitle('Modifier');
      expect(editButtons).toHaveLength(2);
    });

    it('should call onEditAction when edit button is clicked for UPDATE_GAME', () => {
      const onEditAction = jest.fn();
      render(<SessionHistoryPanel {...defaultProps} onEditAction={onEditAction} />);
      
      const editButtons = screen.getAllByTitle('Modifier');
      fireEvent.click(editButtons[0]); // Click first edit button (UPDATE_GAME)
      
      expect(onEditAction).toHaveBeenCalledTimes(1);
      expect(onEditAction).toHaveBeenCalledWith(0, mockActions[0]);
    });

    it('should call onEditAction when edit button is clicked for ADD_GAME', () => {
      const onEditAction = jest.fn();
      render(<SessionHistoryPanel {...defaultProps} onEditAction={onEditAction} />);
      
      const editButtons = screen.getAllByTitle('Modifier');
      fireEvent.click(editButtons[1]); // Click second edit button (ADD_GAME)
      
      expect(onEditAction).toHaveBeenCalledTimes(1);
      expect(onEditAction).toHaveBeenCalledWith(1, mockActions[1]);
    });

    it('should have type="button" to prevent form submission', () => {
      render(<SessionHistoryPanel {...defaultProps} />);
      
      const editButtons = screen.getAllByTitle('Modifier');
      editButtons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('should have cursor-pointer class for clickable feedback', () => {
      render(<SessionHistoryPanel {...defaultProps} />);
      
      const editButtons = screen.getAllByTitle('Modifier');
      editButtons.forEach(button => {
        expect(button).toHaveClass('cursor-pointer');
      });
    });
  });

  describe('delete button', () => {
    it('should show delete button for all actions', () => {
      render(<SessionHistoryPanel {...defaultProps} />);
      
      const deleteButtons = screen.getAllByTitle('Supprimer');
      expect(deleteButtons).toHaveLength(3); // One for each action
    });

    it('should call onDeleteAction when delete button is clicked', () => {
      const onDeleteAction = jest.fn();
      render(<SessionHistoryPanel {...defaultProps} onDeleteAction={onDeleteAction} />);
      
      const deleteButtons = screen.getAllByTitle('Supprimer');
      fireEvent.click(deleteButtons[0]);
      
      expect(onDeleteAction).toHaveBeenCalledTimes(1);
      expect(onDeleteAction).toHaveBeenCalledWith(0);
    });
  });

  describe('panel actions', () => {
    it('should call onClose when close button is clicked', () => {
      const onClose = jest.fn();
      render(<SessionHistoryPanel {...defaultProps} onClose={onClose} />);
      
      fireEvent.click(screen.getByTitle('Fermer'));
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onExport when export button is clicked', () => {
      const onExport = jest.fn();
      render(<SessionHistoryPanel {...defaultProps} onExport={onExport} />);
      
      fireEvent.click(screen.getByText('Exporter les modifications'));
      
      expect(onExport).toHaveBeenCalledTimes(1);
    });

    it('should call onClearAll when clear button is clicked', () => {
      const onClearAll = jest.fn();
      render(<SessionHistoryPanel {...defaultProps} onClearAll={onClearAll} />);
      
      fireEvent.click(screen.getByText('Effacer tout'));
      
      expect(onClearAll).toHaveBeenCalledTimes(1);
    });
  });
});