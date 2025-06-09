
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EnhancedContractData {
  id: string;
  contract_number: string;
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

  // Step 4: Device Selection (check contract_items)
  if (contract.contract_items && contract.contract_items.length > 0) {
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

const mapContractItemsToDeviceSelection = (contractItems: any[]) => {
  const deviceCounts = {
    pax_a80_count: 0,
    pax_a920_pro_count: 0,
    tablet_10_count: 0,
    tablet_15_count: 0,
    tablet_pro_15_count: 0,
  };

  contractItems?.forEach(item => {
    const itemName = item.name?.toLowerCase() || '';
    
    if (itemName.includes('pax a80')) {
      deviceCounts.pax_a80_count += item.count || 0;
    } else if (itemName.includes('pax a920') || itemName.includes('pax a920 pro')) {
      deviceCounts.pax_a920_pro_count += item.count || 0;
    } else if (itemName.includes('tablet 10')) {
      deviceCounts.tablet_10_count += item.count || 0;
    } else if (itemName.includes('tablet 15') && !itemName.includes('pro')) {
      deviceCounts.tablet_15_count += item.count || 0;
    } else if (itemName.includes('tablet pro 15') || itemName.includes('tablet 15 pro')) {
      deviceCounts.tablet_pro_15_count += item.count || 0;
    }
  });

  return deviceCounts;
};

const determineContractType = (contractItems: any[]) => {
  if (!contractItems || contractItems.length === 0) return 'E-commerce';

  const deviceCounts = mapContractItemsToDeviceSelection(contractItems);
  
  const hasPos = (deviceCounts.pax_a80_count || 0) + (deviceCounts.pax_a920_pro_count || 0) > 0;
  const hasTablet = (deviceCounts.tablet_10_count || 0) + (deviceCounts.tablet_15_count || 0) + (deviceCounts.tablet_pro_15_count || 0) > 0;

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

// Define valid database status types - match actual database enum exactly
type DatabaseStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

// Map UI filter values to database enum values
const mapStatusFilter = (uiStatus: string): DatabaseStatus | null => {
  const statusMap: Record<string, DatabaseStatus> = {
    'draft': 'draft',
    'submitted': 'submitted',
    'opened': 'submitted',
    'viewed': 'submitted',
    'approved': 'approved',
    'rejected': 'rejected',
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
          contract_items (
            name,
            count,
            item_type
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

      console.log('Raw contracts data:', data);

      // Transform the data
      const transformedData: EnhancedContractData[] = data?.map(contract => {
        const completedSteps = calculateCompletedSteps(contract);
        
        // Extract single records from potentially array relationships
        const contactInfo = extractSingleRecord(contract.contact_info);
        const companyInfo = extractSingleRecord(contract.company_info);
        const contractCalculations = extractSingleRecord(contract.contract_calculations);
        
        // Map contract items to device selection format for backward compatibility
        const deviceSelection = mapContractItemsToDeviceSelection(contract.contract_items || []);
        
        const contractType = determineContractType(contract.contract_items || []);
        const contractValue = contractCalculations?.total_monthly_profit || 0;
        
        const clientName = companyInfo?.company_name || 
          (contactInfo ? `${contactInfo.first_name} ${contactInfo.last_name}` : 'N/A');
        
        const salesPerson = contactInfo?.user_role || 'Admin';

        return {
          id: contract.id,
          contract_number: contract.contract_number,
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
        .from('contract_items')
        .select('contract_id, name, count')
        .eq('item_type', 'device');

      const types = new Set<string>();
      
      // Group items by contract and determine contract types
      const contractGroups: { [key: string]: any[] } = {};
      data?.forEach(item => {
        if (!contractGroups[item.contract_id]) {
          contractGroups[item.contract_id] = [];
        }
        contractGroups[item.contract_id].push(item);
      });

      Object.values(contractGroups).forEach(items => {
        types.add(determineContractType(items));
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
