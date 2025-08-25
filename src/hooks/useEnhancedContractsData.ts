import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EnhancedContractData {
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
  clientName: string;
  contractValue: number;
  completedSteps: number;
  contractType: string;
  salesPerson: string;
  // Add missing properties to match ContractWithInfo
  client_name: string;
  monthly_value: number;
  completion_percentage: number;
  contract_type: string;
  sales_person: string;
}

interface ContractFilters {
  status?: string;
  source?: string;
  search?: string;
  contractType?: string;
  dateFrom?: string;
  dateTo?: string;
  salesPerson?: string;
}

// Define valid enum values for type safety
const VALID_STATUSES = [
  'draft', 'submitted', 'approved', 'rejected', 'in_progress', 
  'sent_to_client', 'email_viewed', 'step_completed', 'contract_generated', 
  'signed', 'waiting_for_signature', 'lost', 'pending_approval', 'request_draft'
] as const;

const VALID_SOURCES = [
  'email', 'other', 'telesales', 'facebook', 'web', 'referral'
] as const;

type ValidStatus = typeof VALID_STATUSES[number];
type ValidSource = typeof VALID_SOURCES[number];

export const useEnhancedContractsData = (filters?: ContractFilters) => {
  return useQuery({
    queryKey: ['enhanced-contracts', filters],
    queryFn: async () => {
      console.log('Fetching enhanced contracts data with filters:', filters);
      
      let query = supabase
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
          creator_profile:profiles!fk_contracts_created_by (
            first_name,
            last_name
          )
        `);

      // Apply filters with proper type casting and validation
      if (filters?.status && filters.status !== 'all') {
        // Only apply filter if it's a valid status
        if (VALID_STATUSES.includes(filters.status as ValidStatus)) {
          query = query.eq('status', filters.status as ValidStatus);
        }
      }
      if (filters?.source && filters.source !== 'all') {
        // Only apply filter if it's a valid source
        if (VALID_SOURCES.includes(filters.source as ValidSource)) {
          query = query.eq('source', filters.source as ValidSource);
        }
      }
      if (filters?.search) {
        query = query.or(`contract_number.ilike.%${filters.search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching enhanced contracts:', error);
        throw error;
      }

      // Transform the data
      const transformedData: EnhancedContractData[] = data?.map(contract => {
        const contactInfo = Array.isArray(contract.contact_info) && contract.contact_info.length > 0 
          ? contract.contact_info[0] 
          : null;
        const companyInfo = Array.isArray(contract.company_info) && contract.company_info.length > 0 
          ? contract.company_info[0] 
          : null;
        const contractCalculations = Array.isArray(contract.contract_calculations) && contract.contract_calculations.length > 0 
          ? contract.contract_calculations[0] 
          : null;
        const creatorProfile = Array.isArray(contract.creator_profile) && contract.creator_profile.length > 0 
          ? contract.creator_profile[0] 
          : contract.creator_profile;

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
          clientName,
          contractValue: monthlyValue,
          completedSteps: contract.current_step || 0,
          contractType,
          salesPerson,
          // Duplicate properties to match ContractWithInfo interface
          client_name: clientName,
          monthly_value: monthlyValue,
          completion_percentage: completionPercentage,
          contract_type: contractType,
          sales_person: salesPerson,
        };
      }) || [];

      console.log('Enhanced contracts data fetched and transformed:', transformedData);
      return transformedData;
    },
  });
};

// Add the missing option hooks
export const useContractTypeOptions = () => {
  return useQuery({
    queryKey: ['contract-type-options'],
    queryFn: async () => {
      const { data } = await supabase
        .from('contracts')
        .select('id')
        .limit(1);
      
      // Return static options since we derive contract types
      return ['Standard', 'Premium', 'Enterprise'];
    },
  });
};

export const useSalesPersonOptions = () => {
  return useQuery({
    queryKey: ['sales-person-options'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .not('first_name', 'is', null)
        .not('last_name', 'is', null);
      
      return data?.map(profile => `${profile.first_name} ${profile.last_name}`) || [];
    },
  });
};

export const useContractSourceOptions = () => {
  return useQuery({
    queryKey: ['contract-source-options'],
    queryFn: async () => {
      const { data } = await supabase
        .from('contracts')
        .select('source')
        .not('source', 'is', null);
      
      const uniqueSources = [...new Set(data?.map(item => item.source).filter(Boolean))];
      return uniqueSources;
    },
  });
};
