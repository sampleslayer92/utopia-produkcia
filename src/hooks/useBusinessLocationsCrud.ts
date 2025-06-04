
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBusinessLocationsCrud = (contractId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addLocation = useMutation({
    mutationFn: async (locationData: any) => {
      console.log('Adding location with data:', locationData);
      
      const { data, error } = await supabase
        .from('business_locations')
        .insert([{ 
          contract_id: contractId,
          location_id: `loc_${Date.now()}`,
          name: locationData.name,
          address_street: locationData.addressStreet,
          address_city: locationData.addressCity,
          address_zip_code: locationData.addressZipCode,
          iban: locationData.iban,
          business_sector: locationData.businessSector,
          contact_person_name: locationData.contactPersonName,
          contact_person_phone: locationData.contactPersonPhone,
          contact_person_email: locationData.contactPersonEmail,
          has_pos: locationData.hasPos,
          estimated_turnover: locationData.estimatedTurnover,
          average_transaction: locationData.averageTransaction,
          seasonality: locationData.seasonality,
          seasonal_weeks: locationData.seasonalWeeks,
          opening_hours: locationData.openingHours
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding location:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      // Use the same query key as useContractQueries
      queryClient.invalidateQueries({ queryKey: ['contract-complete', contractId] });
      toast({
        title: "Prevádzka pridaná",
        description: "Prevádzka bola úspešne pridaná.",
      });
    },
    onError: (error) => {
      console.error('Add location error:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa pridať prevádzku.",
        variant: "destructive",
      });
    },
  });

  const updateLocation = useMutation({
    mutationFn: async ({ locationId, updates }: { locationId: string; updates: any }) => {
      console.log('Updating location:', locationId, updates);
      
      const { data, error } = await supabase
        .from('business_locations')
        .update({
          name: updates.name,
          address_street: updates.addressStreet,
          address_city: updates.addressCity,
          address_zip_code: updates.addressZipCode,
          iban: updates.iban,
          business_sector: updates.businessSector,
          contact_person_name: updates.contactPersonName,
          contact_person_phone: updates.contactPersonPhone,
          contact_person_email: updates.contactPersonEmail,
          has_pos: updates.hasPos,
          estimated_turnover: updates.estimatedTurnover,
          average_transaction: updates.averageTransaction,
          seasonality: updates.seasonality,
          seasonal_weeks: updates.seasonalWeeks,
          opening_hours: updates.openingHours
        })
        .eq('id', locationId)
        .select()
        .single();

      if (error) {
        console.error('Error updating location:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-complete', contractId] });
      toast({
        title: "Prevádzka aktualizovaná",
        description: "Prevádzka bola úspešne aktualizovaná.",
      });
    },
    onError: (error) => {
      console.error('Update location error:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať prevádzku.",
        variant: "destructive",
      });
    },
  });

  const deleteLocation = useMutation({
    mutationFn: async (locationId: string) => {
      console.log('Deleting location with ID:', locationId);
      
      const { error } = await supabase
        .from('business_locations')
        .delete()
        .eq('id', locationId);

      if (error) {
        console.error('Error deleting location:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-complete', contractId] });
      toast({
        title: "Prevádzka vymazaná",
        description: "Prevádzka bola úspešne vymazaná.",
      });
    },
    onError: (error) => {
      console.error('Delete location error:', error);
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
