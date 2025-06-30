
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BusinessLocation {
  id: string;
  name: string;
  address_street: string;
  address_city: string;
  address_zip_code: string;
  business_sector: string;
  estimated_turnover: number;
  has_pos: boolean;
  contact_person_name: string;
  contact_person_email: string;
  contact_person_phone: string;
  opening_hours: string;
  contract_number: string;
  contract_status: string;
  assignment_date: string;
}

export interface MerchantDetailData {
  merchant: {
    id: string;
    company_name: string;
    ico: string | null;
    dic: string | null;
    vat_number: string | null;
    contact_person_name: string;
    contact_person_email: string;
    contact_person_phone: string | null;
    address_street: string | null;
    address_city: string | null;
    address_zip_code: string | null;
    created_at: string;
    updated_at: string;
  };
  contracts: Array<{
    id: string;
    contract_number: string;
    status: string;
    created_at: string;
    submitted_at: string | null;
    total_monthly_profit: number;
    contract_items_count: number;
  }>;
  locations: BusinessLocation[];
  statistics: {
    total_contracts: number;
    total_monthly_profit: number;
    total_devices: number;
    avg_contract_value: number;
    latest_contract_date: string | null;
    total_locations: number;
    total_estimated_turnover: number;
    locations_with_pos: number;
  };
}

export const useMerchantDetail = (merchantId: string) => {
  return useQuery({
    queryKey: ['merchant-detail', merchantId],
    queryFn: async (): Promise<MerchantDetailData> => {
      console.log('Fetching merchant detail for:', merchantId);
      
      // Get merchant basic info
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('*')
        .eq('id', merchantId)
        .single();

      if (merchantError) {
        console.error('Error fetching merchant:', merchantError);
        throw merchantError;
      }

      // Get merchant's contracts with calculations and items
      const { data: contracts, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          id,
          contract_number,
          status,
          created_at,
          submitted_at,
          contract_calculations(
            total_monthly_profit
          ),
          contract_items(
            id,
            count
          )
        `)
        .eq('merchant_id', merchantId)
        .order('created_at', { ascending: false });

      if (contractsError) {
        console.error('Error fetching contracts:', contractsError);
        throw contractsError;
      }

      // Get merchant's business locations
      const { data: locationsData, error: locationsError } = await supabase
        .from('merchants')
        .select(`
          contracts!inner(
            contract_number,
            status,
            location_assignments(
              created_at,
              business_locations(
                id,
                name,
                address_street,
                address_city,
                address_zip_code,
                business_sector,
                estimated_turnover,
                has_pos,
                contact_person_name,
                contact_person_email,
                contact_person_phone,
                opening_hours
              )
            )
          )
        `)
        .eq('id', merchantId);

      if (locationsError) {
        console.error('Error fetching locations:', locationsError);
        throw locationsError;
      }

      // Process locations data
      const locations: BusinessLocation[] = [];
      if (locationsData && locationsData[0]) {
        for (const contract of locationsData[0].contracts) {
          for (const assignment of contract.location_assignments || []) {
            if (assignment.business_locations && typeof assignment.business_locations === 'object') {
              locations.push({
                ...assignment.business_locations,
                contract_number: contract.contract_number,
                contract_status: contract.status,
                assignment_date: assignment.created_at
              });
            }
          }
        }
      }

      // Process contracts data
      const processedContracts = (contracts || []).map(contract => {
        const calculations = contract.contract_calculations || [];
        const items = contract.contract_items || [];
        
        const totalMonthlyProfit = calculations.reduce((sum, calc) => 
          sum + (Number(calc.total_monthly_profit) || 0), 0);
        
        const contractItemsCount = items.reduce((sum, item) => 
          sum + (Number(item.count) || 0), 0);

        return {
          id: contract.id,
          contract_number: contract.contract_number,
          status: contract.status,
          created_at: contract.created_at,
          submitted_at: contract.submitted_at,
          total_monthly_profit: totalMonthlyProfit,
          contract_items_count: contractItemsCount
        };
      });

      // Calculate statistics
      const totalContracts = processedContracts.length;
      const totalMonthlyProfit = processedContracts.reduce((sum, contract) => 
        sum + contract.total_monthly_profit, 0);
      const totalDevices = processedContracts.reduce((sum, contract) => 
        sum + contract.contract_items_count, 0);
      const avgContractValue = totalContracts > 0 ? totalMonthlyProfit / totalContracts : 0;
      const latestContractDate = processedContracts.length > 0 
        ? processedContracts[0].created_at 
        : null;

      // Calculate location statistics
      const totalLocations = locations.length;
      const totalEstimatedTurnover = locations.reduce((sum, location) => 
        sum + (Number(location.estimated_turnover) || 0), 0);
      const locationsWithPOS = locations.filter(location => location.has_pos).length;

      const result: MerchantDetailData = {
        merchant,
        contracts: processedContracts,
        locations,
        statistics: {
          total_contracts: totalContracts,
          total_monthly_profit: totalMonthlyProfit,
          total_devices: totalDevices,
          avg_contract_value: avgContractValue,
          latest_contract_date: latestContractDate,
          total_locations: totalLocations,
          total_estimated_turnover: totalEstimatedTurnover,
          locations_with_pos: locationsWithPOS
        }
      };

      console.log('Merchant detail data:', result);
      return result;
    },
    enabled: !!merchantId,
  });
};
