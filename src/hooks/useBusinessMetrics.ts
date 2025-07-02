
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBusinessMetrics = () => {
  return useQuery({
    queryKey: ['business-metrics'],
    queryFn: async () => {
      console.log('Fetching business metrics...');
      
      // Get current month data
      const currentMonth = new Date();
      const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      
      // Get total merchants count
      const { data: merchantsData, error: merchantsError } = await supabase
        .from('merchants')
        .select('id, created_at');

      if (merchantsError) {
        console.error('Error fetching merchants:', merchantsError);
        throw merchantsError;
      }

      // Get contracts with calculations
      const { data: contractsData, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          id,
          status,
          created_at,
          merchant_id,
          contract_calculations (
            total_monthly_profit,
            monthly_turnover
          )
        `);

      if (contractsError) {
        console.error('Error fetching contracts:', contractsError);
        throw contractsError;
      }

      // Get business locations
      const { data: locationsData, error: locationsError } = await supabase
        .from('business_locations')
        .select('estimated_turnover, average_transaction, has_pos, created_at');

      if (locationsError) {
        console.error('Error fetching locations:', locationsError);
        throw locationsError;
      }

      // Calculate current month metrics
      const totalMerchants = merchantsData?.length || 0;
      const activeContracts = contractsData?.filter(c => 
        ['approved', 'signed', 'submitted'].includes(c.status)
      ).length || 0;

      // Calculate total monthly profit from all approved contracts
      const monthlyRevenue = contractsData
        ?.filter(c => c.status === 'approved' && c.contract_calculations?.[0])
        ?.reduce((sum, contract) => {
          const calc = Array.isArray(contract.contract_calculations) 
            ? contract.contract_calculations[0] 
            : contract.contract_calculations;
          return sum + (Number(calc?.total_monthly_profit) || 0);
        }, 0) || 0;

      // Calculate total estimated turnover
      const totalTurnover = locationsData?.reduce((sum, loc) => 
        sum + (Number(loc.estimated_turnover) || 0), 0
      ) || 0;

      // Calculate average profit per merchant
      const avgProfitPerMerchant = totalMerchants > 0 ? monthlyRevenue / totalMerchants : 0;

      // Count locations with POS
      const locationsWithPOS = locationsData?.filter(loc => loc.has_pos).length || 0;

      // Calculate growth rates (compare with last month)
      const lastMonthMerchants = merchantsData?.filter(m => 
        new Date(m.created_at) < lastMonth
      ).length || 0;
      
      const lastMonthContracts = contractsData?.filter(c => 
        new Date(c.created_at) < lastMonth
      ).length || 0;

      const merchantGrowth = lastMonthMerchants > 0 
        ? ((totalMerchants - lastMonthMerchants) / lastMonthMerchants * 100) 
        : 0;

      const contractGrowth = lastMonthContracts > 0 
        ? ((activeContracts - lastMonthContracts) / lastMonthContracts * 100) 
        : 0;

      // Mock revenue growth for now (would need historical data)
      const revenueGrowth = 12.3;
      const turnoverGrowth = 8.7;

      console.log('Business metrics calculated:', {
        totalMerchants,
        activeContracts,
        monthlyRevenue,
        totalTurnover,
        avgProfitPerMerchant,
        locationsWithPOS
      });

      return {
        totalMerchants,
        activeContracts,
        monthlyRevenue,
        totalTurnover,
        avgProfitPerMerchant,
        locationsWithPOS,
        merchantGrowth: Math.round(merchantGrowth * 10) / 10,
        contractGrowth: Math.round(contractGrowth * 10) / 10,
        revenueGrowth,
        turnoverGrowth
      };
    },
  });
};
