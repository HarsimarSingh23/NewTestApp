import { create } from 'zustand';
import { supabase } from '../backend/supabaseClient';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, password) => {
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      console.error('User not found:', userError);
      return false;
    }


    const isPasswordCorrect = await bcrypt.compare(password, userData.password_hash);

    if (!isPasswordCorrect) {
      console.error('Invalid password');
      return false;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.error('Login Error:', error.message);
      return false;
    }

    set({ 
      user: { 
        id: data.user?.id, 
        email: data.user?.email || '', 
        name: '' 
      }, 
      isAuthenticated: true 
    });

    return true;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },
}));