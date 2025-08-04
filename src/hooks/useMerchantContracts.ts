import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MerchantContract {
  id: string;
  contract_number: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  total_monthly_profit: number;
  contract_items_count: number;
}

export const useMerchantContracts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['merchant-contracts', user?.email],
    queryFn: async (): Promise<MerchantContract[]> => {
      if (!user?.email) return [];

      // Get merchant ID first
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('contact_person_email', user.email)
        .single();

      if (merchantError || !merchant) {
        console.error('Error fetching merchant:', merchantError);
        return [];
      }

      // Get contracts for this merchant
      const { data: contracts, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          id,
          contract_number,
          status,
          created_at,
          submitted_at,
          contract_calculations (
            total_monthly_profit
          ),
          contract_items (
            id
          )
        `)
        .eq('merchant_id', merchant.id)
        .order('created_at', { ascending: false });

      if (contractsError) {
        console.error('Error fetching contracts:', contractsError);
        return [];
      }

      return contracts?.map(contract => ({
        id: contract.id,
        contract_number: contract.contract_number,
        status: contract.status,
        created_at: contract.created_at,
        submitted_at: contract.submitted_at,
        total_monthly_profit: contract.contract_calculations?.[0]?.total_monthly_profit || 0,
        contract_items_count: contract.contract_items?.length || 0
      })) || [];
    },
    enabled: !!user?.email,
  });
};