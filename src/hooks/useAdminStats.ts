
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      console.log('Fetching admin stats...');
      
      const [contractsResult, merchantsResult, locationsResult] = await Promise.all([
        supabase.from('contracts').select('id, status'),
        supabase.from('merchants').select('id'),
        supabase.from('business_locations').select('id')
      ]);

      if (contractsResult.error) throw contractsResult.error;
      if (merchantsResult.error) throw merchantsResult.error;
      if (locationsResult.error) throw locationsResult.error;

      const totalContracts = contractsResult.data?.length || 0;
      const signedContracts = contractsResult.data?.filter(c => c.status === 'signed').length || 0;
      const totalMerchants = merchantsResult.data?.length || 0;
      const totalLocations = locationsResult.data?.length || 0;

      return {
        totalContracts,
        signedContracts,
        pendingContracts: totalContracts - signedContracts,
        totalMerchants,
        totalLocations,
        conversionRate: totalContracts > 0 ? Math.round((signedContracts / totalContracts) * 100) : 0
      };
    },
  });
};

export const useContractStats = () => {
  return useQuery({
    queryKey: ['contract-stats'],
    queryFn: async () => {
      console.log('Fetching contract stats...');
      
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          id,
          status,
          created_at,
          contract_calculations (
            total_monthly_profit
          )
        `);

      if (error) throw error;

      const totalContracts = data?.length || 0;
      const signedContracts = data?.filter(c => c.status === 'signed').length || 0;
      const draftContracts = data?.filter(c => c.status === 'draft').length || 0;
      const submittedContracts = data?.filter(c => c.status === 'submitted').length || 0;

      // Calculate total monthly value
      const totalMonthlyValue = data?.reduce((sum, contract) => {
        const calculations = Array.isArray(contract.contract_calculations) 
          ? contract.contract_calculations[0] 
          : contract.contract_calculations;
        return sum + (calculations?.total_monthly_profit || 0);
      }, 0) || 0;

      return {
        totalContracts,
        signedContracts,
        draftContracts,
        submittedContracts,
        totalMonthlyValue,
        averageValue: totalContracts > 0 ? totalMonthlyValue / totalContracts : 0
      };
    },
  });
};

export const useMerchantsStats = () => {
  return useQuery({
    queryKey: ['merchants-stats'],
    queryFn: async () => {
      console.log('Fetching merchants stats...');
      
      const [merchantsResult, contractsResult] = await Promise.all([
        supabase.from('merchants').select('id, company_name'),
        supabase.from('contracts').select('id, merchant_id, contract_calculations(total_monthly_profit)')
      ]);

      if (merchantsResult.error) throw merchantsResult.error;
      if (contractsResult.error) throw contractsResult.error;

      const totalMerchants = merchantsResult.data?.length || 0;
      const activeMerchants = merchantsResult.data?.length || 0; // Assuming all are active for now
      const activeWithContracts = contractsResult.data?.filter(c => c.merchant_id).length || 0;

      // Calculate total value from contracts
      const totalValue = contractsResult.data?.reduce((sum, contract) => {
        const calculations = Array.isArray(contract.contract_calculations) 
          ? contract.contract_calculations[0] 
          : contract.contract_calculations;
        return sum + (calculations?.total_monthly_profit || 0);
      }, 0) || 0;

      const averageProfit = activeWithContracts > 0 ? totalValue / activeWithContracts : 0;

      return {
        totalMerchants,
        activeMerchants,
        totalValue,
        activeWithContracts,
        averageProfit
      };
    },
  });
};

export const useBusinessLocationsStats = () => {
  return useQuery({
    queryKey: ['business-locations-stats'],
    queryFn: async () => {
      console.log('Fetching business locations stats...');
      
      const { data, error } = await supabase
        .from('business_locations')
        .select('id, has_pos_system');

      if (error) throw error;

      const totalLocations = data?.length || 0;
      const withPOS = data?.filter(location => location.has_pos_system).length || 0;
      
      // Since we don't have monthly_turnover in the table, we'll use placeholder values
      const totalTurnover = totalLocations * 15000; // Average turnover placeholder
      const averageTurnover = totalLocations > 0 ? totalTurnover / totalLocations : 0;

      return {
        totalLocations,
        totalTurnover,
        averageTurnover,
        withPOS
      };
    },
  });
};
