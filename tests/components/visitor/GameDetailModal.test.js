/**
 * Tests for GameDetailModal Component
 * 
 * Tests the modal displaying full game details with dark mode support
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameDetailModal from '../../../src/components/visitor/GameDetailModal';
import { PlayDuration, FirstPlayComplexity } from '../../../src/domain/Game';

// Mock GameImage component
jest.mock('../../../src/components/common/GameCard', () => ({
  GameImage: ({ imageId, title, className }) => (
    <div data-testid="game-image" data-image-id={imageId ?? null} className={className}>
      {imageId ? `Image: ${title}` : 'No image'}
    </div>
  ),
}));

describe('GameDetailModal', () => {
  const mockGame = {
    id: 'test-game',
    title: 'Test Game',
    description: 'A test game description for testing purposes.',
    minPlayers: 2,
    maxPlayers: 4,
    playDuration: PlayDuration.MEDIUM,
    firstPlayComplexity: FirstPlayComplexity.LOW,
    ageRecommendation: 10,
    favorite: false,
    categories: ['Strategy', 'Family'],
    mechanics: ['Dice Rolling', 'Set Collection'],
    awards: [
      { name: 'Spiel des Jahres', year: 2020 },
      { name: 'Best Family Game' },
    ],
    images: [{ id: 'test-img', source: 'publisher' }],
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe('Basic rendering', () => {
    it('should render game title', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });

    it('should render game description', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('A test game description for testing purposes.')).toBeInTheDocument();
    });

    it('should render player count for range', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('2-4 joueurs')).toBeInTheDocument();
    });

    it('should render player count for single value', () => {
      const singlePlayerGame = { ...mockGame, minPlayers: 3, maxPlayers: 3 };
      render(<GameDetailModal game={singlePlayerGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('3 joueurs')).toBeInTheDocument();
    });

    it('should render play duration label', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('Moyen (30-60 min)')).toBeInTheDocument();
    });

    it('should render complexity label', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('Complexité: Simple')).toBeInTheDocument();
    });

    it('should render age recommendation', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('Âge: 10')).toBeInTheDocument();
    });
  });

  describe('Awards display', () => {
    it('should render awards with year', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('Spiel des Jahres (2020)')).toBeInTheDocument();
    });

    it('should render awards without year', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('Best Family Game')).toBeInTheDocument();
    });

    it('should not render awards section when no awards', () => {
      const gameWithoutAwards = { ...mockGame, awards: [] };
      render(<GameDetailModal game={gameWithoutAwards} onClose={mockOnClose} />);
      
      expect(screen.queryByText('Prix')).not.toBeInTheDocument();
    });

    it('should not render awards section when awards is undefined', () => {
      const gameWithoutAwards = { ...mockGame, awards: undefined };
      render(<GameDetailModal game={gameWithoutAwards} onClose={mockOnClose} />);
      
      expect(screen.queryByText('Prix')).not.toBeInTheDocument();
    });
  });

  describe('Categories and Mechanics', () => {
    it('should render categories', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('Strategy')).toBeInTheDocument();
      expect(screen.getByText('Family')).toBeInTheDocument();
    });

    it('should render mechanics', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('Dice Rolling')).toBeInTheDocument();
      expect(screen.getByText('Set Collection')).toBeInTheDocument();
    });

    it('should not render categories section when empty', () => {
      const gameWithoutCategories = { ...mockGame, categories: [] };
      render(<GameDetailModal game={gameWithoutCategories} onClose={mockOnClose} />);
      
      expect(screen.queryByText('Catégories')).not.toBeInTheDocument();
    });

    it('should not render mechanics section when empty', () => {
      const gameWithoutMechanics = { ...mockGame, mechanics: [] };
      render(<GameDetailModal game={gameWithoutMechanics} onClose={mockOnClose} />);
      
      expect(screen.queryByText('Mécaniques')).not.toBeInTheDocument();
    });
  });

  describe('Favorite badge', () => {
    it('should render favorite badge when game is favorite', () => {
      const favoriteGame = { ...mockGame, favorite: true };
      render(<GameDetailModal game={favoriteGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('❤️ Favori')).toBeInTheDocument();
    });

    it('should not render favorite badge when game is not favorite', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      expect(screen.queryByText('❤️ Favori')).not.toBeInTheDocument();
    });
  });

  describe('Close behavior', () => {
    it('should call onClose when close button is clicked', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      // There are two close buttons: X button (aria-label) and bottom button
      const closeButtons = screen.getAllByRole('button', { name: 'Fermer' });
      fireEvent.click(closeButtons[0]);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when clicking outside modal', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      // Click on the backdrop (the outer div)
      const backdrop = document.querySelector('.fixed.inset-0');
      fireEvent.click(backdrop);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when pressing Escape key', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when pressing other keys', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      fireEvent.keyDown(document, { key: 'Enter' });
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Dark mode support', () => {
    it('should use bg-card class for modal container (supports dark mode)', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      const modalContainer = document.querySelector('.bg-card');
      expect(modalContainer).toBeInTheDocument();
      expect(modalContainer).toHaveClass('rounded-modal');
    });

    it('should use bg-card class for close button (supports dark mode)', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      // The X button has aria-label="Fermer" and bg-card/80 class
      // It's the first button (the X icon button in the top right)
      const xButton = document.querySelector('button.bg-card\\/80');
      expect(xButton).toBeInTheDocument();
    });

    it('should use bg-card class for favorite badge (supports dark mode)', () => {
      const favoriteGame = { ...mockGame, favorite: true };
      render(<GameDetailModal game={favoriteGame} onClose={mockOnClose} />);
      
      const favoriteBadge = screen.getByText('❤️ Favori');
      expect(favoriteBadge).toHaveClass('bg-card/90');
    });

    it('should use text-text-primary for title (supports dark mode)', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      const title = screen.getByText('Test Game');
      expect(title).toHaveClass('text-text-primary');
    });

    it('should use text-text-secondary for secondary text (supports dark mode)', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      // The text-text-secondary class is on the grandparent container
      const quickInfoContainer = document.querySelector('.text-text-secondary');
      expect(quickInfoContainer).toBeInTheDocument();
    });

    it('should use border-border for divider (supports dark mode)', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      const divider = document.querySelector('.border-t.border-border');
      expect(divider).toBeInTheDocument();
    });

    it('should use chip class for categories (supports dark mode via CSS)', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      const categoryChip = screen.getByText('Strategy');
      expect(categoryChip).toHaveClass('chip');
    });
  });

  describe('Image handling', () => {
    it('should pass first image id to GameImage', () => {
      render(<GameDetailModal game={mockGame} onClose={mockOnClose} />);
      
      const gameImage = screen.getByTestId('game-image');
      expect(gameImage).toHaveAttribute('data-image-id', 'test-img');
    });

    it('should pass null when no images', () => {
      const gameWithoutImages = { ...mockGame, images: [] };
      render(<GameDetailModal game={gameWithoutImages} onClose={mockOnClose} />);
      
      const gameImage = screen.getByTestId('game-image');
      // When imageId is null, the attribute value is null in DOM
      expect(gameImage.getAttribute('data-image-id')).toBeNull();
    });

    it('should pass null when images is undefined', () => {
      const gameWithoutImages = { ...mockGame, images: undefined };
      render(<GameDetailModal game={gameWithoutImages} onClose={mockOnClose} />);
      
      const gameImage = screen.getByTestId('game-image');
      // When imageId is null, the attribute value is null in DOM
      expect(gameImage.getAttribute('data-image-id')).toBeNull();
    });
  });

  describe('Duration labels', () => {
    it('should display SHORT duration label', () => {
      const shortGame = { ...mockGame, playDuration: PlayDuration.SHORT };
      render(<GameDetailModal game={shortGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('Court (< 30 min)')).toBeInTheDocument();
    });

    it('should display LONG duration label', () => {
      const longGame = { ...mockGame, playDuration: PlayDuration.LONG };
      render(<GameDetailModal game={longGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('Long (> 60 min)')).toBeInTheDocument();
    });
  });

  describe('Complexity labels', () => {
    it('should display MEDIUM complexity label', () => {
      const mediumComplexityGame = { ...mockGame, firstPlayComplexity: FirstPlayComplexity.MEDIUM };
      render(<GameDetailModal game={mediumComplexityGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('Complexité: Moyenne')).toBeInTheDocument();
    });

    it('should display HIGH complexity label', () => {
      const highComplexityGame = { ...mockGame, firstPlayComplexity: FirstPlayComplexity.HIGH };
      render(<GameDetailModal game={highComplexityGame} onClose={mockOnClose} />);
      
      expect(screen.getByText('Complexité: Complexe')).toBeInTheDocument();
    });
  });
});