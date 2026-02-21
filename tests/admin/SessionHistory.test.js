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
    it('should add an action and return index', () => {
      const index = history.addAction(
        ActionType.ADD_GAME,
        'test-game',
        'Test Game',
        { title: 'Test Game' }
      );
      
      expect(index).toBe(0);
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