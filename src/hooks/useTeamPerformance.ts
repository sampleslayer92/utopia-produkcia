
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTeamPerformance = () => {
  return useQuery({
    queryKey: ['team-performance'],
    queryFn: async () => {
      console.log('Fetching team performance...');
      
      // Get contracts with contact info to track sales people
      const { data: contracts, error } = await supabase
        .from('contracts')
        .select(`
          id,
          status,
          created_at,
          contact_info (
            sales_note
          ),
          contract_calculations (
            total_monthly_profit
          )
        `)
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      if (error) {
        console.error('Error fetching team performance:', error);
        throw error;
      }

      // Mock team data (in real app, this would come from a team table)
      const teamMembers = [
        {
          name: 'Peter Novák',
          role: 'Senior Sales Manager',
          avatar: '',
          monthlyTarget: 15,
          revenueTarget: 25000,
          contractsThisMonth: 12,
          revenueGenerated: 22500,
          performance: 80
        },
        {
          name: 'Mária Svobodová',
          role: 'Sales Representative',
          avatar: '',
          monthlyTarget: 10,
          revenueTarget: 18000,
          contractsThisMonth: 11,
          revenueGenerated: 19800,
          performance: 95
        },
        {
          name: 'Ján Kováč',
          role: 'Business Developer',
          avatar: '',
          monthlyTarget: 8,
          revenueTarget: 15000,
          contractsThisMonth: 6,
          revenueGenerated: 11250,
          performance: 65
        },
        {
          name: 'Eva Horáková',
          role: 'Sales Representative',
          avatar: '',
          monthlyTarget: 12,
          revenueTarget: 20000,
          contractsThisMonth: 14,
          revenueGenerated: 23500,
          performance: 98
        }
      ];

      console.log('Team performance data:', { members: teamMembers });

      return {
        members: teamMembers,
        totalContracts: contracts?.length || 0,
        totalRevenue: contracts?.reduce((sum, contract) => {
          const profit = contract.contract_calculations?.[0]?.total_monthly_profit || 0;
          return sum + Number(profit);
        }, 0) || 0
      };
    },
  });
};
