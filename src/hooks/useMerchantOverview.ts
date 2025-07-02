import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useMerchantOverview = () => {
  return useQuery({
    queryKey: ['merchant-overview'],
    queryFn: async () => {
      console.log('Fetching merchant overview...');
      
      // Get merchants with their contracts and calculations
      const { data: merchantsData, error } = await supabase
        .from('merchants')
        .select(`
          id,
          company_name,
          contact_person_name,
          contact_person_email,
          address_city,
          created_at,
          contracts!inner (
            id,
            status,
            contract_calculations (
              total_monthly_profit,
              monthly_turnover
            )
          )
        `);

      if (error) {
        console.error('Error fetching merchants:', error);
        throw error;
      }

      // Get business locations for each merchant
      const { data: locationsData, error: locationsError } = await supabase
        .from('business_locations')
        .select(`
          contract_id,
          estimated_turnover,
          has_pos,
          address_city
        `);

      if (locationsError) {
        console.error('Error fetching locations:', locationsError);
        throw locationsError;
      }

      // Process merchant data
      const processedMerchants = merchantsData?.map(merchant => {
        const contracts = Array.isArray(merchant.contracts) ? merchant.contracts : [merchant.contracts].filter(Boolean);
        
        // Calculate total profit and revenue for this merchant
        let totalProfit = 0;
        let totalRevenue = 0;
        let activeContracts = 0;

        contracts.forEach(contract => {
          if (['approved', 'signed'].includes(contract.status)) {
            activeContracts += 1;
            const calc = Array.isArray(contract.contract_calculations) 
              ? contract.contract_calculations[0] 
              : contract.contract_calculations;
            
            if (calc) {
              totalProfit += Number(calc.total_monthly_profit) || 0;
              totalRevenue += Number(calc.monthly_turnover) || 0;
            }
          }
        });

        // Get locations for this merchant
        const merchantLocations = locationsData?.filter(loc => 
          contracts.some(contract => contract.id === loc.contract_id)
        ) || [];

        const locationsCount = merchantLocations.length;
        const posCount = merchantLocations.filter(loc => loc.has_pos).length;

        return {
          id: merchant.id,
          name: merchant.company_name,
          contactPerson: merchant.contact_person_name,
          email: merchant.contact_person_email,
          city: merchant.address_city,
          createdAt: merchant.created_at,
          totalProfit: Math.round(totalProfit),
          totalRevenue: Math.round(totalRevenue),
          activeContracts,
          totalContracts: contracts.length,
          locationsCount,
          posCount,
          efficiency: totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0
        };
      }) || [];

      // Sort by total profit descending
      const topMerchants = processedMerchants
        .sort((a, b) => b.totalProfit - a.totalProfit)
        .slice(0, 10);

      // Calculate summary stats
      const totalMerchants = processedMerchants.length;
      const totalActiveContracts = processedMerchants.reduce((sum, m) => sum + m.activeContracts, 0);
      const totalMonthlyProfit = processedMerchants.reduce((sum, m) => sum + m.totalProfit, 0);
      const totalLocations = processedMerchants.reduce((sum, m) => sum + m.locationsCount, 0);

      // Geographic distribution
      const cityDistribution = processedMerchants.reduce((acc, merchant) => {
        const city = merchant.city || 'Neznáme';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topCities = Object.entries(cityDistribution)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([city, count]) => ({ city, count }));

      console.log('Merchant overview processed:', {
        totalMerchants,
        totalActiveContracts,
        totalMonthlyProfit,
        topMerchants: topMerchants.length
      });

      return {
        topMerchants,
        totalMerchants,
        totalActiveContracts,
        totalMonthlyProfit,
        totalLocations,
        topCities,
        averageProfitPerMerchant: totalMerchants > 0 ? Math.round(totalMonthlyProfit / totalMerchants) : 0
      };
    },
  });
};