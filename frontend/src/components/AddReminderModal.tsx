import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase, Pet } from '../lib/supabase';

interface AddReminderModalProps {
  pets: Pet[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddReminderModal({ pets, onClose, onSuccess }: AddReminderModalProps) {
  const [formData, setFormData] = useState({
    pet_id: '',
    title: '',
    description: '',
    reminder_type: '',
    due_date: '',
    due_time: '',
    is_recurring: false,
    recurring_interval: 'none',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dueDateTime = `${formData.due_date}T${formData.due_time}:00`;

    const { error } = await supabase.from('reminders').insert([
      {
        pet_id: formData.pet_id,
        title: formData.title,
        description: formData.description,
        reminder_type: formData.reminder_type,
        due_date: dueDateTime,
        is_recurring: formData.is_recurring,
        recurring_interval: formData.is_recurring ? formData.recurring_interval : 'none',
        priority: formData.priority,
      },
    ]);

    setLoading(false);

    if (!error) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Add New Reminder</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Pet *
            </label>
            <select
              required
              value={formData.pet_id}
              onChange={(e) => setFormData({ ...formData, pet_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            >
              <option value="">Choose a pet</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reminder Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="e.g., Morning feeding, Vet checkup"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reminder Type *
            </label>
            <select
              required
              value={formData.reminder_type}
              onChange={(e) => setFormData({ ...formData, reminder_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            >
              <option value="">Select type</option>
              <option value="feeding">Feeding</option>
              <option value="vet">Vet Appointment</option>
              <option value="grooming">Grooming</option>
              <option value="medication">Medication</option>
              <option value="exercise">Exercise/Walk</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              placeholder="Additional details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Time *
              </label>
              <input
                type="time"
                required
                value={formData.due_time}
                onChange={(e) => setFormData({ ...formData, due_time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Priority *
            </label>
            <select
              required
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_recurring"
              checked={formData.is_recurring}
              onChange={(e) =>
                setFormData({ ...formData, is_recurring: e.target.checked })
              }
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="is_recurring" className="text-sm font-semibold text-gray-700">
              Recurring Reminder
            </label>
          </div>

          {formData.is_recurring && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recurring Interval *
              </label>
              <select
                required={formData.is_recurring}
                value={formData.recurring_interval}
                onChange={(e) =>
                  setFormData({ ...formData, recurring_interval: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="none">Select interval</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
