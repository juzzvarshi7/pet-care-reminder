import { useState, useEffect } from 'react';
import { PawPrint } from 'lucide-react';
import { supabase, Pet } from './lib/supabase';
import PetList from './components/PetList';
import ReminderList from './components/ReminderList';
import AddPetModal from './components/AddPetModal';
import AddReminderModal from './components/AddReminderModal';

function App() {
  const [activeTab, setActiveTab] = useState<'pets' | 'reminders'>('pets');
  const [pets, setPets] = useState<Pet[]>([]);
  const [showAddPet, setShowAddPet] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadPets();
  }, [refreshTrigger]);

  const loadPets = async () => {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPets(data);
    }
  };

  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <PawPrint className="w-10 h-10 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-800">PetCare Reminder</h1>
          </div>
          <p className="text-center text-gray-600">Keep track of your furry friends and their care schedule</p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('pets')}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === 'pets'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              My Pets
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === 'reminders'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Reminders
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'pets' ? (
              <PetList
                pets={pets}
                onAddPet={() => setShowAddPet(true)}
                onRefresh={refresh}
              />
            ) : (
              <ReminderList
                pets={pets}
                onAddReminder={() => setShowAddReminder(true)}
                onRefresh={refresh}
              />
            )}
          </div>
        </div>
      </div>

      {showAddPet && (
        <AddPetModal
          onClose={() => setShowAddPet(false)}
          onSuccess={() => {
            setShowAddPet(false);
            refresh();
          }}
        />
      )}

      {showAddReminder && (
        <AddReminderModal
          pets={pets}
          onClose={() => setShowAddReminder(false)}
          onSuccess={() => {
            setShowAddReminder(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}

export default App;
