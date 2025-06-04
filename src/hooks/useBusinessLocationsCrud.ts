
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBusinessLocationsCrud = (contractId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addLocation = useMutation({
    mutationFn: async (locationData: any) => {
      const { data, error } = await supabase
        .from('business_locations')
        .insert([{ 
          ...locationData, 
          contract_id: contractId,
          location_id: `loc_${Date.now()}`
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-data', contractId] });
      toast({
        title: "Prevádzka pridaná",
        description: "Prevádzka bola úspešne pridaná.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa pridať prevádzku.",
        variant: "destructive",
      });
    },
  });

  const updateLocation = useMutation({
    mutationFn: async ({ locationId, updates }: { locationId: string; updates: any }) => {
      const { data, error } = await supabase
        .from('business_locations')
        .update(updates)
        .eq('id', locationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-data', contractId] });
      toast({
        title: "Prevádzka aktualizovaná",
        description: "Prevádzka bola úspešne aktualizovaná.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať prevádzku.",
        variant: "destructive",
      });
    },
  });

  const deleteLocation = useMutation({
    mutationFn: async (locationId: string) => {
      const { error } = await supabase
        .from('business_locations')
        .delete()
        .eq('id', locationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-data', contractId] });
      toast({
        title: "Prevádzka vymazaná",
        description: "Prevádzka bola úspešne vymazaná.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa vymazať prevádzku.",
        variant: "destructive",
      });
    },
  });

  return {
    addLocation,
    updateLocation,
    deleteLocation,
    isAdding: addLocation.isPending,
    isUpdating: updateLocation.isPending,
    isDeleting: deleteLocation.isPending,
  };
};
