/**
 * This file acts as a bridge for game data access.
 * 
 * IMPORTANT: To avoid "Module not found: Can't resolve 'fs'" errors in Next.js client-side bundles,
 * the actual implementation that uses Node.js 'fs' is located in 'getGames.server.js'.
 * 
 * Functions here should only be called from server-side contexts like getStaticProps, 
 * getServerSideProps, or API routes.
 */

export async function getGamesForVisitor() {
  const { getGamesForVisitor: getGames } = await import('./getGames.server');
  return getGames();
}

export async function getGamesForAdmin() {
  const { getGamesForAdmin: getGames } = await import('./getGames.server');
  return getGames();
}
