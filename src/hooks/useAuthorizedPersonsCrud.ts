
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthorizedPersonsCrud = (contractId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addPerson = useMutation({
    mutationFn: async (personData: any) => {
      const { data, error } = await supabase
        .from('authorized_persons')
        .insert([{ 
          ...personData, 
          contract_id: contractId,
          person_id: `person_${Date.now()}`
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-data', contractId] });
      toast({
        title: "Oprávnená osoba pridaná",
        description: "Oprávnená osoba bola úspešne pridaná.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa pridať oprávnenú osobu.",
        variant: "destructive",
      });
    },
  });

  const updatePerson = useMutation({
    mutationFn: async ({ personId, updates }: { personId: string; updates: any }) => {
      const { data, error } = await supabase
        .from('authorized_persons')
        .update(updates)
        .eq('id', personId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-data', contractId] });
      toast({
        title: "Oprávnená osoba aktualizovaná",
        description: "Oprávnená osoba bola úspešne aktualizovaná.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať oprávnenú osobu.",
        variant: "destructive",
      });
    },
  });

  const deletePerson = useMutation({
    mutationFn: async (personId: string) => {
      const { error } = await supabase
        .from('authorized_persons')
        .delete()
        .eq('id', personId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-data', contractId] });
      toast({
        title: "Oprávnená osoba vymazaná",
        description: "Oprávnená osoba bola úspešne vymazaná.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa vymazať oprávnenú osobu.",
        variant: "destructive",
      });
    },
  });

  return {
    addPerson,
    updatePerson,
    deletePerson,
    isAdding: addPerson.isPending,
    isUpdating: updatePerson.isPending,
    isDeleting: deletePerson.isPending,
  };
};
