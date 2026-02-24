/**
 * Tests for AdminGameGrid component
 */

import { render, screen } from '@testing-library/react';
import AdminGameGrid from '@/components/admin/AdminGameGrid';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/admin',
  }),
}));

describe('AdminGameGrid', () => {
  const mockGames = [
    {
      id: 'game-1',
      title: 'Active Game',
      isArchived: false,
      isFavorite: false,
      imageUrl: '/images/game1.jpg',
    },
    {
      id: 'game-2',
      title: 'Archived Game',
      isArchived: true,
      isFavorite: true,
      imageUrl: '/images/game2.jpg',
    },
  ];

  const defaultProps = {
    onToggleFavorite: jest.fn(),
    onArchive: jest.fn(),
    onRestore: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('renders games in grid view by default', () => {
      render(<AdminGameGrid games={mockGames} {...defaultProps} />);
      
      expect(screen.getByText('Active Game')).toBeInTheDocument();
      expect(screen.getByText('Archived Game')).toBeInTheDocument();
    });

    it('renders games in list view when viewMode is list', () => {
      render(<AdminGameGrid games={mockGames} {...defaultProps} viewMode="list" />);
      
      expect(screen.getByText('Active Game')).toBeInTheDocument();
      expect(screen.getByText('Archived Game')).toBeInTheDocument();
    });

    it('shows empty message when no games', () => {
      render(<AdminGameGrid games={[]} {...defaultProps} />);
      
      expect(screen.getByText('Aucun jeu trouvé.')).toBeInTheDocument();
    });

    it('shows custom empty message when provided', () => {
      render(<AdminGameGrid games={[]} {...defaultProps} emptyMessage="Custom empty message" />);
      
      expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    });
  });

  describe('Section title', () => {
    it('does not render title when not provided', () => {
      render(<AdminGameGrid games={mockGames} {...defaultProps} />);
      
      expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });

    it('renders title when provided', () => {
      render(<AdminGameGrid games={mockGames} {...defaultProps} title="Jeux actifs" />);
      
      expect(screen.getByRole('heading', { name: 'Jeux actifs', level: 2 })).toBeInTheDocument();
    });

    it('renders archived section title', () => {
      render(<AdminGameGrid games={mockGames} {...defaultProps} title="Jeux archivés" />);
      
      expect(screen.getByRole('heading', { name: 'Jeux archivés', level: 2 })).toBeInTheDocument();
    });
  });

  describe('Action buttons', () => {
    it('renders edit button for each game', () => {
      render(<AdminGameGrid games={mockGames} {...defaultProps} />);
      
      const editButtons = screen.getAllByTitle('Modifier');
      expect(editButtons).toHaveLength(2);
    });

    it('renders archive button for active games', () => {
      render(<AdminGameGrid games={[mockGames[0]]} {...defaultProps} />);
      
      expect(screen.getByTitle('Archiver')).toBeInTheDocument();
    });

    it('renders restore button for archived games', () => {
      render(<AdminGameGrid games={[mockGames[1]]} {...defaultProps} />);
      
      expect(screen.getByTitle('Restaurer')).toBeInTheDocument();
    });

    it('renders favorite button for each game', () => {
      render(<AdminGameGrid games={mockGames} {...defaultProps} />);
      
      const favoriteButtons = screen.getAllByTitle(/favoris/);
      expect(favoriteButtons).toHaveLength(2);
    });
  });

  describe('Grid structure', () => {
    it('renders grid container with correct classes', () => {
      const { container } = render(<AdminGameGrid games={mockGames} {...defaultProps} />);
      
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass('grid-cols-2');
    });

    it('renders list container in list view', () => {
      const { container } = render(<AdminGameGrid games={mockGames} {...defaultProps} viewMode="list" />);
      
      const list = container.querySelector('.flex.flex-col.gap-2');
      expect(list).toBeInTheDocument();
    });
  });
});