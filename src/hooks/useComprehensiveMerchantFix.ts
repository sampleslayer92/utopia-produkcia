
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useComprehensiveMerchantFix = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      console.log('Starting comprehensive merchant and location fix...');

      // Step 1: Get all contracts that don't have a merchant_id but have both contact_info and company_info
      const { data: contractsToFix, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          id,
          merchant_id,
          status,
          contract_number,
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
          ),
          business_locations (
            id,
            name,
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

      console.log('Found contracts without merchants:', contractsToFix?.length || 0);
      console.log('Contracts to fix:', contractsToFix);

      let fixedCount = 0;
      let createdMerchants = 0;
      let linkedLocations = 0;

      for (const contract of contractsToFix || []) {
        console.log(`Processing contract ${contract.contract_number} (${contract.id})`);
        
        const contactInfo = Array.isArray(contract.contact_info) ? contract.contact_info[0] : contract.contact_info;
        const companyInfo = Array.isArray(contract.company_info) ? contract.company_info[0] : contract.company_info;
        const businessLocations = contract.business_locations || [];

        if (!contactInfo || !companyInfo || !companyInfo.company_name) {
          console.log(`Skipping contract ${contract.contract_number} - missing required data`);
          console.log('Contact info:', contactInfo);
          console.log('Company info:', companyInfo);
          continue;
        }

        // Check if merchant already exists using maybeSingle instead of single
        const { data: existingMerchant, error: searchError } = await supabase
          .from('merchants')
          .select('id')
          .eq('company_name', companyInfo.company_name)
          .eq('ico', companyInfo.ico || '')
          .limit(1)
          .maybeSingle();

        if (searchError) {
          console.error(`Error searching for existing merchant:`, searchError);
          continue;
        }

        let merchantId = existingMerchant?.id;

        // Create merchant if it doesn't exist
        if (!merchantId) {
          console.log(`Creating new merchant for ${companyInfo.company_name}`);
          
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
          console.log(`Created new merchant: ${companyInfo.company_name} with ID: ${merchantId}`);
        } else {
          console.log(`Found existing merchant: ${companyInfo.company_name} with ID: ${merchantId}`);
        }

        // Link contract to merchant
        console.log(`Linking contract ${contract.contract_number} to merchant ${merchantId}`);
        
        const { error: updateError } = await supabase
          .from('contracts')
          .update({ merchant_id: merchantId })
          .eq('id', contract.id);

        if (updateError) {
          console.error(`Error linking contract ${contract.contract_number} to merchant:`, updateError);
          continue;
        }

        fixedCount++;
        console.log(`Successfully fixed contract ${contract.contract_number} -> merchant ${merchantId}`);

        // Handle business locations - create location assignments if needed
        for (const location of businessLocations) {
          console.log(`Processing location ${location.name} for contract ${contract.contract_number}`);
          
          // Check if location assignment already exists
          const { data: existingAssignment, error: assignmentSearchError } = await supabase
            .from('location_assignments')
            .select('id')
            .eq('contract_id', contract.id)
            .eq('location_id', location.id)
            .limit(1)
            .maybeSingle();

          if (assignmentSearchError) {
            console.error(`Error searching for location assignment:`, assignmentSearchError);
            continue;
          }

          if (!existingAssignment) {
            const { error: assignmentError } = await supabase
              .from('location_assignments')
              .insert({
                contract_id: contract.id,
                location_id: location.id
              });

            if (assignmentError) {
              console.error(`Error creating location assignment for contract ${contract.contract_number}, location ${location.id}:`, assignmentError);
            } else {
              linkedLocations++;
              console.log(`Successfully linked location ${location.name} to contract ${contract.contract_number}`);
            }
          } else {
            console.log(`Location assignment already exists for ${location.name} and contract ${contract.contract_number}`);
          }
        }
      }

      const result = { fixedCount, createdMerchants, linkedLocations };
      console.log('Comprehensive fix completed:', result);
      return result;
    },
    onSuccess: (result) => {
      console.log('Fix mutation completed successfully:', result);
      
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['business-locations'] });
      
      toast({
        title: "Oprava dokončená",
        description: `Opravených ${result.fixedCount} zmlúv, vytvorených ${result.createdMerchants} obchodníkov, prepojených ${result.linkedLocations} prevádzok.`,
      });
    },
    onError: (error: any) => {
      console.error('Comprehensive fix failed:', error);
      toast({
        title: "Chyba pri oprave",
        description: `Nepodarilo sa dokončiť opravu: ${error.message}`,
        variant: "destructive",
      });
    }
  });
};
