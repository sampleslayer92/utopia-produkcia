
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBusinessMetrics = () => {
  return useQuery({
    queryKey: ['business-metrics'],
    queryFn: async () => {
      console.log('Fetching business metrics...');
      
      // Get contract calculations for revenue data
      const { data: calculations, error: calcError } = await supabase
        .from('contract_calculations')
        .select(`
          total_monthly_profit,
          monthly_turnover,
          contract_id,
          contracts!inner (
            status,
            created_at
          )
        `)
        .eq('contracts.status', 'approved');

      if (calcError) {
        console.error('Error fetching calculations:', calcError);
        throw calcError;
      }

      // Get business locations for transaction data
      const { data: locations, error: locError } = await supabase
        .from('business_locations')
        .select(`
          estimated_turnover,
          average_transaction,
          contract_id,
          contracts!inner (
            status
          )
        `)
        .eq('contracts.status', 'approved');

      if (locError) {
        console.error('Error fetching locations:', locError);
        throw locError;
      }

      // Calculate metrics
      const monthlyRevenue = calculations?.reduce((sum, calc) => 
        sum + (Number(calc.total_monthly_profit) || 0), 0
      ) || 0;

      const monthlyTransactions = locations?.reduce((sum, loc) => 
        sum + (Number(loc.estimated_turnover) || 0), 0
      ) || 0;

      const averageProfit = calculations?.length > 0 
        ? monthlyRevenue / calculations.length 
        : 0;

      const activeClients = calculations?.length || 0;

      // Mock growth percentages (in real app, compare with previous month)
      const revenueGrowth = 12.5;
      const transactionGrowth = 8.3;
      const profitGrowth = 15.2;
      const clientGrowth = 6.7;

      console.log('Business metrics calculated:', {
        monthlyRevenue,
        monthlyTransactions,
        averageProfit,
        activeClients
      });

      return {
        monthlyRevenue,
        monthlyTransactions,
        averageProfit,
        activeClients,
        revenueGrowth,
        transactionGrowth,
        profitGrowth,
        clientGrowth
      };
    },
  });
};
