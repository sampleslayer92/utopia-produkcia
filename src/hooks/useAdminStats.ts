import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Contracts stats
export const useContractsStats = () => {
  return useQuery({
    queryKey: ['contracts-stats'],
    queryFn: async () => {
      // Get active contracts count
      const { data: activeContracts, error: activeError } = await supabase
        .from('contracts')
        .select('id', { count: 'exact' })
        .in('status', ['approved', 'signed', 'in_progress']);

      if (activeError) throw activeError;

      // Get total contract value
      const { data: contractCalculations, error: calcError } = await supabase
        .from('contract_calculations')
        .select('total_monthly_profit');

      if (calcError) throw calcError;

      const totalValue = contractCalculations?.reduce((sum, calc) => sum + (calc.total_monthly_profit || 0), 0) || 0;

      // Get expiring contracts (contracts created more than 11 months ago)
      const elevenMonthsAgo = new Date();
      elevenMonthsAgo.setMonth(elevenMonthsAgo.getMonth() - 11);
      
      const { data: expiringContracts, error: expiringError } = await supabase
        .from('contracts')
        .select('id', { count: 'exact' })
        .lt('created_at', elevenMonthsAgo.toISOString())
        .in('status', ['approved', 'signed']);

      if (expiringError) throw expiringError;

      return {
        activeContracts: activeContracts?.length || 0,
        totalValue,
        expiringContracts: expiringContracts?.length || 0
      };
    }
  });
};

// Merchants stats
export const useMerchantsStats = () => {
  return useQuery({
    queryKey: ['merchants-stats'],
    queryFn: async () => {
      // Get total merchants count
      const { data: allMerchants, error: allError } = await supabase
        .from('merchants')
        .select('id', { count: 'exact' });

      if (allError) throw allError;

      // Get merchants with contracts - using join approach
      const { data: merchantsWithContracts, error: contractsError } = await supabase
        .from('contracts')
        .select('merchant_id', { count: 'exact' })
        .not('merchant_id', 'is', null);

      if (contractsError) throw contractsError;

      // Get average profit
      const { data: contractCalculations, error: calcError } = await supabase
        .from('contract_calculations')
        .select('total_monthly_profit');

      if (calcError) throw calcError;

      const totalProfit = contractCalculations?.reduce((sum, calc) => sum + (calc.total_monthly_profit || 0), 0) || 0;
      const averageProfit = allMerchants?.length ? totalProfit / allMerchants.length : 0;

      return {
        totalMerchants: allMerchants?.length || 0,
        activeWithContracts: merchantsWithContracts?.length || 0,
        averageProfit
      };
    }
  });
};

// Business locations stats
export const useBusinessLocationsStats = () => {
  return useQuery({
    queryKey: ['business-locations-stats'],
    queryFn: async () => {
      // Get total locations count
      const { data: allLocations, error: allError } = await supabase
        .from('business_locations')
        .select('id, has_pos, estimated_turnover', { count: 'exact' });

      if (allError) throw allError;

      // Get locations with POS
      const locationsWithPOS = allLocations?.filter(loc => loc.has_pos).length || 0;

      // Calculate average turnover
      const totalTurnover = allLocations?.reduce((sum, loc) => sum + (loc.estimated_turnover || 0), 0) || 0;
      const averageTurnover = allLocations?.length ? totalTurnover / allLocations.length : 0;

      return {
        totalLocations: allLocations?.length || 0,
        withPOS: locationsWithPOS,
        averageTurnover
      };
    }
  });
};