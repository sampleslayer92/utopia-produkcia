
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthorizedPersonsCrud = (contractId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addPerson = useMutation({
    mutationFn: async (personData: any) => {
      // Check if person already exists to prevent duplicates
      const { data: existingPerson } = await supabase
        .from('authorized_persons')
        .select('id, person_id')
        .eq('contract_id', contractId)
        .eq('person_id', personData.person_id)
        .single();

      if (existingPerson) {
        console.log('Person already exists, skipping insert:', personData.person_id);
        return existingPerson;
      }

      const { data, error } = await supabase
        .from('authorized_persons')
        .insert([{ 
          ...personData, 
          contract_id: contractId
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
      console.error('Add person error:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa pridať oprávnenú osobu.",
        variant: "destructive",
      });
    },
  });

  const updatePerson = useMutation({
    mutationFn: async ({ personId, updates }: { personId: string; updates: any }) => {
      console.log('Updating person with person_id:', personId, 'updates:', updates);
      
      const { data, error } = await supabase
        .from('authorized_persons')
        .update(updates)
        .eq('person_id', personId)
        .eq('contract_id', contractId)
        .select()
        .single();

      if (error) {
        console.error('Update person error:', error);
        throw error;
      }
      
      console.log('Person updated successfully:', data);
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
      console.error('Update person mutation error:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať oprávnenú osobu.",
        variant: "destructive",
      });
    },
  });

  const upsertPerson = useMutation({
    mutationFn: async ({ personId, personData }: { personId: string; personData: any }) => {
      console.log('Upserting person with person_id:', personId, 'data:', personData);
      
      // First, check if the person already exists
      const { data: existingPerson } = await supabase
        .from('authorized_persons')
        .select('id, person_id')
        .eq('contract_id', contractId)
        .eq('person_id', personId)
        .maybeSingle();

      if (existingPerson) {
        // Update existing person
        console.log('Updating existing person:', personId);
        const { data, error } = await supabase
          .from('authorized_persons')
          .update(personData)
          .eq('person_id', personId)
          .eq('contract_id', contractId)
          .select()
          .single();

        if (error) {
          console.error('Update existing person error:', error);
          throw error;
        }
        
        console.log('Person updated successfully:', data);
        return data;
      } else {
        // Insert new person
        console.log('Inserting new person:', personId);
        const { data, error } = await supabase
          .from('authorized_persons')
          .insert([{ 
            ...personData,
            contract_id: contractId,
            person_id: personId
          }])
          .select()
          .single();

        if (error) {
          console.error('Insert new person error:', error);
          throw error;
        }
        
        console.log('Person inserted successfully:', data);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-data', contractId] });
    },
    onError: (error) => {
      console.error('Upsert person mutation error:', error);
    },
  });

  const deletePerson = useMutation({
    mutationFn: async (personId: string) => {
      const { error } = await supabase
        .from('authorized_persons')
        .delete()
        .eq('person_id', personId)
        .eq('contract_id', contractId);

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
    upsertPerson,
    deletePerson,
    isAdding: addPerson.isPending,
    isUpdating: updatePerson.isPending,
    isUpserting: upsertPerson.isPending,
    isDeleting: deletePerson.isPending,
  };
};
