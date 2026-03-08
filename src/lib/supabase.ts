import { createClient, User } from '@supabase/supabase-js';
import { AppData } from '../types';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://qefyjgpjvfzaiiiakhlw.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZnlqZ3BqdmZ6YWlpaWFraGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MTY0MzYsImV4cCI6MjA4ODQ5MjQzNn0.-9FtThZ1sN-b2V19bjFUrZYwDln-_BaaKBVHFuOLuJk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getApps = async (): Promise<AppData[]> => {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const uploadIcon = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `icons/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('app-icons')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('app-icons')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const submitApp = async (app: Partial<AppData>): Promise<any> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('ログインが必要です');

  const { data, error } = await supabase
    .from('apps')
    .insert([{ ...app, user_id: user.id }]);
  
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string): Promise<any> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string): Promise<any> => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
