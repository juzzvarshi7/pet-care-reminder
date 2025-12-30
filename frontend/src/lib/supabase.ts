import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Pet = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: number;
  image_url: string;
  notes: string;
  user_id: string | null;
  created_at: string;
};

export type Reminder = {
  id: string;
  pet_id: string;
  title: string;
  description: string;
  reminder_type: string;
  due_date: string;
  is_recurring: boolean;
  recurring_interval: string;
  is_completed: boolean;
  completed_at: string | null;
  priority: string;
  created_at: string;
};
