
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      console.log('Fetching admin dashboard statistics...');
      
      const [contractsResponse, merchantsResponse, calculationsResponse] = await Promise.all([
        supabase.from('contracts').select('status, created_at'),
        supabase.from('merchants').select('id, created_at'),
        supabase.from('contract_calculations').select('total_monthly_profit')
      ]);

      if (contractsResponse.error) throw contractsResponse.error;
      if (merchantsResponse.error) throw merchantsResponse.error;
      if (calculationsResponse.error) throw calculationsResponse.error;

      const contracts = contractsResponse.data;
      const merchants = merchantsResponse.data;
      const calculations = calculationsResponse.data;

      // Calculate contract stats
      const totalContracts = contracts.length;
      const signedContracts = contracts.filter(c => c.status === 'signed').length;
      const pendingContracts = contracts.filter(c => c.status === 'submitted').length;
      
      // Calculate revenue
      const monthlyRevenue = calculations.reduce((sum, calc) => sum + (calc.total_monthly_profit || 0), 0);
      
      // Calculate growth (contracts from last 30 days vs previous 30 days)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      
      const recentContracts = contracts.filter(c => 
        new Date(c.created_at) > thirtyDaysAgo
      ).length;
      
      const previousPeriodContracts = contracts.filter(c => {
        const date = new Date(c.created_at);
        return date > sixtyDaysAgo && date <= thirtyDaysAgo;
      }).length;
      
      const contractGrowth = previousPeriodContracts === 0 ? 100 : 
        ((recentContracts - previousPeriodContracts) / previousPeriodContracts) * 100;

      return {
        totalContracts,
        signedContracts,
        pendingContracts,
        totalMerchants: merchants.length,
        monthlyRevenue,
        contractGrowth: Math.round(contractGrowth * 100) / 100
      };
    },
  });
};

export const useContractsStats = () => {
  return useQuery({
    queryKey: ['contracts-stats'],
    queryFn: async () => {
      console.log('Fetching contracts page statistics...');
      
      const [contractsResponse, calculationsResponse] = await Promise.all([
        supabase.from('contracts').select('status, created_at'),
        supabase.from('contract_calculations').select('total_monthly_profit')
      ]);

      if (contractsResponse.error) throw contractsResponse.error;
      if (calculationsResponse.error) throw calculationsResponse.error;

      const contracts = contractsResponse.data;
      const calculations = calculationsResponse.data;

      const activeContracts = contracts.filter(c => c.status === 'signed').length;
      const totalValue = calculations.reduce((sum, calc) => sum + (calc.total_monthly_profit || 0), 0);
      
      // Count contracts older than 11 months
      const elevenMonthsAgo = new Date();
      elevenMonthsAgo.setMonth(elevenMonthsAgo.getMonth() - 11);
      const expiringContracts = contracts.filter(c => 
        new Date(c.created_at) < elevenMonthsAgo && c.status === 'signed'
      ).length;

      return {
        activeContracts,
        totalValue,
        expiringContracts
      };
    },
  });
};
