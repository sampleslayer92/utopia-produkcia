
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

      // Enhanced mock team data with more details for member pages
      const teamMembers = [
        {
          id: 1,
          name: 'Peter Novák',
          role: 'Senior Sales Manager',
          avatar: '',
          email: 'peter.novak@company.com',
          phone: '+421 901 234 567',
          monthlyTarget: 15,
          revenueTarget: 25000,
          contractsThisMonth: 12,
          revenueGenerated: 22500,
          performance: 80,
          joinedDate: '2023-01-15',
          location: 'Bratislava, Slovakia'
        },
        {
          id: 2,
          name: 'Mária Svobodová',
          role: 'Sales Representative',
          avatar: '',
          email: 'maria.svobodova@company.com',
          phone: '+421 902 345 678',
          monthlyTarget: 10,
          revenueTarget: 18000,
          contractsThisMonth: 11,
          revenueGenerated: 19800,
          performance: 95,
          joinedDate: '2023-03-20',
          location: 'Košice, Slovakia'
        },
        {
          id: 3,
          name: 'Ján Kováč',
          role: 'Business Developer',
          avatar: '',
          email: 'jan.kovac@company.com',
          phone: '+421 903 456 789',
          monthlyTarget: 8,
          revenueTarget: 15000,
          contractsThisMonth: 6,
          revenueGenerated: 11250,
          performance: 65,
          joinedDate: '2023-05-10',
          location: 'Žilina, Slovakia'
        },
        {
          id: 4,
          name: 'Eva Horáková',
          role: 'Sales Representative',
          avatar: '',
          email: 'eva.horakova@company.com',
          phone: '+421 904 567 890',
          monthlyTarget: 12,
          revenueTarget: 20000,
          contractsThisMonth: 14,
          revenueGenerated: 23500,
          performance: 98,
          joinedDate: '2022-11-05',
          location: 'Banská Bystrica, Slovakia'
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
