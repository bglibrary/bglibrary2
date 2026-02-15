import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PlayDuration, FirstPlayComplexity, AgeRange, Categories, Mechanics, AwardNames } from '../../src/domain/types';
import { ImageAssetManager } from '../../src/images/ImageAssetManager';

export default function GameForm({ initialData, onSubmit, isEdit = false }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    minPlayers: 1,
    maxPlayers: 4,
    playDuration: PlayDuration.MEDIUM,
    ageRecommendation: AgeRange[0] || '8+',
    firstPlayComplexity: FirstPlayComplexity.MEDIUM,
    categories: [],
    mechanics: [],
    awards: [],
    favorite: false,
    archived: false,
    images: [{ id: '', source: 'user', attribution: '' }]
  });

  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value, 10) : value)
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => {
      const current = prev[name];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [name]: [...current, value] };
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const mockFile = {
        filename: file.name,
        contentType: file.type,
        sizeInBytes: file.size
      };
      
      // Basic validation via ImageAssetManager
      const descriptor = ImageAssetManager.validateAndCreateDescriptor(mockFile, { 
        attribution: formData.images[0].attribution 
      });
      
      setImageFile(file);
      setFormData(prev => ({
        ...prev,
        images: [{ ...prev.images[0], id: descriptor.id }]
      }));
      setErrors(prev => ({ ...prev, image: null }));
    } catch (err) {
      setErrors(prev => ({ ...prev, image: err.message }));
    }
  };

  const addAward = () => {
    setFormData(prev => ({
      ...prev,
      awards: [...prev.awards, { name: AwardNames[0], year: new Date().getFullYear() }]
    }));
  };

  const removeAward = (index) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  const handleAwardChange = (index, field, value) => {
    setFormData(prev => {
      const newAwards = [...prev.awards];
      newAwards[index] = { ...newAwards[index], [field]: field === 'year' ? parseInt(value, 10) : value };
      return { ...prev, awards: newAwards };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.id) newErrors.id = "L'ID est obligatoire.";
    if (!formData.title) newErrors.title = "Le titre est obligatoire.";
    if (!formData.description) newErrors.description = "La description est obligatoire.";
    if (formData.minPlayers > formData.maxPlayers) newErrors.players = "Le minimum de joueurs ne peut pas être supérieur au maximum.";
    if (formData.images[0].id === '') newErrors.image = "Une image est obligatoire.";
    if (!formData.images[0].attribution) newErrors.attribution = "L'attribution de l'image est obligatoire.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData, imageFile);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ID & Title */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Identifiant (ID)</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            disabled={isEdit}
            className={`w-full p-2 border rounded-md ${errors.id ? 'border-red-500' : 'border-gray-300'} ${isEdit ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="ex: catan"
          />
          {errors.id && <p className="text-red-500 text-xs">{errors.id}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Titre</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="ex: Les Colons de Catan"
          />
          {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="col-span-full space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
        </div>

        {/* Players */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Nombre de joueurs</label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Min</label>
              <input type="number" name="minPlayers" value={formData.minPlayers} onChange={handleChange} min="1" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Max</label>
              <input type="number" name="maxPlayers" value={formData.maxPlayers} onChange={handleChange} min="1" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          {errors.players && <p className="text-red-500 text-xs">{errors.players}</p>}
        </div>

        {/* Duration & Complexity */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Durée & Complexité</label>
          <div className="flex gap-4">
            <select name="playDuration" value={formData.playDuration} onChange={handleChange} className="flex-1 p-2 border border-gray-300 rounded-md">
              {Object.values(PlayDuration).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select name="firstPlayComplexity" value={formData.firstPlayComplexity} onChange={handleChange} className="flex-1 p-2 border border-gray-300 rounded-md">
              {Object.values(FirstPlayComplexity).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Categories & Mechanics */}
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Catégories</label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
              {Categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleMultiSelect('categories', cat)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${formData.categories.includes(cat) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Mécaniques</label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
              {Mechanics.map(mech => (
                <button
                  key={mech}
                  type="button"
                  onClick={() => handleMultiSelect('mechanics', mech)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${formData.mechanics.includes(mech) ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {mech}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="col-span-full space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 border-b pb-2">Image</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fichier Image</label>
              <input type="file" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
              {formData.images[0].id && <p className="text-xs text-gray-500">Image sélectionnée : {formData.images[0].id}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Attribution (obligatoire)</label>
              <input
                type="text"
                value={formData.images[0].attribution}
                onChange={(e) => setFormData(prev => {
                  const newImages = [...prev.images];
                  newImages[0] = { ...newImages[0], attribution: e.target.value };
                  return { ...prev, images: newImages };
                })}
                className={`w-full p-2 border rounded-md ${errors.attribution ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="ex: Klaus Teuber"
              />
              {errors.attribution && <p className="text-red-500 text-xs">{errors.attribution}</p>}
            </div>
          </div>
        </div>

        {/* Awards */}
        <div className="col-span-full space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-semibold text-gray-900">Prix & Récompenses</h3>
            <button type="button" onClick={addAward} className="text-sm text-blue-600 hover:underline">+ Ajouter un prix</button>
          </div>
          <div className="space-y-4">
            {formData.awards.map((award, index) => (
              <div key={index} className="flex gap-4 items-end bg-gray-50 p-3 rounded-md">
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-gray-500">Nom du prix</label>
                  <select value={award.name} onChange={(e) => handleAwardChange(index, 'name', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                    {AwardNames.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="w-32 space-y-1">
                  <label className="text-xs text-gray-500">Année</label>
                  <input type="number" value={award.year} onChange={(e) => handleAwardChange(index, 'year', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white" />
                </div>
                <button type="button" onClick={() => removeAward(index)} className="text-red-600 p-2 hover:bg-red-50 rounded-md">🗑️</button>
              </div>
            ))}
          </div>
        </div>

        {/* Flags */}
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="favorite" checked={formData.favorite} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded" />
            <span className="text-sm font-semibold text-gray-700 font-bold">Favori (❤️ Coup de cœur)</span>
          </label>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t">
        <button type="button" onClick={() => router.back()} className="text-gray-600 hover:underline">Annuler</button>
        <div className="flex gap-4 items-center">
          {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition-colors shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer le jeu'}
          </button>
        </div>
      </div>
    </form>
  );
}
