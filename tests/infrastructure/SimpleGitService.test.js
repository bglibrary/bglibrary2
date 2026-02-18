const SimpleGitService = require('../../src/infrastructure/SimpleGitService');
const fs = require('fs').promises;
const path = require('path');
const simpleGit = require('simple-git');

// Mock simple-git
jest.mock('simple-git');

describe('SimpleGitService', () => {
  let gitService;
  const config = {
    repoUrl: 'https://user:token@github.com/repo.git',
    branch: 'main',
    basePath: 'data/games'
  };

  const mockGitInstance = {
    clone: jest.fn().mockResolvedValue({}),
    addConfig: jest.fn().mockResolvedValue({}),
    add: jest.fn().mockResolvedValue({}),
    commit: jest.fn().mockResolvedValue({}),
    push: jest.fn().mockResolvedValue({}),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    simpleGit.mockReturnValue(mockGitInstance);
    gitService = new SimpleGitService(config);
  });

  it('should clone, modify, commit and push when adding a game', async () => {
    const gameData = { id: 'test-game', title: 'Test Game' };
    
    // We mock fs.writeFile to avoid actual file system writes in this test
    // but the temp dir creation is still real (or we could mock it too)
    const writeFileSpy = jest.spyOn(fs, 'writeFile').mockResolvedValue({});
    const mkdirSpy = jest.spyOn(fs, 'mkdir').mockResolvedValue({});
    const accessSpy = jest.spyOn(fs, 'access').mockResolvedValue({});

    await gitService.addGame(gameData);

    expect(mockGitInstance.clone).toHaveBeenCalledWith(
      config.repoUrl, 
      expect.any(String), 
      ['--branch', config.branch, '--depth', '1']
    );
    expect(mockGitInstance.add).toHaveBeenCalledWith('.');
    expect(mockGitInstance.commit).toHaveBeenCalledWith('feat: Add game Test Game');
    expect(mockGitInstance.push).toHaveBeenCalled();

    writeFileSpy.mockRestore();
    mkdirSpy.mockRestore();
    accessSpy.mockRestore();
  });

  it('should handle authentication errors', async () => {
    mockGitInstance.clone.mockRejectedValue(new Error('Authentication failed'));
    
    await expect(gitService.addGame({ id: 'test' }))
      .rejects.toThrow(); // Should throw persistenceErrors.authenticationError()
  });

  it('should cleanup temp directory even on failure', async () => {
    const rmSpy = jest.spyOn(fs, 'rm').mockResolvedValue({});
    mockGitInstance.clone.mockRejectedValue(new Error('Clone failed'));

    try {
      await gitService.addGame({ id: 'test' });
    } catch (e) {
      // Expected
    }

    expect(rmSpy).toHaveBeenCalled();
    rmSpy.mockRestore();
  });
});
