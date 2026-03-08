import { createClient } from '@supabase/supabase-js';

// 商用では .env ファイルから読み込むのが標準です
// Vite の場合: import.meta.env.VITE_SUPABASE_URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qefyjgpjvfzaiiiakhlw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZnlqZ3BqdmZ6YWlpaWFraGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MTY0MzYsImV4cCI6MjA4ODQ5MjQzNn0.-9FtThZ1sN-b2V19bjFUrZYwDln-_BaaKBVHFuOLuJk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getApps = async () => {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const submitApp = async (app) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('ログインが必要です');

  const { data, error } = await supabase
    .from('apps')
    .insert([{ ...app, user_id: user.id }]);
  
  if (error) throw error;
  return data;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
