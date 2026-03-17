/**
 * Tests for AdminGameGrid component
 */

import { render, screen, fireEvent } from '@testing-library/react';
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

    it('renders title with larger font and bold when provided', () => {
      render(<AdminGameGrid games={mockGames} {...defaultProps} title="Jeux archivés" />);
      
      const title = screen.getByRole('heading', { name: 'Jeux archivés', level: 2 });
      expect(title).toHaveClass('text-page-title');
      expect(title).toHaveClass('font-semibold');
    });
  });

  describe('Collapsible section', () => {
    it('does not collapse when collapsible is false', () => {
      render(<AdminGameGrid games={mockGames} {...defaultProps} title="Jeux archivés" collapsible={false} />);
      
      // Content should be visible
      expect(screen.getByText('Active Game')).toBeInTheDocument();
      expect(screen.getByText('Archived Game')).toBeInTheDocument();
    });

    it('collapses by default when collapsible is true and defaultCollapsed is true', () => {
      render(<AdminGameGrid games={mockGames} {...defaultProps} title="Jeux archivés" collapsible={true} defaultCollapsed={true} />);
      
      // Content should be hidden
      expect(screen.queryByText('Active Game')).not.toBeInTheDocument();
      expect(screen.queryByText('Archived Game')).not.toBeInTheDocument();
    });

    it('expands by default when collapsible is true and defaultCollapsed is false', () => {
      render(<AdminGameGrid games={mockGames} {...defaultProps} title="Jeux archivés" collapsible={true} defaultCollapsed={false} />);
      
      // Content should be visible
      expect(screen.getByText('Active Game')).toBeInTheDocument();
      expect(screen.getByText('Archived Game')).toBeInTheDocument();
    });

    it('toggles collapse when clicking on title', () => {
      render(<AdminGameGrid games={mockGames} {...defaultProps} title="Jeux archivés" collapsible={true} defaultCollapsed={true} />);
      
      // Initially collapsed
      expect(screen.queryByText('Active Game')).not.toBeInTheDocument();
      
      // Click to expand
      fireEvent.click(screen.getByRole('heading', { name: /Jeux archivés/ }));
      
      // Now expanded
      expect(screen.getByText('Active Game')).toBeInTheDocument();
      expect(screen.getByText('Archived Game')).toBeInTheDocument();
      
      // Click to collapse again
      fireEvent.click(screen.getByRole('heading', { name: /Jeux archivés/ }));
      
      // Now collapsed again
      expect(screen.queryByText('Active Game')).not.toBeInTheDocument();
    });

    it('shows chevron icon when collapsible', () => {
      const { container } = render(<AdminGameGrid games={mockGames} {...defaultProps} title="Jeux archivés" collapsible={true} />);
      
      // Chevron has specific path for "M19 9l-7 7-7-7"
      const svgs = container.querySelectorAll('svg');
      const chevron = Array.from(svgs).find(svg => 
        svg.innerHTML.includes('M19 9l-7 7-7-7')
      );
      expect(chevron).toBeInTheDocument();
    });

    it('does not show chevron icon when not collapsible', () => {
      const { container } = render(<AdminGameGrid games={mockGames} {...defaultProps} title="Jeux actifs" collapsible={false} />);
      
      // Chevron has specific path for "M19 9l-7 7-7-7"
      const svgs = container.querySelectorAll('svg');
      const chevron = Array.from(svgs).find(svg => 
        svg.innerHTML.includes('M19 9l-7 7-7-7')
      );
      expect(chevron).toBeUndefined();
    });

    it('shows game count when collapsible', () => {
      render(<AdminGameGrid games={mockGames} {...defaultProps} title="Jeux archivés" collapsible={true} />);
      
      expect(screen.getByText('(2)')).toBeInTheDocument();
    });
  });

  describe('Action buttons', () => {
    it('renders edit button for active games only', () => {
      render(<AdminGameGrid games={mockGames} {...defaultProps} />);
      
      // Only 1 edit button for the active game (not for archived)
      const editButtons = screen.getAllByTitle('Modifier');
      expect(editButtons).toHaveLength(1);
    });

    it('does not render edit button for archived games', () => {
      render(<AdminGameGrid games={[mockGames[1]]} {...defaultProps} />);
      
      expect(screen.queryByTitle('Modifier')).not.toBeInTheDocument();
    });

    it('renders archive button for active games', () => {
      render(<AdminGameGrid games={[mockGames[0]]} {...defaultProps} />);
      
      expect(screen.getByTitle('Archiver')).toBeInTheDocument();
    });

    it('renders restore button for archived games', () => {
      render(<AdminGameGrid games={[mockGames[1]]} {...defaultProps} />);
      
      expect(screen.getByTitle('Restaurer')).toBeInTheDocument();
    });

    it('renders favorite button for active games only', () => {
      render(<AdminGameGrid games={mockGames} {...defaultProps} />);
      
      // Only 1 favorite button for the active game (not for archived)
      const favoriteButtons = screen.getAllByTitle(/favoris/);
      expect(favoriteButtons).toHaveLength(1);
    });

    it('renders delete button for archived games instead of favorite', () => {
      render(<AdminGameGrid games={[mockGames[1]]} {...defaultProps} />);
      
      expect(screen.getByTitle('Supprimer')).toBeInTheDocument();
      expect(screen.queryByTitle(/favoris/)).not.toBeInTheDocument();
    });

    it('calls onDelete when delete button is clicked on archived game', () => {
      const onDelete = jest.fn();
      render(<AdminGameGrid games={[mockGames[1]]} {...defaultProps} onDelete={onDelete} />);
      
      fireEvent.click(screen.getByTitle('Supprimer'));
      
      expect(onDelete).toHaveBeenCalledWith('game-2');
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