import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BusinessLocationDetail {
  id: string;
  name: string;
  address_street: string;
  address_city: string;
  address_zip_code: string;
  business_sector: string;
  estimated_turnover: number;
  average_transaction: number;
  has_pos: boolean;
  contact_person_name: string;
  contact_person_email: string;
  contact_person_phone: string;
  opening_hours: string;
  iban: string;
  seasonality: string;
  seasonal_weeks: number | null;
  created_at: string;
  updated_at: string;
  contract_id: string;
  location_id: string;
  contract: {
    id: string;
    contract_number: string;
    status: string;
    merchant_id: string;
    merchant: {
      id: string;
      company_name: string;
      ico: string;
      contact_person_name: string;
      contact_person_email: string;
    };
  };
}

export const useBusinessLocationDetail = (locationId: string) => {
  return useQuery({
    queryKey: ['business-location-detail', locationId],
    queryFn: async () => {
      const { data, error } = await supabase
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
              company_name,
              ico,
              contact_person_name,
              contact_person_email
            )
          )
        `)
        .eq('id', locationId)
        .single();

      if (error) throw error;

      // Transform nested data
      const transformedData: BusinessLocationDetail = {
        ...data,
        contract: {
          id: data.contracts.id,
          contract_number: data.contracts.contract_number,
          status: data.contracts.status,
          merchant_id: data.contracts.merchant_id,
          merchant: data.contracts.merchants
        }
      };

      return transformedData;
    },
    enabled: !!locationId
  });
};