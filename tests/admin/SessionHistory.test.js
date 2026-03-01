/**
 * Tests for SessionHistory
 * 
 * As specified in specs/phase_8_implementation_plan.md
 */

import { SessionHistory, ActionType, getSessionHistory, resetSessionHistory } from '../../src/admin/SessionHistory';

describe('SessionHistory', () => {
  let history;

  beforeEach(() => {
    history = new SessionHistory();
  });

  describe('constructor', () => {
    it('should initialize with empty actions', () => {
      expect(history.getActions()).toHaveLength(0);
      expect(history.getCount()).toBe(0);
      expect(history.hasChanges()).toBe(false);
    });
  });

  describe('addAction', () => {
    it('should add an action and return result object', () => {
      const result = history.addAction(
        ActionType.ADD_GAME,
        'test-game',
        'Test Game',
        { title: 'Test Game' }
      );
      
      expect(result.index).toBe(0);
      expect(result.action).toBe('added');
      expect(history.getCount()).toBe(1);
      expect(history.hasChanges()).toBe(true);
    });

    it('should create action with correct structure', () => {
      history.addAction(
        ActionType.TOGGLE_FAVORITE,
        'catan',
        'Catan',
        { favorite: true }
      );
      
      const actions = history.getActions();
      expect(actions[0]).toHaveProperty('id');
      expect(actions[0].type).toBe(ActionType.TOGGLE_FAVORITE);
      expect(actions[0].gameId).toBe('catan');
      expect(actions[0].gameTitle).toBe('Catan');
      expect(actions[0].payload).toEqual({ favorite: true });
      expect(actions[0].summary).toBe('Favori: Catan');
      expect(actions[0]).toHaveProperty('timestamp');
    });

    it('should generate correct summary for each action type', () => {
      history.addAction(ActionType.ADD_GAME, 'g1', 'Game 1', { title: 'Game 1' });
      history.addAction(ActionType.UPDATE_GAME, 'g2', 'Game 2', { title: 'Game 2' });
      history.addAction(ActionType.ARCHIVE_GAME, 'g3', 'Game 3', null);
      history.addAction(ActionType.RESTORE_GAME, 'g4', 'Game 4', null);
      history.addAction(ActionType.TOGGLE_FAVORITE, 'g5', 'Game 5', { favorite: false });
      history.addAction(ActionType.DELETE_GAME, 'g6', 'Game 6', null);

      const actions = history.getActions();
      expect(actions[0].summary).toBe('Ajouter: Game 1');
      expect(actions[1].summary).toBe('Modifier: Game 2');
      expect(actions[2].summary).toBe('Archiver: Game 3');
      expect(actions[3].summary).toBe('Restaurer: Game 4');
      expect(actions[4].summary).toBe('Non favori: Game 5');
      expect(actions[5].summary).toBe('Supprimer: Game 6');
    });

    it('should remove existing toggle favorite when toggling again', () => {
      // First toggle
      history.addAction(ActionType.TOGGLE_FAVORITE, 'game-a', 'Game A', { favorite: true });
      expect(history.getCount()).toBe(1);
      
      // Second toggle (should remove the first)
      const result = history.addAction(ActionType.TOGGLE_FAVORITE, 'game-a', 'Game A', { favorite: false });
      expect(result.action).toBe('removed');
      expect(history.getCount()).toBe(0);
    });

    it('should remove opposite archive/restore action', () => {
      // Archive
      history.addAction(ActionType.ARCHIVE_GAME, 'game-a', 'Game A', null);
      expect(history.getCount()).toBe(1);
      
      // Restore (should remove the archive action)
      const result = history.addAction(ActionType.RESTORE_GAME, 'game-a', 'Game A', null);
      expect(result.action).toBe('removed');
      expect(history.getCount()).toBe(0);
    });
  });

  describe('removeAction', () => {
    it('should remove action by index', () => {
      history.addAction(ActionType.ADD_GAME, 'g1', 'Game 1', null);
      history.addAction(ActionType.ADD_GAME, 'g2', 'Game 2', null);
      
      const result = history.removeAction(0);
      
      expect(result).toBe(true);
      expect(history.getCount()).toBe(1);
      expect(history.getActions()[0].gameId).toBe('g2');
    });

    it('should return false for invalid index', () => {
      history.addAction(ActionType.ADD_GAME, 'g1', 'Game 1', null);
      
      expect(history.removeAction(-1)).toBe(false);
      expect(history.removeAction(5)).toBe(false);
      expect(history.getCount()).toBe(1);
    });
  });

  describe('editAction', () => {
    it('should edit payload of ADD_GAME action', () => {
      history.addAction(ActionType.ADD_GAME, 'g1', 'Game 1', { title: 'Game 1' });
      
      const result = history.editAction(0, { title: 'Updated Game 1' });
      
      expect(result).toBe(true);
      expect(history.getActions()[0].payload.title).toBe('Updated Game 1');
    });

    it('should edit payload of UPDATE_GAME action', () => {
      history.addAction(ActionType.UPDATE_GAME, 'g1', 'Game 1', { title: 'Game 1' });
      
      const result = history.editAction(0, { title: 'Updated Game 1' });
      
      expect(result).toBe(true);
      expect(history.getActions()[0].payload.title).toBe('Updated Game 1');
    });

    it('should not allow editing other action types', () => {
      history.addAction(ActionType.ARCHIVE_GAME, 'g1', 'Game 1', null);
      
      const result = history.editAction(0, { some: 'data' });
      
      expect(result).toBe(false);
    });

    it('should return false for invalid index', () => {
      expect(history.editAction(0, {})).toBe(false);
    });
  });

  describe('clearAll', () => {
    it('should remove all actions', () => {
      history.addAction(ActionType.ADD_GAME, 'g1', 'Game 1', null);
      history.addAction(ActionType.ADD_GAME, 'g2', 'Game 2', null);
      
      history.clearAll();
      
      expect(history.getCount()).toBe(0);
      expect(history.hasChanges()).toBe(false);
    });
  });

  describe('getActionsForGame', () => {
    it('should return all actions for a specific game', () => {
      history.addAction(ActionType.ADD_GAME, 'game-a', 'Game A', null);
      history.addAction(ActionType.ADD_GAME, 'game-b', 'Game B', null);
      history.addAction(ActionType.TOGGLE_FAVORITE, 'game-a', 'Game A', { favorite: true });
      
      const gameAActions = history.getActionsForGame('game-a');
      
      expect(gameAActions).toHaveLength(2);
      expect(gameAActions[0].type).toBe(ActionType.ADD_GAME);
      expect(gameAActions[1].type).toBe(ActionType.TOGGLE_FAVORITE);
    });

    it('should return empty array for unknown game', () => {
      history.addAction(ActionType.ADD_GAME, 'game-a', 'Game A', null);
      
      const result = history.getActionsForGame('unknown');
      
      expect(result).toHaveLength(0);
    });
  });

  describe('hasPendingChanges', () => {
    it('should return true if game has pending changes', () => {
      history.addAction(ActionType.ADD_GAME, 'game-a', 'Game A', null);
      
      expect(history.hasPendingChanges('game-a')).toBe(true);
      expect(history.hasPendingChanges('game-b')).toBe(false);
    });
  });

  describe('generatePythonScript', () => {
    it('should generate valid Python script', () => {
      history.addAction(ActionType.ADD_GAME, 'new-game', 'New Game', {
        id: 'new-game',
        title: 'New Game',
      });
      history.addAction(ActionType.TOGGLE_FAVORITE, 'catan', 'Catan', { favorite: true });
      
      const script = history.generatePythonScript();
      
      expect(script).toContain('#!/usr/bin/env python3');
      expect(script).toContain('Board Game Library Update Script');
      expect(script).toContain('ADD_GAME');
      expect(script).toContain('TOGGLE_FAVORITE');
      expect(script).toContain('new-game');
      expect(script).toContain('catan');
    });

    it('should include action count in script', () => {
      history.addAction(ActionType.ADD_GAME, 'g1', 'Game 1', {});
      history.addAction(ActionType.ADD_GAME, 'g2', 'Game 2', {});
      
      const script = history.generatePythonScript();
      
      expect(script).toContain('Total Actions: 2');
    });

    it('should include branch creation functions', () => {
      history.addAction(ActionType.ADD_GAME, 'g1', 'Game 1', {});
      
      const script = history.generatePythonScript();
      
      expect(script).toContain('def create_session_branch()');
      expect(script).toContain('def get_current_branch()');
      expect(script).toContain('BRANCH_PREFIX = "admin-session"');
    });

    it('should include user confirmation functions', () => {
      history.addAction(ActionType.ADD_GAME, 'g1', 'Game 1', {});
      
      const script = history.generatePythonScript();
      
      expect(script).toContain('def ask_confirmation(prompt, default=');
      expect(script).toContain("if response in ['y', 'yes', 'o', 'oui']:");
    });

    it('should include workflow steps in docstring', () => {
      history.addAction(ActionType.ADD_GAME, 'g1', 'Game 1', {});
      
      const script = history.generatePythonScript();
      
      expect(script).toContain('1. Creates a new branch for the changes');
      expect(script).toContain('2. Applies all pending actions (one commit per action)');
      expect(script).toContain('3. Asks for validation before rebasing on main');
      expect(script).toContain('4. Asks for validation before merging on main');
    });

    it('should include rebase and merge logic with confirmations', () => {
      history.addAction(ActionType.ADD_GAME, 'g1', 'Game 1', {});
      
      const script = history.generatePythonScript();
      
      expect(script).toContain('ask_confirmation("Rebase on main?")');
      expect(script).toContain('ask_confirmation("Push to remote?")');
      expect(script).toContain("git merge {session_branch}");
    });

    it('should use correct games directory path', () => {
      history.addAction(ActionType.ADD_GAME, 'g1', 'Game 1', {});
      
      const script = history.generatePythonScript();
      
      expect(script).toContain('GAMES_DIR = Path("public/data/games")');
      expect(script).toContain('INDEX_FILE = GAMES_DIR / "index.json"');
    });

    it('should include index management functions', () => {
      history.addAction(ActionType.ADD_GAME, 'g1', 'Game 1', {});
      
      const script = history.generatePythonScript();
      
      expect(script).toContain('def add_game_to_index(game_id, game_data)');
      expect(script).toContain('def remove_game_from_index(game_id)');
      expect(script).toContain('def load_index()');
      expect(script).toContain('def save_index(index_data)');
    });

    it('should convert JSON booleans to Python booleans (true -> True)', () => {
      history.addAction(ActionType.TOGGLE_FAVORITE, 'catan', 'Catan', { favorite: true });
      
      const script = history.generatePythonScript();
      
      // Should use Python True, not JSON true (JSON has no space after colon)
      expect(script).toContain('"favorite":True');
      expect(script).not.toContain('"favorite":true');
    });

    it('should convert JSON booleans to Python booleans (false -> False)', () => {
      history.addAction(ActionType.TOGGLE_FAVORITE, 'catan', 'Catan', { favorite: false });
      
      const script = history.generatePythonScript();
      
      // Should use Python False, not JSON false (JSON has no space after colon)
      expect(script).toContain('"favorite":False');
      expect(script).not.toContain('"favorite":false');
    });

    it('should convert multiple booleans in payload', () => {
      history.addAction(ActionType.UPDATE_GAME, 'catan', 'Catan', {
        id: 'catan',
        title: 'Catan',
        favorite: true,
        archived: false,
      });
      
      const script = history.generatePythonScript();
      
      expect(script).toContain('"favorite":True');
      expect(script).toContain('"archived":False');
      expect(script).not.toContain('"favorite":true');
      expect(script).not.toContain('"archived":false');
    });

    it('should not convert strings containing "true" or "false"', () => {
      history.addAction(ActionType.ADD_GAME, 'g1', 'Game 1', {
        title: 'A true story',
        description: 'This is false information',
      });
      
      const script = history.generatePythonScript();
      
      // String values should remain unchanged (JSON uses double quotes)
      expect(script).toContain('"A true story"');
      expect(script).toContain('"This is false information"');
    });

    it('should generate syntactically valid Python for actions with booleans', () => {
      history.addAction(ActionType.UPDATE_GAME, 'catan', 'Catan', {
        id: 'catan',
        title: 'Catan',
        favorite: true,
        archived: false,
      });
      history.addAction(ActionType.TOGGLE_FAVORITE, 'azul', 'Azul', { favorite: false });
      history.addAction(ActionType.ARCHIVE_GAME, 'codenames', 'Codenames', null);
      
      const script = history.generatePythonScript();
      
      // Extract the actions array from the script
      const actionsMatch = script.match(/actions = \[\s*([\s\S]*?)\s*\]/);
      expect(actionsMatch).not.toBeNull();
      
      // The actions string should be valid Python (no JSON booleans)
      const actionsStr = actionsMatch[1];
      expect(actionsStr).not.toMatch(/:true/);
      expect(actionsStr).not.toMatch(/:false/);
      expect(actionsStr).toMatch(/:True/);
      expect(actionsStr).toMatch(/:False/);
    });
  });

  describe('getAction', () => {
    it('should return action by index', () => {
      history.addAction(ActionType.ADD_GAME, 'g1', 'Game 1', { title: 'Game 1' });
      
      const action = history.getAction(0);
      
      expect(action).not.toBeNull();
      expect(action.gameId).toBe('g1');
    });

    it('should return null for invalid index', () => {
      expect(history.getAction(0)).toBeNull();
      expect(history.getAction(-1)).toBeNull();
    });
  });

  describe('singleton functions', () => {
    beforeEach(() => {
      resetSessionHistory();
    });

    afterEach(() => {
      resetSessionHistory();
    });

    it('should return same instance from getSessionHistory', () => {
      const instance1 = getSessionHistory();
      const instance2 = getSessionHistory();
      
      expect(instance1).toBe(instance2);
    });

    it('should reset instance with resetSessionHistory', () => {
      const instance1 = getSessionHistory();
      instance1.addAction(ActionType.ADD_GAME, 'g1', 'Game 1', null);
      
      resetSessionHistory();
      
      const instance2 = getSessionHistory();
      expect(instance2.getCount()).toBe(0);
      expect(instance2).not.toBe(instance1);
    });
  });
});