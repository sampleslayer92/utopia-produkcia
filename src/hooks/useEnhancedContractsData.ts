import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EnhancedContractData {
  id: string;
  contract_number: string; // Changed from number to string
  status: string;
  created_at: string;
  submitted_at: string | null;
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
  contractType: string;
  clientName: string;
  salesPerson: string;
}

const calculateCompletedSteps = (contract: any) => {
  let completed = 0;
  const totalSteps = 7;

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

const determineContractType = (deviceSelection: any) => {
  if (!deviceSelection) return 'Nedefinovaný';

  const hasPos = (deviceSelection.pax_a80_count || 0) + (deviceSelection.pax_a920_pro_count || 0) > 0;
  const hasTablet = (deviceSelection.tablet_10_count || 0) + (deviceSelection.tablet_15_count || 0) + (deviceSelection.tablet_pro_15_count || 0) > 0;

  if (hasPos && hasTablet) return 'POS + SoftPOS';
  if (hasPos) return 'POS';
  if (hasTablet) return 'SoftPOS';
  return 'E-commerce';
};

const extractSingleRecord = (data: any) => {
  if (Array.isArray(data) && data.length > 0) {
    return data[0];
  }
  return Array.isArray(data) ? null : data;
};

// Define valid database status types - updated to match actual database enum
type DatabaseStatus = 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'completed' | 'signed';

// Map UI filter values to database enum values
const mapStatusFilter = (uiStatus: string): DatabaseStatus | null => {
  const statusMap: Record<string, DatabaseStatus> = {
    'draft': 'draft',
    'submitted': 'submitted',
    'opened': 'submitted', // Map 'opened' to existing status
    'viewed': 'in_review', // Map 'viewed' to existing status
    'approved': 'approved',
    'rejected': 'rejected',
    'completed': 'completed',
    'signed': 'signed'
  };
  return statusMap[uiStatus] || null;
};

export const useEnhancedContractsData = (filters?: {
  status?: string;
  contractType?: string;
  dateFrom?: string;
  dateTo?: string;
  salesPerson?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['enhanced-contracts', filters],
    queryFn: async () => {
      console.log('Fetching enhanced contracts data...');
      
      let query = supabase
        .from('contracts')
        .select(`
          id,
          contract_number,
          status,
          created_at,
          submitted_at,
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

      // Apply filters with proper type checking and mapping
      if (filters?.status && filters.status !== 'all') {
        const mappedStatus = mapStatusFilter(filters.status);
        if (mappedStatus) {
          query = query.eq('status', mappedStatus);
        }
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
        
        const contractType = determineContractType(deviceSelection);
        const contractValue = contractCalculations?.total_monthly_profit || 0;
        
        const clientName = companyInfo?.company_name || 
          (contactInfo ? `${contactInfo.first_name} ${contactInfo.last_name}` : 'N/A');
        
        const salesPerson = contactInfo?.user_role || 'Admin';

        return {
          id: contract.id,
          contract_number: contract.contract_number, // Already a string
          status: contract.status,
          created_at: contract.created_at,
          submitted_at: contract.submitted_at,
          contact_info: contactInfo,
          company_info: companyInfo,
          contract_calculations: contractCalculations,
          device_selection: deviceSelection,
          completedSteps,
          contractValue,
          contractType,
          clientName,
          salesPerson
        };
      }).filter(contract => {
        // Apply client-side filters
        if (filters?.contractType && filters.contractType !== 'all' && contract.contractType !== filters.contractType) {
          return false;
        }

        if (filters?.salesPerson && filters.salesPerson !== 'all' && contract.salesPerson !== filters.salesPerson) {
          return false;
        }

        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase();
          return (
            contract.contract_number.toString().includes(searchTerm) ||
            contract.clientName.toLowerCase().includes(searchTerm) ||
            contract.salesPerson.toLowerCase().includes(searchTerm) ||
            contract.contractType.toLowerCase().includes(searchTerm) ||
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
        .from('device_selection')
        .select('*');

      const types = new Set<string>();
      data?.forEach(device => {
        types.add(determineContractType(device));
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
        .from('contact_info')
        .select('user_role')
        .not('user_role', 'is', null);

      const persons = new Set<string>();
      persons.add('Admin');
      
      data?.forEach(contact => {
        if (contact.user_role) {
          persons.add(contact.user_role);
        }
      });

      return Array.from(persons);
    },
  });
};
