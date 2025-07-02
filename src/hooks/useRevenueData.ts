
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRevenueData = () => {
  return useQuery({
    queryKey: ['revenue-data'],
    queryFn: async () => {
      console.log('Fetching revenue data...');
      
      // Get contracts with calculations grouped by month
      const { data: contractsData, error } = await supabase
        .from('contracts')
        .select(`
          id,
          status,
          created_at,
          contract_calculations (
            total_monthly_profit,
            monthly_turnover
          )
        `)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching revenue data:', error);
        throw error;
      }

      // Group by month and calculate totals
      const monthlyData = new Map();
      
      contractsData?.forEach(contract => {
        const date = new Date(contract.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            month: date.toLocaleDateString('sk-SK', { month: 'short', year: 'numeric' }),
            revenue: 0,
            profit: 0,
            contracts: 0,
            activeContracts: 0
          });
        }
        
        const existing = monthlyData.get(monthKey);
        existing.contracts += 1;
        
        if (['approved', 'signed'].includes(contract.status)) {
          existing.activeContracts += 1;
          
          // Add calculation data if available
          const calc = Array.isArray(contract.contract_calculations) 
            ? contract.contract_calculations[0] 
            : contract.contract_calculations;
            
          if (calc) {
            existing.revenue += Number(calc.monthly_turnover) || 0;
            existing.profit += Number(calc.total_monthly_profit) || 0;
          }
        }
      });

      // Convert to arrays for charts and fill missing months
      const allMonths = Array.from(monthlyData.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12); // Last 12 months

      const monthlyTrend = allMonths.map(([_, data]) => ({
        month: data.month,
        revenue: Math.round(data.revenue),
        contracts: data.contracts,
        activeContracts: data.activeContracts
      }));

      const profitTrend = allMonths.map(([_, data]) => ({
        month: data.month,
        profit: Math.round(data.profit),
        contracts: data.activeContracts
      }));

      console.log('Revenue data processed:', { monthlyTrend, profitTrend });

      return {
        monthlyTrend: monthlyTrend.slice(-6), // Last 6 months for line chart
        profitTrend: profitTrend.slice(-6),   // Last 6 months for bar chart
        yearlyTrend: monthlyTrend            // Full year for overview
      };
    },
  });
};
