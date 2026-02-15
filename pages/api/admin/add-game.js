import { GitHubGitService } from '../../../src/infrastructure/GitHubGitService';

const gitService = new GitHubGitService({
  token: process.env.GITHUB_TOKEN,
  owner: process.env.GITHUB_OWNER,
  repo: process.env.GITHUB_REPO,
  branch: process.env.GITHUB_BRANCH || 'main'
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { gameData } = req.body;

  if (!gameData) {
    return res.status(400).json({ error: 'Missing gameData' });
  }

  try {
    await gitService.addGame(gameData);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to add game' });
  }
}
