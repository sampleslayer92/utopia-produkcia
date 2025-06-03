
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
        .insert({
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          notes: 'Contract submitted via onboarding portal'
        })
        .select('id, contract_number')
        .single();

      if (contractError) {
        console.error('Contract creation error:', contractError);
        throw contractError;
      }

      console.log('Contract created:', contract);
      const contractId = contract.id;

      // Helper function to provide safe defaults
      const safeString = (value: string | undefined, defaultValue: string) => 
        value && value.trim() ? value : defaultValue;
      
      const safeEmail = (value: string | undefined) => 
        value && value.trim() && value.includes('@') ? value : 'test@test.sk';

      // 2. Insert contact info with safe defaults
      const { error: contactError } = await supabase
        .from('contact_info')
        .insert({
          contract_id: contractId,
          salutation: onboardingData.contactInfo.salutation || null,
          first_name: safeString(onboardingData.contactInfo.firstName, 'Test'),
          last_name: safeString(onboardingData.contactInfo.lastName, 'Test'),
          email: safeEmail(onboardingData.contactInfo.email),
          phone: safeString(onboardingData.contactInfo.phone, '000000000'),
          phone_prefix: onboardingData.contactInfo.phonePrefix || '+421',
          sales_note: onboardingData.contactInfo.salesNote || null
        });

      if (contactError) {
        console.error('Contact info error:', contactError);
        throw contactError;
      }

      // 3. Insert company info with safe defaults
      const registryType = onboardingData.companyInfo.registryType;
      const validRegistryType = registryType === 'public' || registryType === 'business' || registryType === 'other' 
        ? registryType 
        : 'other';

      const { error: companyError } = await supabase
        .from('company_info')
        .insert({
          contract_id: contractId,
          ico: safeString(onboardingData.companyInfo.ico, '00000000'),
          dic: safeString(onboardingData.companyInfo.dic, '00000000'),
          company_name: safeString(onboardingData.companyInfo.companyName, 'Test Company'),
          registry_type: validRegistryType,
          court: onboardingData.companyInfo.court || null,
          section: onboardingData.companyInfo.section || null,
          insert_number: onboardingData.companyInfo.insertNumber || null,
          address_street: safeString(onboardingData.companyInfo.address.street, 'Test Street 1'),
          address_city: safeString(onboardingData.companyInfo.address.city, 'Test City'),
          address_zip_code: safeString(onboardingData.companyInfo.address.zipCode, '00000'),
          contact_address_street: onboardingData.companyInfo.contactAddress?.street || null,
          contact_address_city: onboardingData.companyInfo.contactAddress?.city || null,
          contact_address_zip_code: onboardingData.companyInfo.contactAddress?.zipCode || null,
          contact_address_same_as_main: onboardingData.companyInfo.contactAddressSameAsMain,
          contact_person_name: safeString(onboardingData.companyInfo.contactPerson.name, 'Test Contact'),
          contact_person_email: safeEmail(onboardingData.companyInfo.contactPerson.email),
          contact_person_phone: safeString(onboardingData.companyInfo.contactPerson.phone, '000000000'),
          contact_person_is_technical: onboardingData.companyInfo.contactPerson.isTechnicalPerson
        });

      if (companyError) {
        console.error('Company info error:', companyError);
        throw companyError;
      }

      // 4. Insert business locations (only if not empty)
      if (onboardingData.businessLocations && onboardingData.businessLocations.length > 0) {
        for (const location of onboardingData.businessLocations) {
          // Skip empty locations
          if (!location.name && !location.address.street) continue;
          
          const { error: locationError } = await supabase
            .from('business_locations')
            .insert({
              contract_id: contractId,
              location_id: location.id,
              name: safeString(location.name, 'Test Location'),
              has_pos: location.hasPOS || false,
              address_street: safeString(location.address.street, 'Test Street 1'),
              address_city: safeString(location.address.city, 'Test City'),
              address_zip_code: safeString(location.address.zipCode, '00000'),
              iban: safeString(location.iban, 'SK0000000000000000000000'),
              contact_person_name: safeString(location.contactPerson.name, 'Test Contact'),
              contact_person_email: safeEmail(location.contactPerson.email),
              contact_person_phone: safeString(location.contactPerson.phone, '000000000'),
              business_sector: safeString(location.businessSector, 'Other'),
              estimated_turnover: location.estimatedTurnover || 0,
              average_transaction: location.averageTransaction || 0,
              opening_hours: safeString(location.openingHours, '9:00-17:00'),
              seasonality: location.seasonality || 'year-round',
              seasonal_weeks: location.seasonalWeeks || null
            });

          if (locationError) {
            console.error('Location error:', locationError);
            throw locationError;
          }

          // Insert location assignments (only if persons exist)
          if (location.assignedPersons && location.assignedPersons.length > 0) {
            for (const personId of location.assignedPersons) {
              const { error: assignmentError } = await supabase
                .from('location_assignments')
                .insert({
                  contract_id: contractId,
                  person_id: personId,
                  location_id: location.id
                });

              if (assignmentError) {
                console.error('Assignment error:', assignmentError);
                throw assignmentError;
              }
            }
          }
        }
      }

      // 5. Insert device selection with safe defaults - extract data from dynamic cards
      const deviceCards = onboardingData.deviceSelection?.dynamicCards?.filter(card => card.type === 'device') || [];
      
      // Extract device counts from dynamic cards
      const paxA920Pro = deviceCards.find(card => card.name === 'PAX A920 PRO');
      const paxA80 = deviceCards.find(card => card.name === 'PAX A80');
      const tablet10 = deviceCards.find(card => card.name === 'Tablet 10"');
      const tablet15 = deviceCards.find(card => card.name === 'Tablet 15"');
      const tabletPro15 = deviceCards.find(card => card.name === 'Tablet Pro 15"');

      const { error: deviceError } = await supabase
        .from('device_selection')
        .insert({
          contract_id: contractId,
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
          software_licenses: onboardingData.deviceSelection?.dynamicCards?.filter(card => card.category === 'software').map(card => card.name) || [],
          accessories: onboardingData.deviceSelection?.dynamicCards?.filter(card => card.category === 'accessories').map(card => card.name) || [],
          ecommerce: onboardingData.deviceSelection?.dynamicCards?.filter(card => card.category === 'ecommerce').map(card => card.name) || [],
          technical_service: onboardingData.deviceSelection?.dynamicCards?.filter(card => card.category === 'technical').map(card => card.name) || [],
          transaction_types: [],
          mif_regulated_cards: onboardingData.fees?.regulatedCards || 0,
          mif_unregulated_cards: onboardingData.fees?.unregulatedCards || 0,
          mif_dcc_rabat: 0,
          note: onboardingData.deviceSelection?.note || null
        });

      if (deviceError) {
        console.error('Device selection error:', deviceError);
        throw deviceError;
      }

      // 6. Insert authorized persons (only if not empty)
      if (onboardingData.authorizedPersons && onboardingData.authorizedPersons.length > 0) {
        for (const person of onboardingData.authorizedPersons) {
          // Skip empty persons
          if (!person.firstName && !person.lastName) continue;
          
          const { error: personError } = await supabase
            .from('authorized_persons')
            .insert({
              contract_id: contractId,
              person_id: person.id,
              first_name: safeString(person.firstName, 'Test'),
              last_name: safeString(person.lastName, 'Test'),
              email: safeEmail(person.email),
              phone: safeString(person.phone, '000000000'),
              maiden_name: person.maidenName || null,
              birth_date: person.birthDate || '1990-01-01',
              birth_place: safeString(person.birthPlace, 'Test City'),
              birth_number: safeString(person.birthNumber, '000000/0000'),
              permanent_address: safeString(person.permanentAddress, 'Test Address'),
              position: safeString(person.position, 'Test Position'),
              document_type: person.documentType || 'OP',
              document_number: safeString(person.documentNumber, '000000000'),
              document_validity: person.documentValidity || '2030-12-31',
              document_issuer: safeString(person.documentIssuer, 'Test Issuer'),
              document_country: safeString(person.documentCountry, 'SK'),
              citizenship: safeString(person.citizenship, 'SK'),
              is_politically_exposed: person.isPoliticallyExposed || false,
              is_us_citizen: person.isUSCitizen || false
            });

          if (personError) {
            console.error('Person error:', personError);
            throw personError;
          }
        }
      }

      // 7. Insert actual owners (only if not empty)
      if (onboardingData.actualOwners && onboardingData.actualOwners.length > 0) {
        for (const owner of onboardingData.actualOwners) {
          // Skip empty owners
          if (!owner.firstName && !owner.lastName) continue;
          
          const { error: ownerError } = await supabase
            .from('actual_owners')
            .insert({
              contract_id: contractId,
              owner_id: owner.id,
              first_name: safeString(owner.firstName, 'Test'),
              last_name: safeString(owner.lastName, 'Test'),
              maiden_name: owner.maidenName || null,
              birth_date: owner.birthDate || '1990-01-01',
              birth_place: safeString(owner.birthPlace, 'Test City'),
              birth_number: safeString(owner.birthNumber, '000000/0000'),
              citizenship: safeString(owner.citizenship, 'SK'),
              permanent_address: safeString(owner.permanentAddress, 'Test Address'),
              is_politically_exposed: owner.isPoliticallyExposed || false
            });

          if (ownerError) {
            console.error('Owner error:', ownerError);
            throw ownerError;
          }
        }
      }

      // 8. Insert consents with safe defaults
      const { error: consentsError } = await supabase
        .from('consents')
        .insert({
          contract_id: contractId,
          gdpr_consent: onboardingData.consents?.gdpr || false,
          terms_consent: onboardingData.consents?.terms || false,
          electronic_communication_consent: onboardingData.consents?.electronicCommunication || false,
          signature_date: onboardingData.consents?.signatureDate || null,
          signing_person_id: onboardingData.consents?.signingPersonId || null
        });

      if (consentsError) {
        console.error('Consents error:', consentsError);
        throw consentsError;
      }

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
