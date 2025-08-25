
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

export const useMerchantsStats = () => {
  return useQuery({
    queryKey: ['merchants-stats'],
    queryFn: async () => {
      console.log('Fetching merchants page statistics...');
      
      const [merchantsResponse, calculationsResponse, contractsResponse] = await Promise.all([
        supabase.from('merchants').select('id, created_at'),
        supabase.from('contract_calculations').select('total_monthly_profit'),
        supabase.from('contracts').select('merchant_id, status')
      ]);

      if (merchantsResponse.error) throw merchantsResponse.error;
      if (calculationsResponse.error) throw calculationsResponse.error;
      if (contractsResponse.error) throw contractsResponse.error;

      const merchants = merchantsResponse.data;
      const calculations = calculationsResponse.data;
      const contracts = contractsResponse.data;

      const totalMerchants = merchants.length;
      const totalValue = calculations.reduce((sum, calc) => sum + (calc.total_monthly_profit || 0), 0);
      const activeMerchants = new Set(contracts.filter(c => c.status === 'signed').map(c => c.merchant_id)).size;

      return {
        totalMerchants,
        activeMerchants,
        totalValue
      };
    },
  });
};

export const useBusinessLocationsStats = () => {
  return useQuery({
    queryKey: ['business-locations-stats'],
    queryFn: async () => {
      console.log('Fetching business locations statistics...');
      
      const { data: locations, error } = await supabase
        .from('business_locations')
        .select('id, monthly_turnover, created_at');

      if (error) throw error;

      const totalLocations = locations.length;
      const totalTurnover = locations.reduce((sum, loc) => sum + (loc.monthly_turnover || 0), 0);
      const averageTurnover = totalLocations > 0 ? totalTurnover / totalLocations : 0;

      return {
        totalLocations,
        totalTurnover,
        averageTurnover
      };
    },
  });
};
