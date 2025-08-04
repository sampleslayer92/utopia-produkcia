import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MerchantProfile {
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
}

export const useMerchantProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['merchant-profile', user?.email],
    queryFn: async (): Promise<MerchantProfile | null> => {
      if (!user?.email) return null;

      const { data: merchant, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('contact_person_email', user.email)
        .single();

      if (error) {
        console.error('Error fetching merchant profile:', error);
        return null;
      }

      return merchant;
    },
    enabled: !!user?.email,
  });
};