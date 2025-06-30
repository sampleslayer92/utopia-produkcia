
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MerchantContract {
  id: string;
  contract_number: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  total_monthly_profit: number;
  contract_items_count: number;
  total_devices: number;
}

export const useMerchantContracts = (merchantId?: string) => {
  return useQuery({
    queryKey: ['merchant-contracts', merchantId],
    queryFn: async (): Promise<MerchantContract[]> => {
      if (!merchantId) {
        console.log('No merchant ID provided');
        return [];
      }

      console.log('Fetching contracts for merchant:', merchantId);
      
      // Get merchant's contracts with calculations and items
      const { data: contracts, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          id,
          contract_number,
          status,
          created_at,
          submitted_at,
          contract_calculations(
            total_monthly_profit
          ),
          contract_items(
            id,
            count
          )
        `)
        .eq('merchant_id', merchantId)
        .order('created_at', { ascending: false });

      if (contractsError) {
        console.error('Error fetching merchant contracts:', contractsError);
        throw contractsError;
      }

      // Process contracts data
      const processedContracts = (contracts || []).map(contract => {
        const calculations = contract.contract_calculations || [];
        const items = contract.contract_items || [];
        
        const totalMonthlyProfit = calculations.reduce((sum, calc) => 
          sum + (Number(calc.total_monthly_profit) || 0), 0);
        
        const contractItemsCount = items.reduce((sum, item) => 
          sum + (Number(item.count) || 0), 0);

        return {
          id: contract.id,
          contract_number: contract.contract_number,
          status: contract.status,
          created_at: contract.created_at,
          submitted_at: contract.submitted_at,
          total_monthly_profit: totalMonthlyProfit,
          contract_items_count: contractItemsCount,
          total_devices: contractItemsCount
        };
      });

      console.log('Processed merchant contracts:', processedContracts);
      return processedContracts;
    },
    enabled: !!merchantId,
  });
};
