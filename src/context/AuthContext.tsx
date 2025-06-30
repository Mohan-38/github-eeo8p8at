import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type User = {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  website?: string;
  bio?: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateEmail: (newEmail: string, password: string) => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from Supabase auth session on mount
  useEffect(() => {
    const sessionUser = supabase.auth.getUser();

    sessionUser.then(({ data, error }) => {
      if (data.user) {
        const currentUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || '',
          phone: data.user.user_metadata?.phone || '',
          website: data.user.user_metadata?.website || '',
          bio: data.user.user_metadata?.bio || '',
          isAdmin: data.user.email === 'admin@example.com', // simple admin check by email
        };
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen to auth state changes (e.g. sign in, sign out)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const currentUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || '',
          phone: session.user.user_metadata?.phone || '',
          website: session.user.user_metadata?.website || '',
          bio: session.user.user_metadata?.bio || '',
          isAdmin: session.user.email === 'admin@example.com',
        };
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        setLoading(false);
        return false;
      }

      const loggedInUser = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || '',
        phone: data.user.user_metadata?.phone || '',
        website: data.user.user_metadata?.website || '',
        bio: data.user.user_metadata?.bio || '',
        isAdmin: data.user.email === 'admin@example.com',
      };

      setUser(loggedInUser);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: data.name,
          phone: data.phone,
          website: data.website,
          bio: data.bio,
        }
      });

      if (error) throw error;

      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('No user logged in');

    try {
      // First verify current password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (verifyError) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Password updated successfully - no need to update local state
      // as the password is handled by Supabase Auth
    } catch (error) {
      console.error('Password update error:', error);
      throw error;
    }
  };

  const updateEmail = async (newEmail: string, password: string) => {
    if (!user) throw new Error('No user logged in');

    try {
      // First verify password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      });

      if (verifyError) {
        throw new Error('Password is incorrect');
      }

      // Update email
      const { error: updateError } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Update local user state with new email
      setUser(prev => prev ? { ...prev, email: newEmail } : null);
    } catch (error) {
      console.error('Email update error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile,
    updatePassword,
    updateEmail,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};