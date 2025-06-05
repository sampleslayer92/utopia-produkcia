
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

export const useContractUpdate = (contractId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, status }: { data: OnboardingData; status?: ContractStatus }) => {
      console.log('Updating contract:', contractId, data);

      try {
        // Update contract status if provided
        if (status) {
          const { error: contractError } = await supabase
            .from('contracts')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', contractId);
          
          if (contractError) {
            console.error('Error updating contract status:', contractError);
            throw contractError;
          }
        }

        const { data: existingContact } = await supabase
          .from('contact_info')
          .select('id')
          .eq('contract_id', contractId)
          .maybeSingle();

        if (existingContact) {
          const { error: contactError } = await supabase
            .from('contact_info')
            .update({
              salutation: convertSalutationToDb(data.contactInfo.salutation),
              first_name: data.contactInfo.firstName,
              last_name: data.contactInfo.lastName,
              email: data.contactInfo.email,
              phone: data.contactInfo.phone,
              phone_prefix: data.contactInfo.phonePrefix,
              sales_note: data.contactInfo.salesNote
            })
            .eq('contract_id', contractId);

          if (contactError) {
            console.error('Error updating contact info:', contactError);
            throw contactError;
          }
        } else {
          const { error: contactError } = await supabase
            .from('contact_info')
            .insert({
              contract_id: contractId,
              salutation: convertSalutationToDb(data.contactInfo.salutation),
              first_name: data.contactInfo.firstName,
              last_name: data.contactInfo.lastName,
              email: data.contactInfo.email,
              phone: data.contactInfo.phone,
              phone_prefix: data.contactInfo.phonePrefix,
              sales_note: data.contactInfo.salesNote
            });

          if (contactError) {
            console.error('Error inserting contact info:', contactError);
            throw contactError;
          }
        }

        const { data: existingCompany } = await supabase
          .from('company_info')
          .select('id')
          .eq('contract_id', contractId)
          .maybeSingle();

        // Combine first and last name for legacy field
        const contactPersonName = `${data.companyInfo.contactPerson.firstName} ${data.companyInfo.contactPerson.lastName}`.trim();

        const companyData = {
          ico: data.companyInfo.ico,
          dic: data.companyInfo.dic,
          company_name: data.companyInfo.companyName,
          registry_type: convertRegistryTypeToDb(data.companyInfo.registryType),
          is_vat_payer: data.companyInfo.isVatPayer,
          vat_number: data.companyInfo.vatNumber || null,
          court: data.companyInfo.court,
          section: data.companyInfo.section,
          insert_number: data.companyInfo.insertNumber,
          address_street: data.companyInfo.address.street,
          address_city: data.companyInfo.address.city,
          address_zip_code: data.companyInfo.address.zipCode,
          contact_address_street: data.companyInfo.contactAddress?.street,
          contact_address_city: data.companyInfo.contactAddress?.city,
          contact_address_zip_code: data.companyInfo.contactAddress?.zipCode,
          contact_address_same_as_main: data.companyInfo.contactAddressSameAsMain,
          // Legacy field - combine first and last name
          contact_person_name: contactPersonName,
          // New separate fields
          contact_person_first_name: data.companyInfo.contactPerson.firstName,
          contact_person_last_name: data.companyInfo.contactPerson.lastName,
          contact_person_email: data.companyInfo.contactPerson.email,
          contact_person_phone: data.companyInfo.contactPerson.phone,
          contact_person_is_technical: data.companyInfo.contactPerson.isTechnicalPerson
        };

        if (existingCompany) {
          const { error: companyError } = await supabase
            .from('company_info')
            .update(companyData)
            .eq('contract_id', contractId);

          if (companyError) {
            console.error('Error updating company info:', companyError);
            throw companyError;
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
            throw companyError;
          }
        }

        // Delete existing business locations and insert new ones
        const { error: deleteLocationsError } = await supabase
          .from('business_locations')
          .delete()
          .eq('contract_id', contractId);
        
        if (deleteLocationsError) {
          console.error('Error deleting business locations:', deleteLocationsError);
        }
        
        if (data.businessLocations.length > 0) {
          const { error: locationsError } = await supabase
            .from('business_locations')
            .insert(data.businessLocations.map(loc => ({
              contract_id: contractId,
              location_id: loc.id,
              name: loc.name,
              address_street: loc.address.street,
              address_city: loc.address.city,
              address_zip_code: loc.address.zipCode,
              contact_person_name: loc.contactPerson.name,
              contact_person_phone: loc.contactPerson.phone,
              contact_person_email: loc.contactPerson.email,
              business_sector: loc.businessSector,
              estimated_turnover: loc.estimatedTurnover,
              average_transaction: loc.averageTransaction,
              iban: loc.iban,
              opening_hours: loc.openingHours,
              seasonality: loc.seasonality,
              seasonal_weeks: loc.seasonalWeeks,
              has_pos: loc.hasPOS
            })));

          if (locationsError) {
            console.error('Error inserting business locations:', locationsError);
            throw locationsError;
          }
        }

        // Handle device selection - check if exists, then update or insert
        const { data: existingDevice } = await supabase
          .from('device_selection')
          .select('id')
          .eq('contract_id', contractId)
          .maybeSingle();

        // Extract device data from dynamic cards
        const deviceCards = data.deviceSelection.dynamicCards.filter(card => card.type === 'device');
        const paxA920Pro = deviceCards.find(card => card.name === 'PAX A920 PRO');
        const paxA80 = deviceCards.find(card => card.name === 'PAX A80');
        const tablet10 = deviceCards.find(card => card.name === 'Tablet 10"');
        const tablet15 = deviceCards.find(card => card.name === 'Tablet 15"');
        const tabletPro15 = deviceCards.find(card => card.name === 'Tablet Pro 15"');

        const deviceData = {
          pax_a920_pro_count: paxA920Pro?.count || 0,
          pax_a920_pro_monthly_fee: paxA920Pro?.monthlyFee || 0,
          pax_a920_pro_sim_cards: (paxA920Pro as any)?.simCards || 0,
          pax_a80_count: paxA80?.count || 0,
          pax_a80_monthly_fee: paxA80?.monthlyFee || 0,
          tablet_10_count: tablet10?.count || 0,
          tablet_10_monthly_fee: tablet10?.monthlyFee || 0,
          tablet_15_count: tablet15?.count || 0,
          tablet_15_monthly_fee: tablet15?.monthlyFee || 0,
          tablet_pro_15_count: tabletPro15?.count || 0,
          tablet_pro_15_monthly_fee: tabletPro15?.monthlyFee || 0,
          software_licenses: data.deviceSelection.dynamicCards.filter(card => card.category === 'software').map(card => card.name),
          accessories: data.deviceSelection.dynamicCards.filter(card => card.category === 'accessories').map(card => card.name),
          ecommerce: data.deviceSelection.dynamicCards.filter(card => card.category === 'ecommerce').map(card => card.name),
          technical_service: data.deviceSelection.dynamicCards.filter(card => card.category === 'technical').map(card => card.name),
          mif_regulated_cards: data.fees.regulatedCards,
          mif_unregulated_cards: data.fees.unregulatedCards,
          mif_dcc_rabat: 0,
          transaction_types: [],
          note: data.deviceSelection.note
        };

        if (existingDevice) {
          const { error: deviceError } = await supabase
            .from('device_selection')
            .update(deviceData)
            .eq('contract_id', contractId);

          if (deviceError) {
            console.error('Error updating device selection:', deviceError);
            throw deviceError;
          }
        } else {
          const { error: deviceError } = await supabase
            .from('device_selection')
            .insert({
              contract_id: contractId,
              ...deviceData
            });

          if (deviceError) {
            console.error('Error inserting device selection:', deviceError);
            throw deviceError;
          }
        }

        // Delete existing authorized persons and insert new ones
        const { error: deleteAuthPersonsError } = await supabase
          .from('authorized_persons')
          .delete()
          .eq('contract_id', contractId);
        
        if (deleteAuthPersonsError) {
          console.error('Error deleting authorized persons:', deleteAuthPersonsError);
        }
        
        if (data.authorizedPersons.length > 0) {
          const { error: authPersonsError } = await supabase
            .from('authorized_persons')
            .insert(data.authorizedPersons.map(person => ({
              contract_id: contractId,
              person_id: person.id,
              first_name: person.firstName,
              last_name: person.lastName,
              birth_date: person.birthDate,
              birth_place: person.birthPlace,
              birth_number: person.birthNumber,
              maiden_name: person.maidenName,
              citizenship: person.citizenship,
              permanent_address: person.permanentAddress,
              document_type: person.documentType,
              document_number: person.documentNumber || '',
              document_validity: person.documentValidity,
              document_issuer: person.documentIssuer,
              document_country: person.documentCountry,
              position: person.position,
              phone: person.phone,
              email: person.email,
              is_politically_exposed: person.isPoliticallyExposed,
              is_us_citizen: person.isUSCitizen
            })));

          if (authPersonsError) {
            console.error('Error inserting authorized persons:', authPersonsError);
            throw authPersonsError;
          }
        }

        // Delete existing actual owners and insert new ones
        const { error: deleteOwnersError } = await supabase
          .from('actual_owners')
          .delete()
          .eq('contract_id', contractId);
        
        if (deleteOwnersError) {
          console.error('Error deleting actual owners:', deleteOwnersError);
        }
        
        if (data.actualOwners.length > 0) {
          const { error: ownersError } = await supabase
            .from('actual_owners')
            .insert(data.actualOwners.map(owner => ({
              contract_id: contractId,
              owner_id: owner.id,
              first_name: owner.firstName,
              last_name: owner.lastName,
              birth_date: owner.birthDate,
              birth_place: owner.birthPlace,
              birth_number: owner.birthNumber,
              maiden_name: owner.maidenName,
              citizenship: owner.citizenship,
              permanent_address: owner.permanentAddress,
              is_politically_exposed: owner.isPoliticallyExposed
            })));

          if (ownersError) {
            console.error('Error inserting actual owners:', ownersError);
            throw ownersError;
          }
        }

        // Handle consents - check if exists, then update or insert
        const { data: existingConsents } = await supabase
          .from('consents')
          .select('id')
          .eq('contract_id', contractId)
          .maybeSingle();

        const consentsData = {
          gdpr_consent: data.consents.gdpr,
          terms_consent: data.consents.terms,
          electronic_communication_consent: data.consents.electronicCommunication,
          signature_date: data.consents.signatureDate || null,
          signing_person_id: data.consents.signingPersonId || null
        };

        if (existingConsents) {
          const { error: consentsError } = await supabase
            .from('consents')
            .update(consentsData)
            .eq('contract_id', contractId);

          if (consentsError) {
            console.error('Error updating consents:', consentsError);
            throw consentsError;
          }
        } else {
          const { error: consentsError } = await supabase
            .from('consents')
            .insert({
              contract_id: contractId,
              ...consentsData
            });

          if (consentsError) {
            console.error('Error inserting consents:', consentsError);
            throw consentsError;
          }
        }

        console.log('Contract updated successfully');
        return { success: true };

      } catch (error) {
        console.error('Error in contract update transaction:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', contractId] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts-stats'] });
      toast({
        title: "Zmluva aktualizovaná",
        description: "Zmeny boli úspešne uložené.",
      });
    },
    onError: (error) => {
      console.error('Error updating contract:', error);
      toast({
        title: "Chyba pri aktualizácii",
        description: "Nepodarilo sa uložiť zmeny. Skúste to znovu.",
        variant: "destructive",
      });
    }
  });
};
