import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserSession {
  id: string;
  user_id?: string;
  session_token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export const useRealTimeCollaboration = (contractId: string, userEmail: string, userName: string) => {
  const [activeSessions, setActiveSessions] = useState<UserSession[]>([]);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const sessionIdRef = useRef(crypto.randomUUID());
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>();

  const updateSession = useCallback(async (currentStep?: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('user_sessions')
          .upsert({
            user_id: user.id,
            session_token: sessionIdRef.current,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
          });
      }
    } catch (error) {
      console.error('Failed to update session:', error);
    }
  }, []);

  const endSession = useCallback(async () => {
    try {
      await supabase
        .from('user_sessions')
        .delete()
        .eq('session_token', sessionIdRef.current);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }, []);

  const fetchActiveSessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .gte('expires_at', new Date().toISOString())
        .neq('session_token', sessionIdRef.current);

      if (error) throw error;
      
      setActiveSessions(data || []);
      
      // Simple conflict detection - can be enhanced later
      setConflicts([]);
      
    } catch (error) {
      console.error('Failed to fetch active sessions:', error);
    }
  }, [contractId]);

  // Initialize session and set up real-time updates
  useEffect(() => {
    updateSession();
    fetchActiveSessions();

    // Set up heartbeat to keep session alive
    heartbeatIntervalRef.current = setInterval(() => {
      updateSession();
    }, 30000); // Every 30 seconds

    // Set up real-time subscription
    const channel = supabase
      .channel('contract-collaboration')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_sessions',
          filter: `contract_id=eq.${contractId}`
        },
        () => {
          fetchActiveSessions();
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      endSession();
      supabase.removeChannel(channel);
    };
  }, [contractId, updateSession, fetchActiveSessions, endSession]);

  // Update session when step changes
  const updateCurrentStep = useCallback((stepNumber: number) => {
    updateSession(stepNumber);
  }, [updateSession]);

  return {
    activeSessions,
    conflicts,
    updateCurrentStep,
    sessionId: sessionIdRef.current
  };
};
