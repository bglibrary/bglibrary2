import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import GameForm from '../../components/admin/GameForm';
import { AdminGameService } from '../../src/admin/AdminGameService';
import { FileGitService } from '../../src/infrastructure/FileGitService';

export default function AddGamePage() {
  const router = useRouter();
  const adminService = useMemo(() => new AdminGameService(new FileGitService()), []);

  const handleSubmit = async (formData, imageFile) => {
    // In a real app, we'd upload the imageFile to a storage service first
    // and then add the game data. For now, we simulate success with FileGitService.
    console.log("Submitting new game:", formData, imageFile);
    await adminService.addGame(formData);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Ajouter un jeu - Admin</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Ajouter un nouveau jeu</h1>
        <GameForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
