
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRevenueData = () => {
  return useQuery({
    queryKey: ['revenue-data'],
    queryFn: async () => {
      console.log('Fetching revenue data...');
      
      // Get contract calculations with dates
      const { data: calculations, error } = await supabase
        .from('contract_calculations')
        .select(`
          total_monthly_profit,
          monthly_turnover,
          created_at,
          contracts!inner (
            status,
            created_at
          )
        `)
        .eq('contracts.status', 'approved')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching revenue data:', error);
        throw error;
      }

      // Group by month and calculate totals
      const monthlyData = new Map();
      
      calculations?.forEach(calc => {
        const date = new Date(calc.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            month: date.toLocaleDateString('sk-SK', { month: 'short', year: 'numeric' }),
            revenue: 0,
            profit: 0,
            contracts: 0
          });
        }
        
        const existing = monthlyData.get(monthKey);
        existing.revenue += Number(calc.monthly_turnover) || 0;
        existing.profit += Number(calc.total_monthly_profit) || 0;
        existing.contracts += 1;
      });

      // Convert to arrays for charts
      const monthlyTrend = Array.from(monthlyData.values()).slice(-6); // Last 6 months
      const profitTrend = Array.from(monthlyData.values()).slice(-6);

      console.log('Revenue data processed:', { monthlyTrend, profitTrend });

      return {
        monthlyTrend,
        profitTrend
      };
    },
  });
};
