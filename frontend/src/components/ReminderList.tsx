import { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
  Filter,
  AlertCircle,
  Pill,
  Scissors,
  Activity,
  Utensils,
  MoreHorizontal,
} from 'lucide-react';
import { supabase, Pet, Reminder } from '../lib/supabase';

interface ReminderListProps {
  pets: Pet[];
  onAddReminder: () => void;
  onRefresh: () => void;
}

type FilterType = 'all' | 'upcoming' | 'completed' | 'overdue';

const getReminderIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'feeding':
      return Utensils;
    case 'vet':
      return Activity;
    case 'grooming':
      return Scissors;
    case 'medication':
      return Pill;
    case 'exercise':
      return Activity;
    default:
      return MoreHorizontal;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function ReminderList({ pets, onAddReminder, onRefresh }: ReminderListProps) {
  const [reminders, setReminders] = useState<(Reminder & { pet_name?: string })[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .order('due_date', { ascending: true });

    if (!error && data) {
      const remindersWithPetNames = data.map((reminder) => {
        const pet = pets.find((p) => p.id === reminder.pet_id);
        return {
          ...reminder,
          pet_name: pet?.name || 'Unknown Pet',
        };
      });
      setReminders(remindersWithPetNames);
    }
    setLoading(false);
  };

  const toggleComplete = async (reminder: Reminder) => {
    const { error } = await supabase
      .from('reminders')
      .update({
        is_completed: !reminder.is_completed,
        completed_at: !reminder.is_completed ? new Date().toISOString() : null,
      })
      .eq('id', reminder.id);

    if (!error) {
      loadReminders();
      onRefresh();
    }
  };

  const deleteReminder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) {
      return;
    }

    const { error } = await supabase.from('reminders').delete().eq('id', id);

    if (!error) {
      loadReminders();
      onRefresh();
    }
  };

  const getFilteredReminders = () => {
    const now = new Date();

    switch (filter) {
      case 'upcoming':
        return reminders.filter((r) => !r.is_completed && new Date(r.due_date) >= now);
      case 'completed':
        return reminders.filter((r) => r.is_completed);
      case 'overdue':
        return reminders.filter((r) => !r.is_completed && new Date(r.due_date) < now);
      default:
        return reminders;
    }
  };

  const filteredReminders = getFilteredReminders();

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading reminders...</div>;
  }

  if (pets.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No pets added</h3>
        <p className="text-gray-500">Add a pet first before creating reminders</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Reminders ({filteredReminders.length})
        </h2>
        <button
          onClick={onAddReminder}
          className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Reminder
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filter === 'all'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filter === 'upcoming'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('overdue')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filter === 'overdue'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Overdue
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filter === 'completed'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
      </div>

      {filteredReminders.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No reminders found</h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all'
              ? 'Create your first reminder to keep track of pet care tasks'
              : `No ${filter} reminders at the moment`}
          </p>
          {filter === 'all' && (
            <button
              onClick={onAddReminder}
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Create First Reminder
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReminders.map((reminder) => {
            const Icon = getReminderIcon(reminder.reminder_type);
            const dueDate = new Date(reminder.due_date);
            const isOverdue = !reminder.is_completed && dueDate < new Date();
            const priorityColor = getPriorityColor(reminder.priority);

            return (
              <div
                key={reminder.id}
                className={`bg-white border-2 rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${
                  reminder.is_completed
                    ? 'border-green-200 bg-green-50'
                    : isOverdue
                    ? 'border-red-200 bg-red-50'
                    : 'border-orange-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleComplete(reminder)}
                    className="mt-1 flex-shrink-0"
                  >
                    {reminder.is_completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-orange-600 transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Icon className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <h3
                          className={`font-bold text-lg ${
                            reminder.is_completed ? 'line-through text-gray-500' : 'text-gray-800'
                          }`}
                        >
                          {reminder.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${priorityColor}`}
                        >
                          {reminder.priority}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Pet:</span> {reminder.pet_name}
                    </p>

                    {reminder.description && (
                      <p className="text-sm text-gray-700 mb-2">{reminder.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{dueDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {reminder.is_recurring && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          Recurring: {reminder.recurring_interval}
                        </span>
                      )}
                      {isOverdue && !reminder.is_completed && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
