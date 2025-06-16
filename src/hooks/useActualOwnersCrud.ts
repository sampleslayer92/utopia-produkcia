
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useActualOwnersCrud = (contractId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addOwner = useMutation({
    mutationFn: async (ownerData: any) => {
      const { data, error } = await supabase
        .from('actual_owners')
        .insert([{ 
          ...ownerData, 
          contract_id: contractId,
          owner_id: `owner_${Date.now()}`
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-data', contractId] });
      toast({
        title: "Skutočný vlastník pridaný",
        description: "Skutočný vlastník bol úspešne pridaný.",
      });
    },
    onError: (error) => {
      console.error('Add owner error:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa pridať skutočného vlastníka.",
        variant: "destructive",
      });
    },
  });

  const updateOwner = useMutation({
    mutationFn: async ({ ownerId, updates }: { ownerId: string; updates: any }) => {
      console.log('Updating owner with owner_id:', ownerId, 'updates:', updates);
      
      const { data, error } = await supabase
        .from('actual_owners')
        .update(updates)
        .eq('owner_id', ownerId)
        .eq('contract_id', contractId)
        .select()
        .single();

      if (error) {
        console.error('Update owner error:', error);
        throw error;
      }
      
      console.log('Owner updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-data', contractId] });
      toast({
        title: "Skutočný vlastník aktualizovaný",
        description: "Skutočný vlastník bol úspešne aktualizovaný.",
      });
    },
    onError: (error) => {
      console.error('Update owner mutation error:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať skutočného vlastníka.",
        variant: "destructive",
      });
    },
  });

  const upsertOwner = useMutation({
    mutationFn: async ({ ownerId, ownerData }: { ownerId: string; ownerData: any }) => {
      console.log('Upserting owner with owner_id:', ownerId, 'data:', ownerData);
      
      const { data, error } = await supabase
        .from('actual_owners')
        .upsert([{ 
          ...ownerData,
          contract_id: contractId,
          owner_id: ownerId
        }], { 
          onConflict: 'contract_id,owner_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('Upsert owner error:', error);
        throw error;
      }
      
      console.log('Owner upserted successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-data', contractId] });
    },
    onError: (error) => {
      console.error('Upsert owner mutation error:', error);
    },
  });

  const deleteOwner = useMutation({
    mutationFn: async (ownerId: string) => {
      const { error } = await supabase
        .from('actual_owners')
        .delete()
        .eq('owner_id', ownerId)
        .eq('contract_id', contractId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-data', contractId] });
      toast({
        title: "Skutočný vlastník vymazaný",
        description: "Skutočný vlastník bol úspešne vymazaný.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa vymazať skutočného vlastníka.",
        variant: "destructive",
      });
    },
  });

  return {
    addOwner,
    updateOwner,
    upsertOwner,
    deleteOwner,
    isAdding: addOwner.isPending,
    isUpdating: updateOwner.isPending,
    isUpserting: upsertOwner.isPending,
    isDeleting: deleteOwner.isPending,
  };
};
