
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContractBasicData = (contractId: string) => {
  return useQuery({
    queryKey: ['contract-basic', contractId],
    queryFn: async () => {
      console.log('Fetching basic contract data for:', contractId);
      
      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .single();

      if (contractError) throw contractError;
      
      return contract;
    },
    enabled: !!contractId
  });
};
