
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContractDetail = (contractId: string) => {
  return useQuery({
    queryKey: ['contract-detail', contractId],
    queryFn: async () => {
      console.log('Fetching complete contract detail for:', contractId);
      
      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .select(`
          *,
          contact_info (*),
          company_info (*),
          business_locations (*),
          device_selection (*),
          contract_items (
            *,
            contract_item_addons (*)
          ),
          contract_calculations (*),
          authorized_persons (*),
          actual_owners (*),
          consents (*),
          merchants (*),
          creator_profile:profiles!created_by (
            first_name,
            last_name,
            email
          )
        `)
        .eq('id', contractId)
        .single();

      if (contractError) throw contractError;

      console.log('Contract detail loaded:', contract);
      return contract;
    },
    enabled: !!contractId
  });
};
