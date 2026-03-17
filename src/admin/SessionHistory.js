/**
 * SessionHistory
 * 
 * Tracks all admin changes within a browser session.
 * As specified in specs/phase_8_implementation_plan.md
 */

/**
 * Generate a simple unique ID
 * @returns {string}
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Action types for session history
 */
export const ActionType = {
  ADD_GAME: 'ADD_GAME',
  UPDATE_GAME: 'UPDATE_GAME',
  ARCHIVE_GAME: 'ARCHIVE_GAME',
  RESTORE_GAME: 'RESTORE_GAME',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  DELETE_GAME: 'DELETE_GAME',
};

/**
 * French labels for action types
 */
const ActionTypeLabels = {
  [ActionType.ADD_GAME]: 'Ajouter',
  [ActionType.UPDATE_GAME]: 'Modifier',
  [ActionType.ARCHIVE_GAME]: 'Archiver',
  [ActionType.RESTORE_GAME]: 'Restaurer',
  [ActionType.TOGGLE_FAVORITE]: 'Favori',
  [ActionType.DELETE_GAME]: 'Supprimer',
};

/**
 * French labels for game fields
 */
export const FieldLabels = {
  title: 'titre',
  description: 'description',
  minPlayers: 'joueurs min',
  maxPlayers: 'joueurs max',
  playDuration: 'durée',
  firstPlayComplexity: 'complexité',
  ageRecommendation: 'âge',
  categories: 'catégories',
  mechanics: 'mécaniques',
  awards: 'récompenses',
  favorite: 'favori',
  image: 'image',
};

/**
 * Generates a human-readable summary for an action
 * @param {string} type - Action type
 * @param {string} gameTitle - Game title
 * @param {object} payload - Action payload
 * @param {string[]} modifiedFields - List of modified field names (for UPDATE_GAME)
 * @returns {string}
 */
function generateSummary(type, gameTitle, payload, modifiedFields = []) {
  switch (type) {
    case ActionType.ADD_GAME:
      return `Ajouter: ${gameTitle}`;
    case ActionType.UPDATE_GAME:
      return `Modifier: ${gameTitle}`;
    case ActionType.ARCHIVE_GAME:
      return `Archiver: ${gameTitle}`;
    case ActionType.RESTORE_GAME:
      return `Restaurer: ${gameTitle}`;
    case ActionType.TOGGLE_FAVORITE:
      return payload?.favorite ? `Favori: ${gameTitle}` : `Non favori: ${gameTitle}`;
    case ActionType.DELETE_GAME:
      return `Supprimer: ${gameTitle}`;
    default:
      return `${ActionTypeLabels[type] || type}: ${gameTitle}`;
  }
}

/**
 * Formats modified fields as a French-readable list
 * @param {string[]} fields - List of field names
 * @returns {string}
 */
export function formatModifiedFields(fields) {
  if (!fields || fields.length === 0) return '';
  
  const translatedFields = fields.map(f => FieldLabels[f] || f);
  
  if (translatedFields.length === 1) {
    return translatedFields[0];
  }
  if (translatedFields.length === 2) {
    return `${translatedFields[0]} et ${translatedFields[1]}`;
  }
  // For 3+ items: "a, b et c"
  const last = translatedFields.pop();
  return `${translatedFields.join(', ')} et ${last}`;
}

/**
 * SessionHistory class
 * Manages the history of admin actions within a session
 */
export class SessionHistory {
  constructor() {
    this.actions = [];
    this.storageKey = 'notre-ludotheque-session';
    console.log('[SessionHistory]', 'constructor', { initialized: true });
  }

  /**
   * Get all actions in chronological order
   * @returns {object[]}
   */
  getActions() {
    return [...this.actions];
  }

  /**
   * Get an action by index
   * @param {number} index 
   * @returns {object|null}
   */
  getAction(index) {
    if (index < 0 || index >= this.actions.length) {
      return null;
    }
    return { ...this.actions[index] };
  }

  /**
   * Add a new action to the history
   * Handles deduplication: if same action type for same game exists,
   * it will replace or remove based on the action type.
   * @param {string} type - Action type from ActionType
   * @param {string} gameId - Target game ID
   * @param {string} gameTitle - Game title for display
   * @param {object|null} payload - Action-specific data
   * @param {string[]} modifiedFields - List of modified field names (for UPDATE_GAME)
   * @returns {object} Result with index and info about what happened
   */
  addAction(type, gameId, gameTitle, payload = null, modifiedFields = []) {
    // For UPDATE_GAME actions, replace existing update for same game
    if (type === ActionType.UPDATE_GAME) {
      const existingIndex = this.actions.findIndex(
        a => a.type === ActionType.UPDATE_GAME && a.gameId === gameId
      );
      
      if (existingIndex !== -1) {
        // Replace the existing update action with the new one
        const action = {
          id: generateId(),
          type,
          timestamp: new Date().toISOString(),
          gameId,
          gameTitle: gameTitle, // Update with new title
          payload: payload ? JSON.parse(JSON.stringify(payload)) : null,
          modifiedFields: modifiedFields || [],
          summary: generateSummary(type, gameTitle, payload, modifiedFields),
        };
        this.actions[existingIndex] = action;
        console.log('[SessionHistory]', 'addAction', { 
          type, 
          gameId, 
          action: 'replaced_existing_update',
          totalActions: this.actions.length 
        });
        this.saveToStorage();
        return { index: existingIndex, action: 'replaced' };
      }
    }

    // For toggle actions, check if there's already a toggle action for this game
    // If the new toggle brings back to original state, remove the existing action
    if (type === ActionType.TOGGLE_FAVORITE) {
      const existingIndex = this.actions.findIndex(
        a => a.type === ActionType.TOGGLE_FAVORITE && a.gameId === gameId
      );
      
      if (existingIndex !== -1) {
        // Remove the existing toggle action (we're back to original state)
        this.actions.splice(existingIndex, 1);
        console.log('[SessionHistory]', 'addAction', { 
          type, 
          gameId, 
          action: 'removed_existing_toggle',
          totalActions: this.actions.length 
        });
        this.saveToStorage();
        return { index: -1, action: 'removed' };
      }
    }

    // For archive/restore, they are mutually exclusive
    if (type === ActionType.ARCHIVE_GAME || type === ActionType.RESTORE_GAME) {
      const oppositeType = type === ActionType.ARCHIVE_GAME 
        ? ActionType.RESTORE_GAME 
        : ActionType.ARCHIVE_GAME;
      
      const existingIndex = this.actions.findIndex(
        a => a.type === oppositeType && a.gameId === gameId
      );
      
      if (existingIndex !== -1) {
        // Remove the opposite action (we're back to original state)
        this.actions.splice(existingIndex, 1);
        console.log('[SessionHistory]', 'addAction', { 
          type, 
          gameId, 
          action: 'removed_opposite_archive_restore',
          totalActions: this.actions.length 
        });
        this.saveToStorage();
        return { index: -1, action: 'removed' };
      }

      // Also check for same type - replace with new one
      const sameTypeIndex = this.actions.findIndex(
        a => a.type === type && a.gameId === gameId
      );
      if (sameTypeIndex !== -1) {
        this.actions.splice(sameTypeIndex, 1);
      }
    }

    const action = {
      id: generateId(),
      type,
      timestamp: new Date().toISOString(),
      gameId,
      gameTitle,
      payload: payload ? JSON.parse(JSON.stringify(payload)) : null,
      modifiedFields: modifiedFields || [],
      summary: generateSummary(type, gameTitle, payload, modifiedFields),
    };

    this.actions.push(action);
    
    console.log('[SessionHistory]', 'addAction', { 
      type, 
      gameId, 
      timestamp: action.timestamp,
      totalActions: this.actions.length 
    });

    // Auto-save to localStorage
    this.saveToStorage();

    return { index: this.actions.length - 1, action: 'added' };
  }

  /**
   * Remove an action by index (revert)
   * @param {number} index 
   * @returns {boolean} Success
   */
  removeAction(index) {
    if (index < 0 || index >= this.actions.length) {
      console.warn('[SessionHistory]', 'removeAction', { index, error: 'Invalid index' });
      return false;
    }

    const removed = this.actions.splice(index, 1)[0];
    console.log('[SessionHistory]', 'removeAction', { 
      index, 
      gameId: removed.gameId,
      type: removed.type,
      remainingActions: this.actions.length 
    });

    // Auto-save to localStorage
    this.saveToStorage();

    return true;
  }

  /**
   * Edit an existing action's payload
   * @param {number} index 
   * @param {object} newPayload 
   * @returns {boolean} Success
   */
  editAction(index, newPayload) {
    if (index < 0 || index >= this.actions.length) {
      console.warn('[SessionHistory]', 'editAction', { index, error: 'Invalid index' });
      return false;
    }

    const action = this.actions[index];
    
    // Only ADD_GAME and UPDATE_GAME can be edited
    if (action.type !== ActionType.ADD_GAME && action.type !== ActionType.UPDATE_GAME) {
      console.warn('[SessionHistory]', 'editAction', { index, error: 'Action type not editable' });
      return false;
    }

    action.payload = JSON.parse(JSON.stringify(newPayload));
    action.summary = generateSummary(action.type, action.gameTitle, action.payload);
    
    console.log('[SessionHistory]', 'editAction', { 
      index, 
      gameId: action.gameId,
      type: action.type 
    });

    // Auto-save to localStorage
    this.saveToStorage();

    return true;
  }

  /**
   * Clear all actions
   */
  clearAll() {
    const count = this.actions.length;
    this.actions = [];
    console.log('[SessionHistory]', 'clearAll', { clearedCount: count });
    
    // Clear localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.storageKey);
    }
  }

  /**
   * Get action count
   * @returns {number}
   */
  getCount() {
    return this.actions.length;
  }

  /**
   * Check if session has any changes
   * @returns {boolean}
   */
  hasChanges() {
    return this.actions.length > 0;
  }

  /**
   * Get actions for a specific game
   * @param {string} gameId 
   * @returns {object[]}
   */
  getActionsForGame(gameId) {
    return this.actions.filter(a => a.gameId === gameId);
  }

  /**
   * Check if a game has pending changes
   * @param {string} gameId 
   * @returns {boolean}
   */
  hasPendingChanges(gameId) {
    return this.actions.some(a => a.gameId === gameId);
  }

  /**
   * Persist to localStorage
   */
  saveToStorage() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      const data = JSON.stringify({
        version: 1,
        timestamp: new Date().toISOString(),
        actions: this.actions,
      });
      localStorage.setItem(this.storageKey, data);
      console.log('[SessionHistory]', 'saveToStorage', { actionCount: this.actions.length });
    } catch (error) {
      console.error('[SessionHistory]', 'saveToStorage', { error: error.message });
    }
  }

  /**
   * Restore from localStorage
   * @returns {boolean} Success
   */
  loadFromStorage() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) {
        console.log('[SessionHistory]', 'loadFromStorage', { status: 'No saved session' });
        return false;
      }

      const parsed = JSON.parse(data);
      
      // Validate version
      if (parsed.version !== 1) {
        console.warn('[SessionHistory]', 'loadFromStorage', { error: 'Unsupported version' });
        return false;
      }

      this.actions = parsed.actions || [];
      console.log('[SessionHistory]', 'loadFromStorage', { 
        actionCount: this.actions.length,
        savedAt: parsed.timestamp 
      });
      
      return true;
    } catch (error) {
      console.error('[SessionHistory]', 'loadFromStorage', { error: error.message });
      return false;
    }
  }

  /**
   * Generate Python script for applying changes
   * @returns {string}
   */
  generatePythonScript() {
    console.log('[SessionHistory]', 'generatePythonScript', { actionCount: this.actions.length });

    const timestamp = new Date().toISOString();
    const actionsArray = this.actions.map(a => {
      const jsonStr = JSON.stringify({
        type: a.type,
        gameId: a.gameId,
        payload: a.payload,
      });
      // Convert JSON values to Python equivalents (true->True, false->False, null->None)
      const pythonStr = jsonStr
        .replace(/:true/g, ':True')
        .replace(/:false/g, ':False')
        .replace(/:null/g, ':None');
      return `    ${pythonStr},`;
    }).join('\n');

    return `#!/usr/bin/env python3
"""
Board Game Library Update Script
Generated: ${timestamp}
Total Actions: ${this.actions.length}

This script applies pending changes to the game library.
Run this script at the root of the repository.

Usage:
    python3 update_library.py [--dry-run] [--no-commit]

Workflow:
    1. Creates a new branch for the changes
    2. Applies all pending actions (one commit per action)
    3. Asks for validation before rebasing on main
    4. Asks for validation before merging on main
"""

import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

# Configuration
GAMES_DIR = Path("public/data/games")
IMAGES_DIR = Path("public/images")
INDEX_FILE = GAMES_DIR / "index.json"
BRANCH_PREFIX = "admin-session"

def validate_context():
    """Ensure script is run at repo root."""
    if not GAMES_DIR.exists():
        print("ERROR: Must be run at repository root (public/data/games/ not found)")
        sys.exit(1)

def load_game(game_id):
    """Load a game JSON file."""
    path = GAMES_DIR / f"{game_id}.json"
    if path.exists():
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def save_game(game_id, data):
    """Save a game JSON file."""
    path = GAMES_DIR / f"{game_id}.json"
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def delete_game(game_id):
    """Delete a game JSON file."""
    path = GAMES_DIR / f"{game_id}.json"
    if path.exists():
        path.unlink()

def load_index():
    """Load the games index file."""
    if INDEX_FILE.exists():
        with open(INDEX_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # Handle both formats: { "games": [...] } or [...]
            if isinstance(data, dict) and 'games' in data:
                return data
            elif isinstance(data, list):
                return {"games": [g.get('id') if isinstance(g, dict) else g for g in data]}
            return {"games": []}
    return {"games": []}

def save_index(index_data):
    """Save the games index file."""
    with open(INDEX_FILE, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, indent=2, ensure_ascii=False)

def add_game_to_index(game_id, game_data):
    """Add a game to the index."""
    index = load_index()
    if game_id not in index['games']:
        index['games'].append(game_id)
        save_index(index)
        print(f"  Added to index: {game_id}")

def remove_game_from_index(game_id):
    """Remove a game from the index."""
    index = load_index()
    if game_id in index['games']:
        index['games'].remove(game_id)
        save_index(index)
        print(f"  Removed from index: {game_id}")

def git_add_commit(message):
    """Stage and commit changes."""
    subprocess.run(['git', 'add', '.'], check=True)
    subprocess.run(['git', 'commit', '-m', message], check=True)

def get_current_branch():
    """Get the current git branch name."""
    result = subprocess.run(['git', 'branch', '--show-current'], capture_output=True, text=True)
    return result.stdout.strip()

def create_session_branch():
    """Create a new branch for the session changes."""
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    branch_name = f"{BRANCH_PREFIX}-{timestamp}"
    subprocess.run(['git', 'checkout', '-b', branch_name], check=True)
    return branch_name

def ask_confirmation(prompt, default='n'):
    """Ask for user confirmation."""
    default_hint = "[Y/n]" if default.lower() == 'y' else "[y/N]"
    while True:
        response = input(f"\\n{prompt} {default_hint}: ").strip().lower()
        if not response:
            return default.lower() == 'y'
        if response in ['y', 'yes', 'o', 'oui']:
            return True
        if response in ['n', 'no', 'non']:
            return False
        print("Please answer with 'y' or 'n'.")

def apply_actions(dry_run=False, no_commit=False):
    """Apply all pending actions."""
    validate_context()
    
    actions = [
${actionsArray}
    ]
    
    print(f"Applying {len(actions)} action(s)...")
    
    if dry_run:
        print("\\n=== DRY RUN MODE ===")
        for i, action in enumerate(actions, 1):
            print(f"\\n[{i}/{len(actions)}] {action['type']}: {action['gameId']}")
            if action['type'] == 'ADD_GAME':
                print(f"  Would create: {action['gameId']}.json")
            elif action['type'] == 'UPDATE_GAME':
                print(f"  Would update: {action['gameId']}.json")
            elif action['type'] == 'DELETE_GAME':
                print(f"  Would delete: {action['gameId']}.json")
            elif action['type'] == 'TOGGLE_FAVORITE':
                status = "favori" if action['payload']['favorite'] else "non favori"
                print(f"  Would toggle favorite: {action['gameId']} -> {status}")
            elif action['type'] in ['ARCHIVE_GAME', 'RESTORE_GAME']:
                print(f"  Would {action['type'].lower().replace('_', ' ')}: {action['gameId']}")
        print("\\nDry run complete. No changes made.")
        return
    
    # Save current branch to restore later if needed
    original_branch = get_current_branch()
    print(f"\\nCurrent branch: {original_branch}")
    
    if not no_commit:
        # Create a new branch for this session
        session_branch = create_session_branch()
        print(f"Created branch: {session_branch}")
    
    for i, action in enumerate(actions, 1):
        print(f"\\n[{i}/{len(actions)}] {action['type']}: {action['gameId']}")
        
        if action['type'] == 'ADD_GAME':
            save_game(action['gameId'], action['payload'])
            add_game_to_index(action['gameId'], action['payload'])
            print(f"  Created: {action['gameId']}.json")
            
        elif action['type'] == 'UPDATE_GAME':
            save_game(action['gameId'], action['payload'])
            print(f"  Updated: {action['gameId']}.json")
            
        elif action['type'] == 'TOGGLE_FAVORITE':
            game = load_game(action['gameId'])
            if game:
                game['favorite'] = action['payload']['favorite']
                save_game(action['gameId'], game)
                status = "favori" if game['favorite'] else "non favori"
                print(f"  Toggled favorite: {action['gameId']} -> {status}")
            else:
                print(f"  ERROR: Game not found: {action['gameId']}")
                
        elif action['type'] == 'ARCHIVE_GAME':
            game = load_game(action['gameId'])
            if game:
                game['archived'] = True
                save_game(action['gameId'], game)
                print(f"  Archived: {action['gameId']}")
            else:
                print(f"  ERROR: Game not found: {action['gameId']}")
                
        elif action['type'] == 'RESTORE_GAME':
            game = load_game(action['gameId'])
            if game:
                game['archived'] = False
                save_game(action['gameId'], game)
                print(f"  Restored: {action['gameId']}")
            else:
                print(f"  ERROR: Game not found: {action['gameId']}")
                
        elif action['type'] == 'DELETE_GAME':
            delete_game(action['gameId'])
            remove_game_from_index(action['gameId'])
            print(f"  Deleted: {action['gameId']}.json")
        
        # Commit each action individually
        if not no_commit:
            action_label = {
                'ADD_GAME': 'Add game',
                'UPDATE_GAME': 'Update game',
                'DELETE_GAME': 'Delete game',
                'TOGGLE_FAVORITE': 'Toggle favorite',
                'ARCHIVE_GAME': 'Archive game',
                'RESTORE_GAME': 'Restore game',
            }.get(action['type'], action['type'])
            commit_msg = f"{action_label}: {action['gameId']}"
            git_add_commit(commit_msg)
            print(f"  Committed: {commit_msg}")
    
    if no_commit:
        print("\\nChanges applied without Git commits.")
        return
    
    print(f"\\n{'='*50}")
    print(f"Session branch: {session_branch}")
    print(f"Total commits: {len(actions)}")
    print(f"{'='*50}")
    
    # Ask before rebasing on main
    print(f"\\nYou are on branch: {session_branch}")
    print("Next step: rebase on main and merge.")
    
    if not ask_confirmation("Rebase on main?"):
        print(f"\\nAborted. You are still on branch: {session_branch}")
        print("You can manually rebase and merge later with:")
        print(f"  git checkout main && git merge {session_branch}")
        return
    
    # Rebase on main
    print("\\nRebasing on main...")
    subprocess.run(['git', 'checkout', 'main'], check=True)
    subprocess.run(['git', 'merge', session_branch, '--no-ff', '-m', f"Merge branch '{session_branch}' - Admin session update"], check=True)
    print("Merged on main.")
    
    # Delete the session branch
    subprocess.run(['git', 'branch', '-d', session_branch], check=True)
    print(f"Deleted branch: {session_branch}")
    
    # Ask before pushing
    if ask_confirmation("Push to remote?"):
        subprocess.run(['git', 'push'], check=True)
        print("Pushed to remote.")
    else:
        print("\\nChanges are local only. Push later with: git push")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Apply library updates')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without applying')
    parser.add_argument('--no-commit', action='store_true', help='Apply changes without committing')
    args = parser.parse_args()
    
    apply_actions(dry_run=args.dry_run, no_commit=args.no_commit)
`;
  }
}

// Singleton instance
let sessionHistoryInstance = null;

/**
 * Get the singleton SessionHistory instance
 * @returns {SessionHistory}
 */
export function getSessionHistory() {
  if (!sessionHistoryInstance) {
    sessionHistoryInstance = new SessionHistory();
  }
  return sessionHistoryInstance;
}

/**
 * Reset the singleton (useful for testing)
 */
export function resetSessionHistory() {
  if (sessionHistoryInstance) {
    sessionHistoryInstance.clearAll();
  }
  sessionHistoryInstance = null;
  console.log('[SessionHistory]', 'resetSessionHistory');
}