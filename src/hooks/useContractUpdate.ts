
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ContractStatus = Database['public']['Enums']['contract_status'];

// Helper function to convert frontend salutation to database format
const convertSalutationToDb = (salutation?: 'Pan' | 'Pani'): 'Pan' | 'Pani' | null => {
  return salutation || null;
};

// Helper function to convert frontend registry type to database format
const convertRegistryTypeToDb = (registryType: string): Database['public']['Enums']['registry_type'] => {
  switch (registryType) {
    case 'Nezisková organizácia':
      return 'public';
    case 'S.r.o.':
      return 'business';
    case 'Akciová spoločnosť':
      return 'business';
    case 'Živnosť':
    default:
      return 'other';
  }
};

// Helper function to validate required fields
const validateContractData = (data: OnboardingData): string[] => {
  const errors: string[] = [];
  
  if (!data.contactInfo?.firstName) errors.push('Meno kontaktnej osoby je povinné');
  if (!data.contactInfo?.lastName) errors.push('Priezvisko kontaktnej osoby je povinné');
  if (!data.contactInfo?.email) errors.push('Email je povinný');
  if (!data.companyInfo?.companyName) errors.push('Názov spoločnosti je povinný');
  if (!data.companyInfo?.ico) errors.push('IČO je povinné');
  
  return errors;
};

export const useContractUpdate = (contractId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, status }: { data: OnboardingData; status?: ContractStatus }) => {
      console.log('Starting contract update for ID:', contractId);
      console.log('Update data:', data);
      
      // Validate data before processing
      const validationErrors = validateContractData(data);
      if (validationErrors.length > 0) {
        console.error('Validation errors:', validationErrors);
        throw new Error(`Chyby validácie: ${validationErrors.join(', ')}`);
      }

      try {
        // Update contract status if provided
        if (status) {
          console.log('Updating contract status to:', status);
          const { error: contractError } = await supabase
            .from('contracts')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', contractId);
          
          if (contractError) {
            console.error('Error updating contract status:', contractError);
            throw new Error(`Chyba pri aktualizácii stavu zmluvy: ${contractError.message}`);
          }
        } else {
          // Update the updated_at timestamp
          const { error: contractError } = await supabase
            .from('contracts')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', contractId);
          
          if (contractError) {
            console.error('Error updating contract timestamp:', contractError);
            throw new Error(`Chyba pri aktualizácii zmluvy: ${contractError.message}`);
          }
        }

        // Update contact info if provided
        if (data.contactInfo) {
          console.log('Updating contact info...', data.contactInfo);
          const { data: existingContact } = await supabase
            .from('contact_info')
            .select('id')
            .eq('contract_id', contractId)
            .maybeSingle();

          const contactData = {
            salutation: convertSalutationToDb(data.contactInfo.salutation),
            first_name: data.contactInfo.firstName || '',
            last_name: data.contactInfo.lastName || '',
            email: data.contactInfo.email || '',
            phone: data.contactInfo.phone || '',
            phone_prefix: data.contactInfo.phonePrefix || '+421',
            sales_note: data.contactInfo.salesNote || null,
            user_role: data.contactInfo.userRole || null
          };

          if (existingContact) {
            const { error: contactError } = await supabase
              .from('contact_info')
              .update(contactData)
              .eq('contract_id', contractId);

            if (contactError) {
              console.error('Error updating contact info:', contactError);
              throw new Error(`Chyba pri aktualizácii kontaktných údajov: ${contactError.message}`);
            }
          } else {
            const { error: contactError } = await supabase
              .from('contact_info')
              .insert({
                contract_id: contractId,
                ...contactData
              });

            if (contactError) {
              console.error('Error inserting contact info:', contactError);
              throw new Error(`Chyba pri vytváraní kontaktných údajov: ${contactError.message}`);
            }
          }
        }

        // Update company info if provided
        if (data.companyInfo) {
          console.log('Updating company info...', data.companyInfo);
          const { data: existingCompany } = await supabase
            .from('company_info')
            .select('id')
            .eq('contract_id', contractId)
            .maybeSingle();

          // Combine first and last name for legacy field
          const contactPersonName = `${data.companyInfo.contactPerson?.firstName || ''} ${data.companyInfo.contactPerson?.lastName || ''}`.trim();

          const companyData = {
            ico: data.companyInfo.ico || '',
            dic: data.companyInfo.dic || '',
            company_name: data.companyInfo.companyName || '',
            registry_type: convertRegistryTypeToDb(data.companyInfo.registryType || 'Živnosť'),
            is_vat_payer: data.companyInfo.isVatPayer || false,
            vat_number: data.companyInfo.vatNumber || null,
            court: data.companyInfo.court || '',
            section: data.companyInfo.section || '',
            insert_number: data.companyInfo.insertNumber || '',
            address_street: data.companyInfo.address?.street || '',
            address_city: data.companyInfo.address?.city || '',
            address_zip_code: data.companyInfo.address?.zipCode || '',
            contact_address_street: data.companyInfo.contactAddress?.street || null,
            contact_address_city: data.companyInfo.contactAddress?.city || null,
            contact_address_zip_code: data.companyInfo.contactAddress?.zipCode || null,
            contact_address_same_as_main: data.companyInfo.contactAddressSameAsMain ?? true,
            // Legacy field - combine first and last name
            contact_person_name: contactPersonName || '',
            // New separate fields
            contact_person_first_name: data.companyInfo.contactPerson?.firstName || '',
            contact_person_last_name: data.companyInfo.contactPerson?.lastName || '',
            contact_person_email: data.companyInfo.contactPerson?.email || '',
            contact_person_phone: data.companyInfo.contactPerson?.phone || '',
            contact_person_is_technical: data.companyInfo.contactPerson?.isTechnicalPerson || false
          };

          if (existingCompany) {
            const { error: companyError } = await supabase
              .from('company_info')
              .update(companyData)
              .eq('contract_id', contractId);

            if (companyError) {
              console.error('Error updating company info:', companyError);
              throw new Error(`Chyba pri aktualizácii údajov spoločnosti: ${companyError.message}`);
            }
          } else {
            const { error: companyError } = await supabase
              .from('company_info')
              .insert({
                contract_id: contractId,
                ...companyData
              });

            if (companyError) {
              console.error('Error inserting company info:', companyError);
              throw new Error(`Chyba pri vytváraní údajov spoločnosti: ${companyError.message}`);
            }
          }
        }

        // Update business locations if provided
        if (data.businessLocations && data.businessLocations.length > 0) {
          console.log('Updating business locations...', data.businessLocations);
          
          for (const location of data.businessLocations) {
            const { data: existingLocation } = await supabase
              .from('business_locations')
              .select('id')
              .eq('contract_id', contractId)
              .eq('location_id', location.id)
              .maybeSingle();

            const locationData = {
              contract_id: contractId,
              location_id: location.id,
              name: location.name || '',
              has_pos: location.hasPOS || false,
              address_street: location.address?.street || '',
              address_city: location.address?.city || '',
              address_zip_code: location.address?.zipCode || '',
              iban: location.iban || '',
              contact_person_name: location.contactPerson?.name || '',
              contact_person_email: location.contactPerson?.email || '',
              contact_person_phone: location.contactPerson?.phone || '',
              business_sector: location.businessSector || '',
              estimated_turnover: location.estimatedTurnover || 0,
              average_transaction: location.averageTransaction || 0,
              opening_hours: location.openingHours || '',
              seasonality: (location.seasonality as 'year-round' | 'seasonal') || 'year-round',
              seasonal_weeks: location.seasonalWeeks || null
            };

            if (existingLocation) {
              const { error: locationError } = await supabase
                .from('business_locations')
                .update(locationData)
                .eq('id', existingLocation.id);

              if (locationError) {
                console.error('Error updating business location:', locationError);
                throw new Error(`Chyba pri aktualizácii prevádzky: ${locationError.message}`);
              }
            } else {
              const { error: locationError } = await supabase
                .from('business_locations')
                .insert(locationData);

              if (locationError) {
                console.error('Error inserting business location:', locationError);
                throw new Error(`Chyba pri vytváraní prevádzky: ${locationError.message}`);
              }
            }
          }
        }

        console.log('Contract updated successfully');
        return { success: true };

      } catch (error) {
        console.error('Error in contract update transaction:', error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(`Neočakávaná chyba pri aktualizácii zmluvy: ${String(error)}`);
      }
    },
    onSuccess: () => {
      console.log('Contract update successful, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['contract', contractId] });
      queryClient.invalidateQueries({ queryKey: ['contract-complete', contractId] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts-stats'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-contracts'] });
    },
    onError: (error) => {
      console.error('Error updating contract:', error);
      const errorMessage = error instanceof Error ? error.message : 'Neznáma chyba';
      
      toast({
        title: "Chyba pri aktualizácii",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });
};
