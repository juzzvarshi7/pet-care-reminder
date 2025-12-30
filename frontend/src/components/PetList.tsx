import { Plus, Edit2, Trash2, Dog, Cat, Bird, Fish } from 'lucide-react';
import { supabase, Pet } from '../lib/supabase';
import { useState } from 'react';

interface PetListProps {
  pets: Pet[];
  onAddPet: () => void;
  onRefresh: () => void;
}

const getPetIcon = (type: string) => {
  const lowercaseType = type.toLowerCase();
  if (lowercaseType.includes('dog')) return Dog;
  if (lowercaseType.includes('cat')) return Cat;
  if (lowercaseType.includes('bird')) return Bird;
  if (lowercaseType.includes('fish')) return Fish;
  return Dog;
};

export default function PetList({ pets, onAddPet, onRefresh }: PetListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pet? All associated reminders will also be deleted.')) {
      return;
    }

    setDeletingId(id);
    const { error } = await supabase.from('pets').delete().eq('id', id);

    if (!error) {
      onRefresh();
    }
    setDeletingId(null);
  };

  if (pets.length === 0) {
    return (
      <div className="text-center py-12">
        <Dog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No pets yet</h3>
        <p className="text-gray-500 mb-6">Add your first pet to start tracking their care</p>
        <button
          onClick={onAddPet}
          className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Your First Pet
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Pets ({pets.length})</h2>
        <button
          onClick={onAddPet}
          className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Pet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => {
          const Icon = getPetIcon(pet.type);
          return (
            <div
              key={pet.id}
              className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-orange-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-600 p-3 rounded-full">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{pet.name}</h3>
                    <p className="text-sm text-gray-600">{pet.type}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-700 mb-4">
                {pet.breed && (
                  <p>
                    <span className="font-semibold">Breed:</span> {pet.breed}
                  </p>
                )}
                {pet.age > 0 && (
                  <p>
                    <span className="font-semibold">Age:</span> {pet.age} {pet.age === 1 ? 'year' : 'years'}
                  </p>
                )}
                {pet.weight > 0 && (
                  <p>
                    <span className="font-semibold">Weight:</span> {pet.weight} lbs
                  </p>
                )}
                {pet.notes && (
                  <p className="text-gray-600 italic mt-2">{pet.notes}</p>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-orange-200">
                <button
                  onClick={() => handleDelete(pet.id)}
                  disabled={deletingId === pet.id}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
