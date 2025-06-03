
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';
import { toast } from '@/hooks/use-toast';

export const useContractUpdate = (contractId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, status }: { data: OnboardingData; status?: string }) => {
      console.log('Updating contract:', contractId, data);

      // Update contract status if provided
      if (status) {
        const { error: contractError } = await supabase
          .from('contracts')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', contractId);
        
        if (contractError) throw contractError;
      }

      // Update contact info
      const { error: contactError } = await supabase
        .from('contact_info')
        .upsert({
          contract_id: contractId,
          salutation: data.contactInfo.salutation,
          first_name: data.contactInfo.firstName,
          last_name: data.contactInfo.lastName,
          email: data.contactInfo.email,
          phone: data.contactInfo.phone,
          phone_prefix: data.contactInfo.phonePrefix,
          sales_note: data.contactInfo.salesNote
        });

      if (contactError) throw contactError;

      // Update company info
      const { error: companyError } = await supabase
        .from('company_info')
        .upsert({
          contract_id: contractId,
          ico: data.companyInfo.ico,
          dic: data.companyInfo.dic,
          company_name: data.companyInfo.companyName,
          registry_type: data.companyInfo.registryType,
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
        });

      if (companyError) throw companyError;

      // Delete existing business locations and insert new ones
      await supabase.from('business_locations').delete().eq('contract_id', contractId);
      
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

        if (locationsError) throw locationsError;
      }

      // Update device selection
      const { error: deviceError } = await supabase
        .from('device_selection')
        .upsert({
          contract_id: contractId,
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
        });

      if (deviceError) throw deviceError;

      // Delete existing authorized persons and insert new ones
      await supabase.from('authorized_persons').delete().eq('contract_id', contractId);
      
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
            document_number: person.documentNumber,
            document_validity: person.documentValidity,
            document_issuer: person.documentIssuer,
            document_country: person.documentCountry,
            position: person.position,
            phone: person.phone,
            email: person.email,
            is_politically_exposed: person.isPoliticallyExposed,
            is_us_citizen: person.isUSCitizen
          })));

        if (authPersonsError) throw authPersonsError;
      }

      // Delete existing actual owners and insert new ones
      await supabase.from('actual_owners').delete().eq('contract_id', contractId);
      
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

        if (ownersError) throw ownersError;
      }

      // Update consents
      const { error: consentsError } = await supabase
        .from('consents')
        .upsert({
          contract_id: contractId,
          gdpr_consent: data.consents.gdpr,
          terms_consent: data.consents.terms,
          electronic_communication_consent: data.consents.electronicCommunication,
          signature_date: data.consents.signatureDate || null,
          signing_person_id: data.consents.signingPersonId || null
        });

      if (consentsError) throw consentsError;

      console.log('Contract updated successfully');
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', contractId] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
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
