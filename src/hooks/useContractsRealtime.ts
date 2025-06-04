
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContractsRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Setting up real-time subscriptions for contracts...');

    const channel = supabase
      .channel('contracts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contracts'
        },
        (payload) => {
          console.log('Contract change detected:', payload);
          // Invalidate both contracts and enhanced contracts queries
          queryClient.invalidateQueries({ queryKey: ['contracts'] });
          queryClient.invalidateQueries({ queryKey: ['enhanced-contracts'] });
          queryClient.invalidateQueries({ queryKey: ['contracts-stats'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_info'
        },
        (payload) => {
          console.log('Contact info change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['enhanced-contracts'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'company_info'
        },
        (payload) => {
          console.log('Company info change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['enhanced-contracts'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contract_calculations'
        },
        (payload) => {
          console.log('Contract calculations change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['enhanced-contracts'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscriptions...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
