
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContractQueries = (contractId: string) => {
  return useQuery({
    queryKey: ['contract-complete', contractId],
    queryFn: async () => {
      console.log('Fetching complete contract data for:', contractId);
      
      const [
        { data: contract, error: contractError },
        { data: contactInfo, error: contactError },
        { data: companyInfo, error: companyError },
        { data: businessLocations, error: locationsError },
        { data: deviceSelection, error: deviceError },
        { data: contractItems, error: itemsError },
        { data: contractCalculations, error: calculationsError },
        { data: authorizedPersons, error: authPersonsError },
        { data: actualOwners, error: ownersError },
        { data: consents, error: consentsError }
      ] = await Promise.all([
        supabase.from('contracts').select('*').eq('id', contractId).single(),
        supabase.from('contact_info').select('*').eq('contract_id', contractId).maybeSingle(),
        supabase.from('company_info').select('*').eq('contract_id', contractId).maybeSingle(),
        supabase.from('business_locations').select('*').eq('contract_id', contractId),
        supabase.from('device_selection').select('*').eq('contract_id', contractId).maybeSingle(),
        supabase.from('contract_items').select(`
          *,
          contract_item_addons (*)
        `).eq('contract_id', contractId),
        supabase.from('contract_calculations').select('*').eq('contract_id', contractId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('authorized_persons').select('*').eq('contract_id', contractId),
        supabase.from('actual_owners').select('*').eq('contract_id', contractId),
        supabase.from('consents').select('*').eq('contract_id', contractId).maybeSingle()
      ]);

      if (contractError) throw contractError;
      if (contactError) throw contactError;
      if (companyError) throw companyError;
      if (locationsError) throw locationsError;
      if (deviceError) throw deviceError;
      if (itemsError) throw itemsError;
      if (calculationsError) throw calculationsError;
      if (authPersonsError) throw authPersonsError;
      if (ownersError) throw ownersError;
      if (consentsError) throw consentsError;

      console.log('Loaded contract data:', {
        contract,
        contactInfo,
        companyInfo,
        businessLocations,
        deviceSelection,
        contractItems,
        contractCalculations,
        authorizedPersons,
        actualOwners,
        consents
      });

      return {
        contract,
        contactInfo,
        companyInfo,
        businessLocations,
        deviceSelection,
        contractItems,
        contractCalculations,
        authorizedPersons,
        actualOwners,
        consents
      };
    },
    enabled: !!contractId
  });
};
