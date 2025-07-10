
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Merchant {
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
  contract_count?: number;
  total_monthly_profit?: number;
  latest_contract_date?: string;
}

interface MerchantFilters {
  // Old format filters
  search?: string;
  city?: string;
  hasContracts?: string;
  profitRange?: string;
  
  // New DataTable format filters
  company?: string;
  contracts?: string;
  profit?: string;
}

export const useMerchantsData = (filters: MerchantFilters = {}) => {
  return useQuery({
    queryKey: ['merchants', filters],
    queryFn: async () => {
      console.log('Fetching merchants data...');
      
      // Get all merchants with optional contract statistics
      const { data: merchants, error } = await supabase
        .from('merchants')
        .select(`
          *,
          contracts(
            id,
            status,
            created_at,
            contract_calculations(
              total_monthly_profit
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching merchants:', error);
        throw error;
      }

      console.log('Raw merchants data:', merchants);

      // Process the data to calculate statistics
      const processedMerchants: Merchant[] = merchants.map(merchant => {
        const contracts = merchant.contracts || [];
        const contractCount = contracts.length;
        
        // Calculate total monthly profit from all contracts
        const totalMonthlyProfit = contracts.reduce((sum, contract) => {
          const calculations = contract.contract_calculations || [];
          const contractProfit = calculations.reduce((calcSum, calc) => 
            calcSum + (Number(calc.total_monthly_profit) || 0), 0);
          return sum + contractProfit;
        }, 0);

        // Get latest contract date
        const latestContractDate = contracts.length > 0 
          ? Math.max(...contracts.map(c => new Date(c.created_at).getTime()))
          : null;

        return {
          id: merchant.id,
          company_name: merchant.company_name,
          ico: merchant.ico,
          dic: merchant.dic,
          vat_number: merchant.vat_number,
          contact_person_name: merchant.contact_person_name,
          contact_person_email: merchant.contact_person_email,
          contact_person_phone: merchant.contact_person_phone,
          address_street: merchant.address_street,
          address_city: merchant.address_city,
          address_zip_code: merchant.address_zip_code,
          created_at: merchant.created_at,
          updated_at: merchant.updated_at,
          contract_count: contractCount,
          total_monthly_profit: totalMonthlyProfit,
          latest_contract_date: latestContractDate ? new Date(latestContractDate).toISOString() : undefined
        };
      });

      // Apply filters - support both old and new format
      let filteredMerchants = processedMerchants;

      const searchTerm = filters.search || filters.company;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredMerchants = filteredMerchants.filter(merchant =>
          merchant.company_name.toLowerCase().includes(searchLower) ||
          merchant.contact_person_name.toLowerCase().includes(searchLower) ||
          merchant.contact_person_email.toLowerCase().includes(searchLower) ||
          (merchant.ico && merchant.ico.includes(searchTerm))
        );
      }

      if (filters.city && filters.city !== 'all') {
        filteredMerchants = filteredMerchants.filter(merchant =>
          merchant.address_city === filters.city
        );
      }

      const hasContractsFilter = filters.hasContracts || filters.contracts;
      if (hasContractsFilter && hasContractsFilter !== 'all') {
        const hasContracts = hasContractsFilter === 'true';
        filteredMerchants = filteredMerchants.filter(merchant =>
          hasContracts ? (merchant.contract_count || 0) > 0 : (merchant.contract_count || 0) === 0
        );
      }

      const profitFilter = filters.profitRange || filters.profit;
      if (profitFilter && profitFilter !== 'all') {
        filteredMerchants = filteredMerchants.filter(merchant => {
          const profit = merchant.total_monthly_profit || 0;
          switch (profitFilter) {
            case '0-100':
              return profit >= 0 && profit <= 100;
            case '100-500':
              return profit > 100 && profit <= 500;
            case '500-1000':
              return profit > 500 && profit <= 1000;
            case '1000+':
              return profit > 1000;
            default:
              return true;
          }
        });
      }

      console.log('Filtered merchants:', filteredMerchants);
      return filteredMerchants;
    },
  });
};
