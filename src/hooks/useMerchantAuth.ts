
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MerchantAuthData {
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
  };
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const useMerchantAuth = () => {
  return useQuery({
    queryKey: ['merchant-auth'],
    queryFn: async (): Promise<MerchantAuthData | null> => {
      console.log('Fetching merchant auth data...');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('No authenticated user:', userError);
        return null;
      }

      // Check if user has merchant role
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'merchant');

      if (rolesError || !roles || roles.length === 0) {
        console.error('User is not a merchant:', rolesError);
        return null;
      }

      // Get merchant data based on email
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('*')
        .eq('contact_person_email', user.email)
        .single();

      if (merchantError || !merchant) {
        console.error('Merchant not found:', merchantError);
        return null;
      }

      const result: MerchantAuthData = {
        merchant,
        user: {
          id: user.id,
          email: user.email!,
          role: 'merchant'
        }
      };

      console.log('Merchant auth data:', result);
      return result;
    },
    enabled: true,
  });
};
