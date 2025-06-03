
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';
import { toast } from 'sonner';

export const useContractSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContract = async (onboardingData: OnboardingData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Starting contract submission...', onboardingData);
      
      // 1. Create main contract
      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .insert([{
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          notes: 'Contract submitted via onboarding portal'
        }])
        .select('id, contract_number')
        .single();

      if (contractError) {
        console.error('Contract creation error:', contractError);
        throw contractError;
      }

      console.log('Contract created:', contract);
      const contractId = contract.id;

      // 2. Insert contact info
      const { error: contactError } = await supabase
        .from('contact_info')
        .insert([{
          contract_id: contractId,
          salutation: onboardingData.contactInfo.salutation || null,
          first_name: onboardingData.contactInfo.firstName,
          last_name: onboardingData.contactInfo.lastName,
          email: onboardingData.contactInfo.email,
          phone: onboardingData.contactInfo.phone,
          phone_prefix: onboardingData.contactInfo.phonePrefix,
          sales_note: onboardingData.contactInfo.salesNote || null
        }]);

      if (contactError) throw contactError;

      // 3. Insert company info
      const { error: companyError } = await supabase
        .from('company_info')
        .insert([{
          contract_id: contractId,
          ico: onboardingData.companyInfo.ico,
          dic: onboardingData.companyInfo.dic,
          company_name: onboardingData.companyInfo.companyName,
          registry_type: onboardingData.companyInfo.registryType,
          court: onboardingData.companyInfo.court || null,
          section: onboardingData.companyInfo.section || null,
          insert_number: onboardingData.companyInfo.insertNumber || null,
          address_street: onboardingData.companyInfo.address.street,
          address_city: onboardingData.companyInfo.address.city,
          address_zip_code: onboardingData.companyInfo.address.zipCode,
          contact_address_street: onboardingData.companyInfo.contactAddress?.street || null,
          contact_address_city: onboardingData.companyInfo.contactAddress?.city || null,
          contact_address_zip_code: onboardingData.companyInfo.contactAddress?.zipCode || null,
          contact_address_same_as_main: onboardingData.companyInfo.contactAddressSameAsMain,
          contact_person_name: onboardingData.companyInfo.contactPerson.name,
          contact_person_email: onboardingData.companyInfo.contactPerson.email,
          contact_person_phone: onboardingData.companyInfo.contactPerson.phone,
          contact_person_is_technical: onboardingData.companyInfo.contactPerson.isTechnicalPerson
        }]);

      if (companyError) throw companyError;

      // 4. Insert business locations
      for (const location of onboardingData.businessLocations) {
        const { error: locationError } = await supabase
          .from('business_locations')
          .insert([{
            contract_id: contractId,
            location_id: location.id,
            name: location.name,
            has_pos: location.hasPOS,
            address_street: location.address.street,
            address_city: location.address.city,
            address_zip_code: location.address.zipCode,
            iban: location.iban,
            contact_person_name: location.contactPerson.name,
            contact_person_email: location.contactPerson.email,
            contact_person_phone: location.contactPerson.phone,
            business_sector: location.businessSector,
            estimated_turnover: location.estimatedTurnover,
            average_transaction: location.averageTransaction,
            opening_hours: location.openingHours,
            seasonality: location.seasonality,
            seasonal_weeks: location.seasonalWeeks || null
          }]);

        if (locationError) throw locationError;

        // Insert location assignments
        for (const personId of location.assignedPersons) {
          const { error: assignmentError } = await supabase
            .from('location_assignments')
            .insert([{
              contract_id: contractId,
              person_id: personId,
              location_id: location.id
            }]);

          if (assignmentError) throw assignmentError;
        }
      }

      // 5. Insert device selection
      const { error: deviceError } = await supabase
        .from('device_selection')
        .insert([{
          contract_id: contractId,
          pax_a920_pro_count: onboardingData.deviceSelection.terminals.paxA920Pro.count,
          pax_a920_pro_monthly_fee: onboardingData.deviceSelection.terminals.paxA920Pro.monthlyFee,
          pax_a920_pro_sim_cards: onboardingData.deviceSelection.terminals.paxA920Pro.simCards,
          pax_a80_count: onboardingData.deviceSelection.terminals.paxA80.count,
          pax_a80_monthly_fee: onboardingData.deviceSelection.terminals.paxA80.monthlyFee,
          tablet_10_count: onboardingData.deviceSelection.tablets.tablet10.count,
          tablet_10_monthly_fee: onboardingData.deviceSelection.tablets.tablet10.monthlyFee,
          tablet_15_count: onboardingData.deviceSelection.tablets.tablet15.count,
          tablet_15_monthly_fee: onboardingData.deviceSelection.tablets.tablet15.monthlyFee,
          tablet_pro_15_count: onboardingData.deviceSelection.tablets.tabletPro15.count,
          tablet_pro_15_monthly_fee: onboardingData.deviceSelection.tablets.tabletPro15.monthlyFee,
          software_licenses: onboardingData.deviceSelection.softwareLicenses,
          accessories: onboardingData.deviceSelection.accessories,
          ecommerce: onboardingData.deviceSelection.ecommerce,
          technical_service: onboardingData.deviceSelection.technicalService,
          transaction_types: onboardingData.deviceSelection.transactionTypes,
          mif_regulated_cards: onboardingData.deviceSelection.mifFees.regulatedCards,
          mif_unregulated_cards: onboardingData.deviceSelection.mifFees.unregulatedCards,
          mif_dcc_rabat: onboardingData.deviceSelection.mifFees.dccRabat,
          note: onboardingData.deviceSelection.note || null
        }]);

      if (deviceError) throw deviceError;

      // 6. Insert authorized persons
      for (const person of onboardingData.authorizedPersons) {
        const { error: personError } = await supabase
          .from('authorized_persons')
          .insert([{
            contract_id: contractId,
            person_id: person.id,
            first_name: person.firstName,
            last_name: person.lastName,
            email: person.email,
            phone: person.phone,
            maiden_name: person.maidenName || null,
            birth_date: person.birthDate,
            birth_place: person.birthPlace,
            birth_number: person.birthNumber,
            permanent_address: person.permanentAddress,
            position: person.position,
            document_type: person.documentType,
            document_number: person.documentNumber,
            document_validity: person.documentValidity,
            document_issuer: person.documentIssuer,
            document_country: person.documentCountry,
            citizenship: person.citizenship,
            is_politically_exposed: person.isPoliticallyExposed,
            is_us_citizen: person.isUSCitizen
          }]);

        if (personError) throw personError;
      }

      // 7. Insert actual owners
      for (const owner of onboardingData.actualOwners) {
        const { error: ownerError } = await supabase
          .from('actual_owners')
          .insert([{
            contract_id: contractId,
            owner_id: owner.id,
            first_name: owner.firstName,
            last_name: owner.lastName,
            maiden_name: owner.maidenName || null,
            birth_date: owner.birthDate,
            birth_place: owner.birthPlace,
            birth_number: owner.birthNumber,
            citizenship: owner.citizenship,
            permanent_address: owner.permanentAddress,
            is_politically_exposed: owner.isPoliticallyExposed
          }]);

        if (ownerError) throw ownerError;
      }

      // 8. Insert consents
      const { error: consentsError } = await supabase
        .from('consents')
        .insert([{
          contract_id: contractId,
          gdpr_consent: onboardingData.consents.gdpr,
          terms_consent: onboardingData.consents.terms,
          electronic_communication_consent: onboardingData.consents.electronicCommunication,
          signature_date: onboardingData.consents.signatureDate || null,
          signing_person_id: onboardingData.consents.signingPersonId || null
        }]);

      if (consentsError) throw consentsError;

      console.log('Contract submission completed successfully');
      
      toast.success('Registrácia úspešne odoslaná!', {
        description: `Číslo zmluvy: ${contract.contract_number}`
      });

      return {
        success: true,
        contractId: contractId,
        contractNumber: contract.contract_number
      };

    } catch (error) {
      console.error('Contract submission error:', error);
      
      toast.error('Chyba pri odosielaní registrácie', {
        description: 'Skúste to prosím znova alebo kontaktujte podporu'
      });

      return {
        success: false,
        error: error
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitContract,
    isSubmitting
  };
};
