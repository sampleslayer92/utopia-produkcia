
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UpdateContractStatusParams {
  contractId: string;
  newStatus: 'draft' | 'request_draft' | 'pending_approval' | 'approved' | 'rejected' | 'in_progress' | 'sent_to_client' | 'email_viewed' | 'step_completed' | 'contract_generated' | 'signed' | 'waiting_for_signature' | 'lost';
}

export const useContractStatusUpdate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ contractId, newStatus }: UpdateContractStatusParams) => {
      console.log('Updating contract status:', contractId, newStatus);

      const { data, error } = await supabase
        .from('contracts')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', contractId)
        .select()
        .single();

      if (error) {
        console.error('Error updating contract status:', error);
        throw error;
      }

      console.log('Contract status updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate all contract-related queries to ensure real-time updates
      queryClient.invalidateQueries({ queryKey: ['enhanced-contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts-stats'] });
      queryClient.invalidateQueries({ queryKey: ['contract-complete', data.id] });
      queryClient.invalidateQueries({ queryKey: ['contract-data', data.id] });
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      
      toast({
        title: "Stav zmluvy aktualizovaný",
        description: `Zmluva ${data.contract_number} bola úspešne presunutá.`,
      });
    },
    onError: (error: any) => {
      console.error('Error updating contract status:', error);
      toast({
        title: "Chyba",
        description: `Nepodarilo sa aktualizovať stav zmluvy: ${error.message}`,
        variant: "destructive",
      });
    }
  });
};
