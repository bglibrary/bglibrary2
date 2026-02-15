import { archiveErrors } from '../../src/admin/archiveErrors';
import { ArchiveManager } from '../../src/admin/ArchiveManager';

describe('ArchiveManager', () => {
  const activeGame = {
    id: 'catan',
    title: 'Catan',
    archived: false
  };

  const archivedGame = {
    id: 'azul',
    title: 'Azul',
    archived: true
  };

  test('should archive an active game', () => {
    const updatedGame = ArchiveManager.archiveGame(activeGame);
    expect(updatedGame.archived).toBe(true);
    expect(updatedGame.id).toBe(activeGame.id);
  });

  test('should throw error when archiving an already archived game', () => {
    expect(() => ArchiveManager.archiveGame(archivedGame))
      .toThrow(archiveErrors.gameAlreadyArchived(archivedGame.id).message);
  });

  test('should restore an archived game', () => {
    const updatedGame = ArchiveManager.restoreGame(archivedGame);
    expect(updatedGame.archived).toBe(false);
    expect(updatedGame.id).toBe(archivedGame.id);
  });

  test('should throw error when restoring an active game', () => {
    expect(() => ArchiveManager.restoreGame(activeGame))
      .toThrow(archiveErrors.gameNotArchived(activeGame.id).message);
  });

  test('should throw error if archive flag is missing', () => {
    const brokenGame = { id: 'broken', title: 'Broken' };
    expect(() => ArchiveManager.archiveGame(brokenGame))
      .toThrow(archiveErrors.missingArchiveFlag('broken').message);
    expect(() => ArchiveManager.restoreGame(brokenGame))
      .toThrow(archiveErrors.missingArchiveFlag('broken').message);
  });

  test('should return an immutable object', () => {
    const updatedGame = ArchiveManager.archiveGame(activeGame);
    expect(Object.isFrozen(updatedGame)).toBe(true);
  });
});
