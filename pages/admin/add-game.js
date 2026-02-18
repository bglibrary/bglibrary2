import Head from 'next/head';
import { useRouter } from 'next/router';
import GameForm from '../../components/admin/GameForm';

export default function AddGamePage() {
  const router = useRouter();

  const handleSubmit = async (formData, imageFile) => {
    try {
      // In a real app, we'd upload the imageFile to a storage service first
      console.log("Submitting new game:", formData, imageFile);
      
      const response = await fetch('/api/admin/add-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameData: formData }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add game');
      }

      router.push('/admin');
    } catch (err) {
      alert(`Erreur : ${err.message}`);
    }
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
