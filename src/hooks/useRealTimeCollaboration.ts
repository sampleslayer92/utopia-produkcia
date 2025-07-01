import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserSession {
  id: string;
  contract_id: string;
  user_email: string;
  user_name: string;
  session_id: string;
  current_step?: number;
  last_activity: string;
  is_active: boolean;
}

export const useRealTimeCollaboration = (contractId: string, userEmail: string, userName: string) => {
  const [activeSessions, setActiveSessions] = useState<UserSession[]>([]);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const sessionIdRef = useRef(crypto.randomUUID());
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>();

  const updateSession = useCallback(async (currentStep?: number) => {
    try {
      await supabase
        .from('user_sessions')
        .upsert({
          contract_id: contractId,
          user_email: userEmail,
          user_name: userName,
          session_id: sessionIdRef.current,
          current_step: currentStep,
          last_activity: new Date().toISOString(),
          is_active: true
        });
    } catch (error) {
      console.error('Failed to update session:', error);
    }
  }, [contractId, userEmail, userName]);

  const endSession = useCallback(async () => {
    try {
      await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('session_id', sessionIdRef.current);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }, []);

  const fetchActiveSessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('contract_id', contractId)
        .eq('is_active', true)
        .neq('session_id', sessionIdRef.current)
        .gte('last_activity', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Last 5 minutes

      if (error) throw error;
      
      setActiveSessions(data || []);
      
      // Detect conflicts (multiple users on same step)
      const currentSteps = data?.filter(s => s.current_step).map(s => s.current_step) || [];
      const duplicateSteps = currentSteps.filter((step, index) => currentSteps.indexOf(step) !== index);
      setConflicts([...new Set(duplicateSteps.map(String))]);
      
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
