
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
      toast({
        title: "Chyba",
        description: "Nepodarilo sa pridať skutočného vlastníka.",
        variant: "destructive",
      });
    },
  });

  const updateOwner = useMutation({
    mutationFn: async ({ ownerId, updates }: { ownerId: string; updates: any }) => {
      const { data, error } = await supabase
        .from('actual_owners')
        .update(updates)
        .eq('id', ownerId)
        .select()
        .single();

      if (error) throw error;
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
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať skutočného vlastníka.",
        variant: "destructive",
      });
    },
  });

  const deleteOwner = useMutation({
    mutationFn: async (ownerId: string) => {
      const { error } = await supabase
        .from('actual_owners')
        .delete()
        .eq('id', ownerId);

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
    deleteOwner,
    isAdding: addOwner.isPending,
    isUpdating: updateOwner.isPending,
    isDeleting: deleteOwner.isPending,
  };
};
