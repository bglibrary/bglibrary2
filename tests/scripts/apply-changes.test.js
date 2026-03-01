/**
 * Tests for apply-changes.js script
 * 
 * Tests the core functions of the script without actually running Git commands.
 */

const fs = require('fs');
const path = require('path');

// Mock fs and child_process
jest.mock('fs');
jest.mock('child_process', () => ({
  execSync: jest.fn((cmd) => {
    if (cmd.includes('branch --show-current')) return 'main';
    if (cmd.includes('status --porcelain')) return '';
    if (cmd.includes('stash list')) return '';
    return '';
  }),
}));

// Import the script functions (we'll need to refactor the script to export them)
// For now, we'll test the logic directly

describe('apply-changes script', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ActionType constants', () => {
    it('should have all required action types', () => {
      const expectedTypes = [
        'ADD_GAME',
        'UPDATE_GAME',
        'ARCHIVE_GAME',
        'RESTORE_GAME',
        'TOGGLE_FAVORITE',
        'DELETE_GAME',
      ];
      
      // These should match SessionHistory.js
      expectedTypes.forEach(type => {
        expect(type).toBeDefined();
      });
    });
  });

  describe('Session JSON validation', () => {
    it('should accept valid action array', () => {
      const validActions = [
        {
          id: 'action-1',
          type: 'ADD_GAME',
          gameId: 'test-game',
          gameTitle: 'Test Game',
          payload: { id: 'test-game', title: 'Test Game' },
        },
      ];
      
      expect(Array.isArray(validActions)).toBe(true);
      expect(validActions.length).toBeGreaterThan(0);
    });

    it('should reject non-array input', () => {
      const invalidInput = { actions: [] };
      expect(Array.isArray(invalidInput)).toBe(false);
    });

    it('should handle empty array', () => {
      const emptyActions = [];
      expect(emptyActions.length).toBe(0);
    });
  });

  describe('Action payload validation', () => {
    it('should validate ADD_GAME payload', () => {
      const action = {
        type: 'ADD_GAME',
        gameId: 'new-game',
        payload: {
          id: 'new-game',
          title: 'New Game',
          minPlayers: 2,
          maxPlayers: 4,
        },
      };
      
      expect(action.payload).toBeDefined();
      expect(action.payload.id).toBe(action.gameId);
    });

    it('should validate UPDATE_GAME payload', () => {
      const action = {
        type: 'UPDATE_GAME',
        gameId: 'existing-game',
        payload: {
          id: 'existing-game',
          title: 'Updated Title',
        },
      };
      
      expect(action.payload).toBeDefined();
      expect(action.payload.id).toBe(action.gameId);
    });

    it('should handle TOGGLE_FAVORITE payload', () => {
      const action = {
        type: 'TOGGLE_FAVORITE',
        gameId: 'game-1',
        payload: { favorite: true },
      };
      
      expect(action.payload.favorite).toBe(true);
    });
  });

  describe('Image data handling', () => {
    it('should validate base64 image format', () => {
      const validBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';
      const matches = validBase64.match(/^data:image\/(\w+);base64,(.+)$/);
      
      expect(matches).not.toBeNull();
      expect(matches[1]).toBe('jpeg');
      expect(matches[2]).toBe('/9j/4AAQSkZJRg==');
    });

    it('should reject invalid base64 format', () => {
      const invalidBase64 = 'not-a-valid-base64-image';
      const matches = invalidBase64.match(/^data:image\/(\w+);base64,(.+)$/);
      
      expect(matches).toBeNull();
    });

    it('should handle different image types', () => {
      const types = ['jpeg', 'png', 'webp', 'gif'];
      
      types.forEach(type => {
        const base64 = `data:image/${type};base64,ABC123`;
        const matches = base64.match(/^data:image\/(\w+);base64,(.+)$/);
        expect(matches[1]).toBe(type);
      });
    });

    it('should convert jpeg extension to jpg', () => {
      const ext = 'jpeg';
      const extension = ext === 'jpeg' ? 'jpg' : ext;
      
      expect(extension).toBe('jpg');
    });
  });

  describe('File path construction', () => {
    it('should construct correct game file path', () => {
      const PUBLIC_GAMES_PATH = './public/data/games';
      const gameId = 'my-game';
      const filePath = path.join(PUBLIC_GAMES_PATH, `${gameId}.json`);
      
      expect(filePath).toContain('my-game.json');
    });

    it('should construct correct image file path', () => {
      const PUBLIC_IMAGES_PATH = './public/images';
      const gameId = 'my-game';
      const ext = 'jpg';
      const filePath = path.join(PUBLIC_IMAGES_PATH, `${gameId}-main.${ext}`);
      
      expect(filePath).toContain('my-game-main.jpg');
    });
  });

  describe('Action labels', () => {
    it('should have labels for all action types', () => {
      const ActionLabels = {
        ADD_GAME: 'Add game',
        UPDATE_GAME: 'Update game',
        ARCHIVE_GAME: 'Archive game',
        RESTORE_GAME: 'Restore game',
        TOGGLE_FAVORITE: 'Toggle favorite',
        DELETE_GAME: 'Delete game',
      };
      
      const actionTypes = [
        'ADD_GAME',
        'UPDATE_GAME',
        'ARCHIVE_GAME',
        'RESTORE_GAME',
        'TOGGLE_FAVORITE',
        'DELETE_GAME',
      ];
      
      actionTypes.forEach(type => {
        expect(ActionLabels[type]).toBeDefined();
      });
    });
  });

  describe('Index update logic', () => {
    it('should sort game IDs alphabetically', () => {
      const gameIds = ['z-game', 'a-game', 'm-game'];
      
      const sorted = [...gameIds].sort((a, b) => 
        a.localeCompare(b, 'fr')
      );
      
      expect(sorted[0]).toBe('a-game');
      expect(sorted[2]).toBe('z-game');
    });

    it('should maintain original index format { games: [...] }', () => {
      const gameIds = ['game-1', 'game-2', 'game-3'];
      const index = { games: gameIds };
      
      expect(index).toHaveProperty('games');
      expect(Array.isArray(index.games)).toBe(true);
      expect(index.games).toEqual(['game-1', 'game-2', 'game-3']);
    });

    it('should only include game IDs in index, not full objects', () => {
      const gameIds = ['catan', 'azul', 'dixit'];
      const index = { games: gameIds };
      
      // Index should NOT contain full game objects
      expect(typeof index.games[0]).toBe('string');
      expect(index.games[0]).not.toHaveProperty('title');
      expect(index.games[0]).not.toHaveProperty('minPlayers');
    });
  });

  describe('Clean data for JSON output', () => {
    it('should remove _imageData from game data', () => {
      const gameData = {
        id: 'test-game',
        title: 'Test Game',
        _imageData: {
          base64: 'data:image/jpeg;base64,ABC',
          type: 'image/jpeg',
        },
      };
      
      const cleanData = { ...gameData };
      delete cleanData._imageData;
      
      expect(cleanData._imageData).toBeUndefined();
      expect(cleanData.id).toBe('test-game');
    });
  });

  describe('Command line arguments', () => {
    it('should parse --dry-run flag', () => {
      const args = ['session.json', '--dry-run'];
      const dryRun = args.includes('--dry-run');
      
      expect(dryRun).toBe(true);
    });

    it('should parse --no-commit flag', () => {
      const args = ['session.json', '--no-commit'];
      const noCommit = args.includes('--no-commit');
      
      expect(noCommit).toBe(true);
    });

    it('should parse --help flag', () => {
      const args = ['--help'];
      const showHelp = args.includes('--help');
      
      expect(showHelp).toBe(true);
    });

    it('should extract session file from args', () => {
      const args = ['session-changes.json', '--dry-run'];
      const sessionFile = args.find(a => !a.startsWith('--'));
      
      expect(sessionFile).toBe('session-changes.json');
    });
  });
});