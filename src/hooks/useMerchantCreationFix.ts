
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useMerchantCreationFix = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      console.log('Starting merchant creation fix for existing contracts...');

      // Get all contracts that don't have a merchant_id but have both contact_info and company_info
      const { data: contractsToFix, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          id,
          merchant_id,
          contact_info (
            first_name,
            last_name,
            email,
            phone
          ),
          company_info (
            company_name,
            ico,
            dic,
            vat_number,
            address_street,
            address_city,
            address_zip_code
          )
        `)
        .is('merchant_id', null);

      if (contractsError) {
        console.error('Error fetching contracts to fix:', contractsError);
        throw contractsError;
      }

      console.log('Found contracts without merchants:', contractsToFix);

      let fixedCount = 0;
      let createdMerchants = 0;

      for (const contract of contractsToFix || []) {
        const contactInfo = Array.isArray(contract.contact_info) ? contract.contact_info[0] : contract.contact_info;
        const companyInfo = Array.isArray(contract.company_info) ? contract.company_info[0] : contract.company_info;

        if (!contactInfo || !companyInfo || !companyInfo.company_name) {
          console.log(`Skipping contract ${contract.id} - missing required data`);
          continue;
        }

        // Check if merchant already exists
        const { data: existingMerchant } = await supabase
          .from('merchants')
          .select('id')
          .eq('company_name', companyInfo.company_name)
          .eq('ico', companyInfo.ico || '')
          .limit(1)
          .single();

        let merchantId = existingMerchant?.id;

        // Create merchant if it doesn't exist
        if (!merchantId) {
          const { data: newMerchant, error: merchantError } = await supabase
            .from('merchants')
            .insert({
              company_name: companyInfo.company_name,
              ico: companyInfo.ico || null,
              dic: companyInfo.dic || null,
              vat_number: companyInfo.vat_number || null,
              contact_person_name: `${contactInfo.first_name} ${contactInfo.last_name}`,
              contact_person_email: contactInfo.email,
              contact_person_phone: contactInfo.phone || null,
              address_street: companyInfo.address_street || null,
              address_city: companyInfo.address_city || null,
              address_zip_code: companyInfo.address_zip_code || null
            })
            .select('id')
            .single();

          if (merchantError) {
            console.error(`Error creating merchant for ${companyInfo.company_name}:`, merchantError);
            continue;
          }

          merchantId = newMerchant.id;
          createdMerchants++;
          console.log(`Created new merchant: ${companyInfo.company_name}`);
        }

        // Link contract to merchant
        const { error: updateError } = await supabase
          .from('contracts')
          .update({ merchant_id: merchantId })
          .eq('id', contract.id);

        if (updateError) {
          console.error(`Error linking contract ${contract.id} to merchant:`, updateError);
          continue;
        }

        fixedCount++;
        console.log(`Fixed contract ${contract.id} -> merchant ${merchantId}`);
      }

      return { fixedCount, createdMerchants };
    },
    onSuccess: (result) => {
      console.log('Merchant creation fix completed:', result);
      
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      
      toast({
        title: "Oprava dokončená",
        description: `Opravených ${result.fixedCount} zmlúv, vytvorených ${result.createdMerchants} nových obchodníkov.`,
      });
    },
    onError: (error: any) => {
      console.error('Merchant creation fix failed:', error);
      toast({
        title: "Chyba pri oprave",
        description: `Nepodarilo sa opraviť vytvorenie obchodníkov: ${error.message}`,
        variant: "destructive",
      });
    }
  });
};
