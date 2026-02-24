/**
 * Tests for GameCard Component
 * 
 * Tests the common GameCard component used in both visitor and admin views
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameCard, { 
  VisitorGameCard, 
  AdminGameCard, 
  GameImage,
  ActionBand 
} from '../../../src/components/common/GameCard';
import { PlayDuration } from '../../../src/domain/Game';

describe('GameCard Components', () => {
  const mockGameCard = {
    id: 'test-game',
    title: 'Test Game',
    playerCount: '2-4 joueurs',
    playDuration: PlayDuration.MEDIUM,
    hasAwards: true,
    isFavorite: false,
    isArchived: false,
    primaryImage: { id: 'test-img', source: 'publisher' },
  };

  describe('GameImage', () => {
    it('should render image when imageId is provided', () => {
      render(<GameImage imageId="test-img" title="Test Game" />);
      
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('alt', 'Test Game');
      expect(image).toHaveAttribute('src', '/images/test-img.jpg');
    });

    it('should render placeholder when imageId is null', () => {
      render(<GameImage imageId={null} title="Test Game" />);
      
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.getByText("Pas d'image")).toBeInTheDocument();
    });

    it('should render placeholder when imageId is undefined', () => {
      render(<GameImage imageId={undefined} title="Test Game" />);
      
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.getByText("Pas d'image")).toBeInTheDocument();
    });
  });

  describe('VisitorGameCard', () => {
    it('should render game title', () => {
      render(<VisitorGameCard game={mockGameCard} />);
      
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });

    it('should render player count in info band', () => {
      render(<VisitorGameCard game={mockGameCard} />);
      
      // Player count is displayed without "joueurs"
      expect(screen.getByText('2-4')).toBeInTheDocument();
    });

    it('should render award trophy when game has awards', () => {
      render(<VisitorGameCard game={mockGameCard} />);
      
      const trophy = screen.getByTitle('Primé');
      expect(trophy).toBeInTheDocument();
    });

    it('should not show visible trophy when game has no awards', () => {
      const gameWithoutAwards = { ...mockGameCard, hasAwards: false };
      render(<VisitorGameCard game={gameWithoutAwards} />);
      
      // Trophy should be invisible but still in DOM for layout
      const trophies = screen.getAllByText('🏆');
      expect(trophies[0]).toHaveClass('invisible');
    });

    it('should render favorite heart when game is favorite', () => {
      const favoriteGame = { ...mockGameCard, isFavorite: true };
      render(<VisitorGameCard game={favoriteGame} />);
      
      const heart = screen.getByTitle('Favori');
      expect(heart).toBeInTheDocument();
    });

    it('should not show visible heart when game is not favorite', () => {
      render(<VisitorGameCard game={mockGameCard} />);
      
      // Heart should be invisible but still in DOM for layout
      const hearts = screen.getAllByText('❤️');
      expect(hearts[0]).toHaveClass('invisible');
    });

    it('should call onClick when clicked', () => {
      const mockOnClick = jest.fn();
      render(<VisitorGameCard game={mockGameCard} onClick={mockOnClick} />);
      
      const article = screen.getByRole('article');
      fireEvent.click(article);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith('test-game');
    });

    it('should not have cursor-pointer when onClick is not provided', () => {
      render(<VisitorGameCard game={mockGameCard} />);
      
      const article = screen.getByRole('article');
      expect(article).not.toHaveClass('cursor-pointer');
    });

    it('should render image from primaryImage.id', () => {
      render(<VisitorGameCard game={mockGameCard} />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/images/test-img.jpg');
    });

    it('should render image from primaryImage string', () => {
      const gameWithStringImage = { ...mockGameCard, primaryImage: 'string-img-id' };
      render(<VisitorGameCard game={gameWithStringImage} />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/images/string-img-id.jpg');
    });
  });

  describe('AdminGameCard', () => {
    it('should render game title', () => {
      render(<AdminGameCard game={mockGameCard} />);
      
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });

    it('should render children in action band', () => {
      render(
        <AdminGameCard game={mockGameCard}>
          <button>Edit</button>
          <button>Archive</button>
        </AdminGameCard>
      );
      
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Archive' })).toBeInTheDocument();
    });

    it('should show reduced opacity when game is archived', () => {
      const archivedGame = { ...mockGameCard, isArchived: true };
      render(<AdminGameCard game={archivedGame} />);
      
      const article = screen.getByRole('article');
      expect(article).toHaveClass('opacity-60');
    });

    it('should not have reduced opacity when game is not archived', () => {
      render(<AdminGameCard game={mockGameCard} />);
      
      const article = screen.getByRole('article');
      expect(article).not.toHaveClass('opacity-60');
    });
  });

  describe('ActionBand', () => {
    it('should render children', () => {
      render(
        <ActionBand>
          <button>Action 1</button>
          <button>Action 2</button>
        </ActionBand>
      );
      
      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
    });
  });

  describe('Default GameCard export', () => {
    it('should render VisitorGameCard by default', () => {
      render(<GameCard game={mockGameCard} />);
      
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });

    it('should pass onClick to VisitorGameCard', () => {
      const mockOnClick = jest.fn();
      render(<GameCard game={mockGameCard} onClick={mockOnClick} />);
      
      const article = screen.getByRole('article');
      fireEvent.click(article);
      
      expect(mockOnClick).toHaveBeenCalledWith('test-game');
    });
  });

  describe('PlayDuration display', () => {
    it('should display 1 hourglass for SHORT duration', () => {
      const shortGame = { ...mockGameCard, playDuration: PlayDuration.SHORT };
      render(<VisitorGameCard game={shortGame} />);
      
      // Check that hourglass emoji appears once
      const hourglasses = screen.getAllByText('⏳');
      expect(hourglasses).toHaveLength(1);
    });

    it('should display 2 hourglasses for MEDIUM duration', () => {
      const mediumGame = { ...mockGameCard, playDuration: PlayDuration.MEDIUM };
      render(<VisitorGameCard game={mediumGame} />);
      
      const hourglasses = screen.getAllByText('⏳');
      expect(hourglasses).toHaveLength(2);
    });

    it('should display 3 hourglasses for LONG duration', () => {
      const longGame = { ...mockGameCard, playDuration: PlayDuration.LONG };
      render(<VisitorGameCard game={longGame} />);
      
      const hourglasses = screen.getAllByText('⏳');
      expect(hourglasses).toHaveLength(3);
    });
  });

  describe('Player count formatting', () => {
    it('should display player range without "joueurs"', () => {
      const game = { ...mockGameCard, playerCount: '3-5 joueurs' };
      render(<VisitorGameCard game={game} />);
      
      expect(screen.getByText('3-5')).toBeInTheDocument();
    });

    it('should handle single player count', () => {
      const game = { ...mockGameCard, playerCount: '2 joueurs' };
      render(<VisitorGameCard game={game} />);
      
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });
});