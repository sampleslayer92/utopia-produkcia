import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessMetrics } from "./useBusinessMetrics";

export interface ActivityItem {
  id: string;
  type: 'contract' | 'merchant' | 'system' | 'user';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface ChartDataPoint {
  month: string;
  revenue: number;
  contracts: number;
  merchants: number;
}

export const useDesignDashboardData = () => {
  const businessMetrics = useBusinessMetrics();

  // Recent activity feed
  const { data: recentActivity = [], isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: async () => {
      const activities: ActivityItem[] = [];

      // Recent contracts
      const { data: recentContracts } = await supabase
        .from('contracts')
        .select('id, contract_number, status, created_at, merchants(company_name)')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentContracts) {
        recentContracts.forEach(contract => {
          activities.push({
            id: `contract-${contract.id}`,
            type: 'contract',
            title: `Nový kontrakt ${contract.contract_number}`,
            description: `Kontrakt pre ${contract.merchants?.company_name || 'Unknown'} - ${contract.status}`,
            timestamp: contract.created_at,
            icon: 'FileText'
          });
        });
      }

      // Recent merchants
      const { data: recentMerchants } = await supabase
        .from('merchants')
        .select('id, company_name, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentMerchants) {
        recentMerchants.forEach(merchant => {
          activities.push({
            id: `merchant-${merchant.id}`,
            type: 'merchant',
            title: `Nový merchant`,
            description: `${merchant.company_name} sa zaregistroval`,
            timestamp: merchant.created_at,
            icon: 'Building'
          });
        });
      }

      // Sort by timestamp desc
      return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
    refetchInterval: 30000 // Auto-refresh every 30 seconds
  });

  // Chart data for revenue analytics
  const { data: chartData = [], isLoading: chartLoading } = useQuery({
    queryKey: ['dashboard-chart-data'],
    queryFn: async () => {
      const months = [];
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        
        const monthName = date.toLocaleDateString('sk-SK', { month: 'short', year: '2-digit' });
        
        // Get contracts count for this month
        const { count: contractsCount } = await supabase
          .from('contracts')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', date.toISOString())
          .lt('created_at', nextMonth.toISOString());

        // Get merchants count for this month
        const { count: merchantsCount } = await supabase
          .from('merchants')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', date.toISOString())
          .lt('created_at', nextMonth.toISOString());

        // Get revenue for this month
        const { data: revenueData } = await supabase
          .from('contract_calculations')
          .select('total_monthly_profit, contracts!inner(created_at)')
          .gte('contracts.created_at', date.toISOString())
          .lt('contracts.created_at', nextMonth.toISOString());

        const revenue = revenueData?.reduce((sum, item) => sum + (item.total_monthly_profit || 0), 0) || 0;

        months.push({
          month: monthName,
          revenue: Math.round(revenue),
          contracts: contractsCount || 0,
          merchants: merchantsCount || 0
        });
      }
      
      return months;
    },
    refetchInterval: 60000 // Refresh every minute
  });

  // Team status data
  const { data: teamData, isLoading: teamLoading } = useQuery({
    queryKey: ['dashboard-team'],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, is_active, created_at')
        .eq('is_active', true);

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      const { data: organizations } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('is_active', true);

      const adminUsers = userRoles?.filter(r => r.role === 'admin')?.length || 0;
      const partnerUsers = userRoles?.filter(r => r.role === 'partner')?.length || 0;

      return {
        activeUsers: profiles?.length || 0,
        totalOrganizations: organizations?.length || 0,
        adminUsers,
        partnerUsers
      };
    },
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  const isLoading = businessMetrics.isLoading || activityLoading || chartLoading || teamLoading;

  return {
    businessMetrics: businessMetrics.data,
    recentActivity,
    chartData,
    teamData,
    isLoading,
    error: businessMetrics.error
  };
};