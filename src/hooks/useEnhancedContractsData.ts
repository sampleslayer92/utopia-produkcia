import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EnhancedContractData {
  id: string;
  contract_number: number;
  status: string;
  created_at: string;
  submitted_at: string | null;
  contract_type: string | null;
  salesperson: string | null;
  contact_info: {
    first_name: string;
    last_name: string;
    email: string;
    user_role: string | null;
  } | null;
  company_info: {
    company_name: string;
    ico: string;
  } | null;
  contract_calculations: {
    total_monthly_profit: number;
  } | null;
  device_selection: {
    pax_a80_count: number;
    pax_a920_pro_count: number;
    tablet_10_count: number;
    tablet_15_count: number;
    tablet_pro_15_count: number;
  } | null;
  completedSteps: number;
  contractValue: number;
  clientName: string;
}

const calculateCompletedSteps = (contract: any) => {
  let completed = 0;

  // Step 1: Contact Info
  if (contract.contact_info?.first_name && contract.contact_info?.last_name && contract.contact_info?.email) {
    completed++;
  }

  // Step 2: Company Info
  if (contract.company_info?.company_name && contract.company_info?.ico) {
    completed++;
  }

  // Step 3: Business Locations
  if (contract.business_locations && contract.business_locations.length > 0) {
    completed++;
  }

  // Step 4: Device Selection
  if (contract.device_selection) {
    completed++;
  }

  // Step 5: Authorized Persons
  if (contract.authorized_persons && contract.authorized_persons.length > 0) {
    completed++;
  }

  // Step 6: Actual Owners
  if (contract.actual_owners && contract.actual_owners.length > 0) {
    completed++;
  }

  // Step 7: Consents
  if (contract.consents?.terms_consent && contract.consents?.gdpr_consent) {
    completed++;
  }

  return completed;
};

const extractSingleRecord = (data: any) => {
  if (Array.isArray(data) && data.length > 0) {
    return data[0];
  }
  return Array.isArray(data) ? null : data;
};

export const useEnhancedContractsData = (filters?: {
  status?: string;
  contractType?: string;
  client?: string;
  salesperson?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}) => {
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
          contract_type,
          salesperson,
          contact_info (
            first_name,
            last_name,
            email,
            user_role
          ),
          company_info (
            company_name,
            ico
          ),
          contract_calculations (
            total_monthly_profit
          ),
          device_selection (
            pax_a80_count,
            pax_a920_pro_count,
            tablet_10_count,
            tablet_15_count,
            tablet_pro_15_count
          ),
          business_locations (*),
          authorized_persons (*),
          actual_owners (*),
          consents (*)
        `)
        .order('created_at', { ascending: false });

      // Apply server-side filters
      if (filters?.status && filters.status !== 'all') {
        // Map UI status values to valid database status values
        const statusMapping: { [key: string]: string } = {
          'draft': 'draft',
          'submitted': 'submitted', 
          'opened': 'submitted', 
          'viewed': 'submitted',
          'approved': 'approved',
          'rejected': 'rejected'
        };
        
        const dbStatus = statusMapping[filters.status];
        if (dbStatus) {
          query = query.eq('status', dbStatus);
        }
      }

      if (filters?.contractType && filters.contractType !== 'all') {
        query = query.eq('contract_type', filters.contractType);
      }

      if (filters?.salesperson && filters.salesperson !== 'all') {
        query = query.eq('salesperson', filters.salesperson);
      }

      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching enhanced contracts:', error);
        throw error;
      }

      // Transform the data
      const transformedData: EnhancedContractData[] = data?.map(contract => {
        const completedSteps = calculateCompletedSteps(contract);
        
        // Extract single records from potentially array relationships
        const contactInfo = extractSingleRecord(contract.contact_info);
        const companyInfo = extractSingleRecord(contract.company_info);
        const contractCalculations = extractSingleRecord(contract.contract_calculations);
        const deviceSelection = extractSingleRecord(contract.device_selection);
        
        const contractValue = contractCalculations?.total_monthly_profit || 0;
        
        const clientName = companyInfo?.company_name || 
          (contactInfo ? `${contactInfo.first_name} ${contactInfo.last_name}` : 'N/A');

        return {
          id: contract.id,
          contract_number: contract.contract_number,
          status: contract.status,
          created_at: contract.created_at,
          submitted_at: contract.submitted_at,
          contract_type: contract.contract_type,
          salesperson: contract.salesperson,
          contact_info: contactInfo,
          company_info: companyInfo,
          contract_calculations: contractCalculations,
          device_selection: deviceSelection,
          completedSteps,
          contractValue,
          clientName
        };
      }).filter(contract => {
        // Apply client-side filters
        if (filters?.client && filters.client !== 'all') {
          const searchTerm = filters.client.toLowerCase();
          return contract.clientName.toLowerCase().includes(searchTerm);
        }

        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase();
          return (
            contract.contract_number.toString().includes(searchTerm) ||
            contract.clientName.toLowerCase().includes(searchTerm) ||
            contract.salesperson?.toLowerCase().includes(searchTerm) ||
            contract.contract_type?.toLowerCase().includes(searchTerm) ||
            contract.contact_info?.email?.toLowerCase().includes(searchTerm)
          );
        }

        return true;
      }) || [];

      console.log('Enhanced contracts data transformed:', transformedData);
      return transformedData;
    },
  });
};

export const useContractTypeOptions = () => {
  return useQuery({
    queryKey: ['contract-types'],
    queryFn: async () => {
      const { data } = await supabase
        .from('contracts')
        .select('contract_type')
        .not('contract_type', 'is', null);

      const types = new Set<string>();
      data?.forEach(contract => {
        if (contract.contract_type) {
          types.add(contract.contract_type);
        }
      });

      return Array.from(types);
    },
  });
};

export const useSalesPersonOptions = () => {
  return useQuery({
    queryKey: ['sales-persons'],
    queryFn: async () => {
      const { data } = await supabase
        .from('contracts')
        .select('salesperson')
        .not('salesperson', 'is', null);

      const persons = new Set<string>();
      data?.forEach(contract => {
        if (contract.salesperson) {
          persons.add(contract.salesperson);
        }
      });

      return Array.from(persons);
    },
  });
};
