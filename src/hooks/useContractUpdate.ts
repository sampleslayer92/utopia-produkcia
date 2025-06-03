
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ContractStatus = Database['public']['Enums']['contract_status'];

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

        // Handle contact info - check if exists, then update or insert
        const { data: existingContact } = await supabase
          .from('contact_info')
          .select('id')
          .eq('contract_id', contractId)
          .maybeSingle();

        if (existingContact) {
          const { error: contactError } = await supabase
            .from('contact_info')
            .update({
              salutation: data.contactInfo.salutation || null,
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
              salutation: data.contactInfo.salutation || null,
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

        // Handle company info - check if exists, then update or insert
        const { data: existingCompany } = await supabase
          .from('company_info')
          .select('id')
          .eq('contract_id', contractId)
          .maybeSingle();

        const companyData = {
          ico: data.companyInfo.ico,
          dic: data.companyInfo.dic,
          company_name: data.companyInfo.companyName,
          registry_type: (data.companyInfo.registryType || 'other') as Database['public']['Enums']['registry_type'],
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
          contact_person_name: data.companyInfo.contactPerson.name,
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

        const deviceData = {
          pax_a920_pro_count: data.deviceSelection.terminals.paxA920Pro.count,
          pax_a920_pro_monthly_fee: data.deviceSelection.terminals.paxA920Pro.monthlyFee,
          pax_a920_pro_sim_cards: data.deviceSelection.terminals.paxA920Pro.simCards,
          pax_a80_count: data.deviceSelection.terminals.paxA80.count,
          pax_a80_monthly_fee: data.deviceSelection.terminals.paxA80.monthlyFee,
          tablet_10_count: data.deviceSelection.tablets.tablet10.count,
          tablet_10_monthly_fee: data.deviceSelection.tablets.tablet10.monthlyFee,
          tablet_15_count: data.deviceSelection.tablets.tablet15.count,
          tablet_15_monthly_fee: data.deviceSelection.tablets.tablet15.monthlyFee,
          tablet_pro_15_count: data.deviceSelection.tablets.tabletPro15.count,
          tablet_pro_15_monthly_fee: data.deviceSelection.tablets.tabletPro15.monthlyFee,
          software_licenses: data.deviceSelection.softwareLicenses,
          accessories: data.deviceSelection.accessories,
          ecommerce: data.deviceSelection.ecommerce,
          technical_service: data.deviceSelection.technicalService,
          mif_regulated_cards: data.deviceSelection.mifFees.regulatedCards,
          mif_unregulated_cards: data.deviceSelection.mifFees.unregulatedCards,
          mif_dcc_rabat: data.deviceSelection.mifFees.dccRabat,
          transaction_types: data.deviceSelection.transactionTypes,
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
