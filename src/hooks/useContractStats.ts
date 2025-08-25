
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContractStats = () => {
  return useQuery({
    queryKey: ['contract-stats'],
    queryFn: async () => {
      console.log('Fetching contract statistics...');
      
      // Get basic contract counts
      const { data: contracts, error: contractsError } = await supabase
        .from('contracts')
        .select('status, created_at');

      if (contractsError) throw contractsError;

      // Get total contract value from calculations
      const { data: calculations, error: calculationsError } = await supabase
        .from('contract_calculations')
        .select('total_monthly_profit');

      if (calculationsError) throw calculationsError;

      const total = contracts.length;
      const signed = contracts.filter(c => c.status === 'signed').length;
      const submitted = contracts.filter(c => c.status === 'submitted').length;
      const approved = contracts.filter(c => c.status === 'approved').length;
      const draft = contracts.filter(c => c.status === 'draft').length;
      const rejected = contracts.filter(c => c.status === 'rejected').length;
      const lost = contracts.filter(c => c.status === 'lost').length;

      // Calculate total monthly value
      const totalValue = calculations.reduce((sum, calc) => sum + (calc.total_monthly_profit || 0), 0);

      // Count contracts created in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentContracts = contracts.filter(c => 
        new Date(c.created_at) > thirtyDaysAgo
      ).length;

      // Count contracts older than 11 months (expiring)
      const elevenMonthsAgo = new Date();
      elevenMonthsAgo.setMonth(elevenMonthsAgo.getMonth() - 11);
      const expiringContracts = contracts.filter(c => 
        new Date(c.created_at) < elevenMonthsAgo && c.status === 'signed'
      ).length;

      return {
        total,
        signed,
        submitted,
        approved,
        draft,
        rejected,
        lost,
        activeContracts: signed,
        totalValue,
        recentContracts,
        expiringContracts
      };
    },
  });
};
