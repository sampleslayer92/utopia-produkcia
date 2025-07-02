import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BusinessLocationWithMerchant {
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
  created_at: string;
  contract_id: string;
  contract_number?: string;
  contract_status?: string;
  merchant_name?: string;
  merchant_id?: string;
}

interface BusinessLocationsFilters {
  merchant?: string;
  sector?: string;
  hasPos?: string;
  search?: string;
}

export const useBusinessLocations = (filters: BusinessLocationsFilters = {}) => {
  return useQuery({
    queryKey: ['business-locations', filters],
    queryFn: async () => {
      let query = supabase
        .from('business_locations')
        .select(`
          *,
          contracts!inner(
            id,
            contract_number,
            status,
            merchant_id,
            merchants!inner(
              id,
              company_name
            )
          )
        `);

      // Apply filters
      if (filters.merchant) {
        query = query.eq('contracts.merchant_id', filters.merchant);
      }

      if (filters.sector) {
        query = query.eq('business_sector', filters.sector);
      }

      if (filters.hasPos) {
        query = query.eq('has_pos', filters.hasPos === 'true');
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,address_city.ilike.%${filters.search}%,address_street.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to flat structure
      return data?.map((location: any) => ({
        ...location,
        contract_number: location.contracts?.contract_number,
        contract_status: location.contracts?.status,
        merchant_name: location.contracts?.merchants?.company_name,
        merchant_id: location.contracts?.merchant_id
      })) as BusinessLocationWithMerchant[];
    }
  });
};