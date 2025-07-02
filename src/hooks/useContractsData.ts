
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ContractWithInfo {
  id: string;
  contract_number: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  merchant_id: string | null;
  source: string | null;
  current_step: number | null;
  contact_info: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  company_info: {
    company_name: string;
    ico: string;
  } | null;
  contract_calculations: {
    total_monthly_profit: number;
  } | null;
  creator_profile: {
    first_name: string;
    last_name: string;
  } | null;
  client_name: string;
  monthly_value: number;
  completion_percentage: number;
  contract_type: string;
  sales_person: string;
}

export const useContractsData = () => {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      console.log('Fetching contracts data...');
      
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          id,
          contract_number,
          status,
          created_at,
          submitted_at,
          merchant_id,
          source,
          current_step,
          contact_info (
            first_name,
            last_name,
            email
          ),
          company_info (
            company_name,
            ico
          ),
          contract_calculations (
            total_monthly_profit
          ),
          profiles!contracts_created_by_fkey (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contracts:', error);
        throw error;
      }

      // Transform the data to match our interface
      const transformedData: ContractWithInfo[] = data?.map(contract => {
        const contactInfo = Array.isArray(contract.contact_info) && contract.contact_info.length > 0 
          ? contract.contact_info[0] 
          : null;
        const companyInfo = Array.isArray(contract.company_info) && contract.company_info.length > 0 
          ? contract.company_info[0] 
          : null;
        const contractCalculations = Array.isArray(contract.contract_calculations) && contract.contract_calculations.length > 0 
          ? contract.contract_calculations[0] 
          : null;
        const creatorProfile = Array.isArray(contract.profiles) && contract.profiles.length > 0 
          ? contract.profiles[0] 
          : null;

        // Derive client name from contact and company info
        const clientName = companyInfo?.company_name || 
          (contactInfo ? `${contactInfo.first_name} ${contactInfo.last_name}` : 'N/A');

        // Calculate completion percentage (assuming 7 steps total)
        const completionPercentage = contract.current_step ? Math.round((contract.current_step / 7) * 100) : 0;

        // Derive contract type based on monthly value
        const monthlyValue = contractCalculations?.total_monthly_profit || 0;
        let contractType = 'Standard';
        if (monthlyValue > 1000) contractType = 'Enterprise';
        else if (monthlyValue > 500) contractType = 'Premium';

        // Sales person name
        const salesPerson = creatorProfile ? `${creatorProfile.first_name} ${creatorProfile.last_name}` : 'N/A';

        return {
          id: contract.id,
          contract_number: contract.contract_number,
          status: contract.status,
          created_at: contract.created_at,
          submitted_at: contract.submitted_at,
          merchant_id: contract.merchant_id,
          source: contract.source,
          current_step: contract.current_step,
          contact_info: contactInfo,
          company_info: companyInfo,
          contract_calculations: contractCalculations,
          creator_profile: creatorProfile,
          client_name: clientName,
          monthly_value: monthlyValue,
          completion_percentage: completionPercentage,
          contract_type: contractType,
          sales_person: salesPerson,
        };
      }) || [];

      console.log('Contracts data fetched and transformed:', transformedData);
      return transformedData;
    },
  });
};

export const useContractsStats = () => {
  return useQuery({
    queryKey: ['contracts-stats'],
    queryFn: async () => {
      console.log('Fetching contracts stats...');
      
      const { data: contracts, error } = await supabase
        .from('contracts')
        .select('status, created_at');

      if (error) {
        console.error('Error fetching contracts stats:', error);
        throw error;
      }

      const total = contracts.length;
      const submitted = contracts.filter(c => c.status === 'submitted').length;
      const draft = contracts.filter(c => c.status === 'draft').length;
      const approved = contracts.filter(c => c.status === 'approved').length;
      
      // Count contracts from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentContracts = contracts.filter(c => 
        new Date(c.created_at) > thirtyDaysAgo
      ).length;

      console.log('Contracts stats calculated:', {
        total,
        submitted,
        draft,
        approved,
        recentContracts
      });

      return {
        total,
        submitted,
        draft,
        approved,
        recentContracts
      };
    },
  });
};
