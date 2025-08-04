import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MerchantStats {
  totalContracts: number;
  activeContracts: number;
  totalMonthlyProfit: number;
  averageContractValue: number;
}

export const useMerchantStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['merchant-stats', user?.email],
    queryFn: async (): Promise<MerchantStats> => {
      if (!user?.email) {
        return {
          totalContracts: 0,
          activeContracts: 0,
          totalMonthlyProfit: 0,
          averageContractValue: 0
        };
      }

      // Get merchant ID first
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('contact_person_email', user.email)
        .single();

      if (merchantError || !merchant) {
        console.error('Error fetching merchant:', merchantError);
        return {
          totalContracts: 0,
          activeContracts: 0,
          totalMonthlyProfit: 0,
          averageContractValue: 0
        };
      }

      // Get contract statistics
      const { data: contracts, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          id,
          status,
          contract_calculations (
            total_monthly_profit
          )
        `)
        .eq('merchant_id', merchant.id);

      if (contractsError) {
        console.error('Error fetching contract stats:', contractsError);
        return {
          totalContracts: 0,
          activeContracts: 0,
          totalMonthlyProfit: 0,
          averageContractValue: 0
        };
      }

      const totalContracts = contracts?.length || 0;
      const activeContracts = contracts?.filter(c => c.status === 'signed' || c.status === 'approved').length || 0;
      const totalMonthlyProfit = contracts?.reduce((sum, contract) => {
        return sum + (contract.contract_calculations?.[0]?.total_monthly_profit || 0);
      }, 0) || 0;
      
      const averageContractValue = totalContracts > 0 ? totalMonthlyProfit / totalContracts : 0;

      return {
        totalContracts,
        activeContracts,
        totalMonthlyProfit,
        averageContractValue
      };
    },
    enabled: !!user?.email,
  });
};