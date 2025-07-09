
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  created_by?: string;
  is_active: boolean;
}

interface UserRole {
  role: 'admin' | 'partner' | 'merchant';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRole: UserRole | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  clearSession: () => Promise<void>;
}

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
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Debug localStorage on startup
  useEffect(() => {
    console.log('🔍 [Auth Debug] localStorage contents:');
    console.log('🔍 [Auth Debug] supabase.auth.token:', localStorage.getItem('supabase.auth.token'));
    console.log('🔍 [Auth Debug] All localStorage keys:', Object.keys(localStorage));
    
    // Log all supabase-related items
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase')) {
        console.log(`🔍 [Auth Debug] ${key}:`, localStorage.getItem(key));
      }
    });
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 [Auth Debug] Fetching profile for user:', userId);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.log('🔍 [Auth Debug] Profile error:', profileError);
        throw profileError;
      }

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError) {
        console.log('🔍 [Auth Debug] Role error:', roleError);
        throw roleError;
      }

      console.log('🔍 [Auth Debug] Profile data:', profileData);
      console.log('🔍 [Auth Debug] Role data:', roleData);
      
      setProfile(profileData);
      setUserRole(roleData);
    } catch (error) {
      console.error('🔍 [Auth Debug] Error fetching profile:', error);
      setProfile(null);
      setUserRole(null);
    }
  };

  const clearSession = async () => {
    console.log('🔍 [Auth Debug] Manually clearing session');
    
    // Clear Supabase session
    await supabase.auth.signOut();
    
    // Clear localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase')) {
        localStorage.removeItem(key);
        console.log('🔍 [Auth Debug] Removed from localStorage:', key);
      }
    });
    
    // Clear state
    setUser(null);
    setSession(null);
    setProfile(null);
    setUserRole(null);
    
    console.log('🔍 [Auth Debug] Session cleared successfully');
  };

  useEffect(() => {
    console.log('🔍 [Auth Debug] Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔍 [Auth Debug] Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('🔍 [Auth Debug] User found, fetching profile');
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          console.log('🔍 [Auth Debug] No user, clearing profile data');
          setProfile(null);
          setUserRole(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 [Auth Debug] Initial session check:', session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      console.log('🔍 [Auth Debug] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔍 [Auth Debug] Attempting sign in for:', email);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.log('🔍 [Auth Debug] Sign in error:', error);
    } else {
      console.log('🔍 [Auth Debug] Sign in successful');
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    console.log('🔍 [Auth Debug] Attempting sign up for:', email);
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });
    
    if (error) {
      console.log('🔍 [Auth Debug] Sign up error:', error);
    } else {
      console.log('🔍 [Auth Debug] Sign up successful');
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('🔍 [Auth Debug] Signing out');
    
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setUserRole(null);
    
    console.log('🔍 [Auth Debug] Sign out completed');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (!error && profile) {
      setProfile({ ...profile, ...updates });
    }

    return { error };
  };

  const value = {
    user,
    session,
    profile,
    userRole,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    clearSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
