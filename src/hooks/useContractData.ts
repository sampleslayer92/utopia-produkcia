
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';

export const useContractData = (contractId: string) => {
  return useQuery({
    queryKey: ['contract', contractId],
    queryFn: async () => {
      console.log('Fetching complete contract data for:', contractId);
      
      // Fetch all related data for the contract
      const [
        { data: contract, error: contractError },
        { data: contactInfo, error: contactError },
        { data: companyInfo, error: companyError },
        { data: businessLocations, error: locationsError },
        { data: deviceSelection, error: deviceError },
        { data: authorizedPersons, error: authPersonsError },
        { data: actualOwners, error: ownersError },
        { data: consents, error: consentsError }
      ] = await Promise.all([
        supabase.from('contracts').select('*').eq('id', contractId).single(),
        supabase.from('contact_info').select('*').eq('contract_id', contractId).maybeSingle(),
        supabase.from('company_info').select('*').eq('contract_id', contractId).maybeSingle(),
        supabase.from('business_locations').select('*').eq('contract_id', contractId),
        supabase.from('device_selection').select('*').eq('contract_id', contractId).maybeSingle(),
        supabase.from('authorized_persons').select('*').eq('contract_id', contractId),
        supabase.from('actual_owners').select('*').eq('contract_id', contractId),
        supabase.from('consents').select('*').eq('contract_id', contractId).maybeSingle()
      ]);

      if (contractError) throw contractError;
      if (contactError) throw contactError;
      if (companyError) throw companyError;
      if (locationsError) throw locationsError;
      if (deviceError) throw deviceError;
      if (authPersonsError) throw authPersonsError;
      if (ownersError) throw ownersError;
      if (consentsError) throw consentsError;

      // Transform data to OnboardingData format
      const onboardingData: OnboardingData = {
        contactInfo: contactInfo ? {
          salutation: (contactInfo.salutation || '') as 'Pan' | 'Pani' | '',
          firstName: contactInfo.first_name || '',
          lastName: contactInfo.last_name || '',
          email: contactInfo.email || '',
          phone: contactInfo.phone || '',
          phonePrefix: contactInfo.phone_prefix || '+421',
          salesNote: contactInfo.sales_note || ''
        } : {
          salutation: '', firstName: '', lastName: '', email: '', phone: '', phonePrefix: '+421', salesNote: ''
        },
        
        companyInfo: companyInfo ? {
          ico: companyInfo.ico || '',
          dic: companyInfo.dic || '',
          companyName: companyInfo.company_name || '',
          registryType: (companyInfo.registry_type || '') as 'public' | 'business' | 'other' | '',
          court: companyInfo.court || '',
          section: companyInfo.section || '',
          insertNumber: companyInfo.insert_number || '',
          address: {
            street: companyInfo.address_street || '',
            city: companyInfo.address_city || '',
            zipCode: companyInfo.address_zip_code || ''
          },
          contactAddress: {
            street: companyInfo.contact_address_street || '',
            city: companyInfo.contact_address_city || '',
            zipCode: companyInfo.contact_address_zip_code || ''
          },
          contactAddressSameAsMain: companyInfo.contact_address_same_as_main ?? true,
          contactPerson: {
            name: companyInfo.contact_person_name || '',
            email: companyInfo.contact_person_email || '',
            phone: companyInfo.contact_person_phone || '',
            isTechnicalPerson: companyInfo.contact_person_is_technical ?? false
          }
        } : {
          ico: '', dic: '', companyName: '', registryType: '', court: '', section: '', insertNumber: '',
          address: { street: '', city: '', zipCode: '' },
          contactAddress: { street: '', city: '', zipCode: '' },
          contactAddressSameAsMain: true,
          contactPerson: { name: '', email: '', phone: '', isTechnicalPerson: false }
        },
        
        businessLocations: businessLocations?.map(loc => ({
          id: loc.location_id,
          name: loc.name,
          address: {
            street: loc.address_street,
            city: loc.address_city,
            zipCode: loc.address_zip_code
          },
          contactPerson: {
            name: loc.contact_person_name,
            phone: loc.contact_person_phone,
            email: loc.contact_person_email
          },
          businessSector: loc.business_sector,
          estimatedTurnover: loc.estimated_turnover,
          averageTransaction: loc.average_transaction,
          iban: loc.iban,
          openingHours: loc.opening_hours,
          seasonality: loc.seasonality,
          seasonalWeeks: loc.seasonal_weeks,
          hasPOS: loc.has_pos,
          assignedPersons: [] // Initialize as empty array since this isn't stored in DB
        })) || [],
        
        deviceSelection: deviceSelection ? {
          selectedSolutions: [], // Will be determined from existing data
          dynamicCards: [
            // Convert PAX terminals to dynamic cards
            ...(deviceSelection.pax_a920_pro_count > 0 ? [{
              id: 'pax-a920-pro-legacy',
              type: 'device' as const,
              category: 'terminal',
              name: 'PAX A920 PRO',
              description: 'Mobilný terminál',
              count: deviceSelection.pax_a920_pro_count,
              monthlyFee: deviceSelection.pax_a920_pro_monthly_fee || 0,
              simCards: deviceSelection.pax_a920_pro_sim_cards || 0,
              specifications: []
            }] : []),
            ...(deviceSelection.pax_a80_count > 0 ? [{
              id: 'pax-a80-legacy',
              type: 'device' as const,
              category: 'terminal',
              name: 'PAX A80',
              description: 'Stacionárny terminál',
              count: deviceSelection.pax_a80_count,
              monthlyFee: deviceSelection.pax_a80_monthly_fee || 0,
              specifications: []
            }] : []),
            // Convert tablets to dynamic cards
            ...(deviceSelection.tablet_10_count > 0 ? [{
              id: 'tablet-10-legacy',
              type: 'device' as const,
              category: 'pos',
              name: 'Tablet 10"',
              description: 'Kompaktný tablet pre POS systém',
              count: deviceSelection.tablet_10_count,
              monthlyFee: deviceSelection.tablet_10_monthly_fee || 0,
              specifications: []
            }] : []),
            ...(deviceSelection.tablet_15_count > 0 ? [{
              id: 'tablet-15-legacy',
              type: 'device' as const,
              category: 'pos',
              name: 'Tablet 15"',
              description: 'Veľký tablet pre POS systém',
              count: deviceSelection.tablet_15_count,
              monthlyFee: deviceSelection.tablet_15_monthly_fee || 0,
              specifications: []
            }] : []),
            ...(deviceSelection.tablet_pro_15_count > 0 ? [{
              id: 'tablet-pro-15-legacy',
              type: 'device' as const,
              category: 'pos',
              name: 'Tablet Pro 15"',
              description: 'Profesionálny tablet pre POS systém',
              count: deviceSelection.tablet_pro_15_count,
              monthlyFee: deviceSelection.tablet_pro_15_monthly_fee || 0,
              specifications: []
            }] : [])
          ],
          note: deviceSelection.note || ''
        } : {
          selectedSolutions: [],
          dynamicCards: [],
          note: ''
        },
        
        fees: {
          regulatedCards: deviceSelection?.mif_regulated_cards || 0.90,
          unregulatedCards: deviceSelection?.mif_unregulated_cards || 0.90
        },
        
        authorizedPersons: authorizedPersons?.map(person => ({
          id: person.person_id,
          firstName: person.first_name,
          lastName: person.last_name,
          birthDate: person.birth_date,
          birthPlace: person.birth_place,
          birthNumber: person.birth_number,
          maidenName: person.maiden_name,
          citizenship: person.citizenship,
          permanentAddress: person.permanent_address,
          documentType: person.document_type,
          documentNumber: person.document_number,
          documentValidity: person.document_validity,
          documentIssuer: person.document_issuer,
          documentCountry: person.document_country,
          position: person.position,
          phone: person.phone,
          email: person.email,
          isPoliticallyExposed: person.is_politically_exposed,
          isUSCitizen: person.is_us_citizen
        })) || [],
        
        actualOwners: actualOwners?.map(owner => ({
          id: owner.owner_id,
          firstName: owner.first_name,
          lastName: owner.last_name,
          birthDate: owner.birth_date,
          birthPlace: owner.birth_place,
          birthNumber: owner.birth_number,
          maidenName: owner.maiden_name,
          citizenship: owner.citizenship,
          permanentAddress: owner.permanent_address,
          isPoliticallyExposed: owner.is_politically_exposed
        })) || [],
        
        consents: consents ? {
          gdpr: consents.gdpr_consent || false,
          terms: consents.terms_consent || false,
          electronicCommunication: consents.electronic_communication_consent || false,
          signatureDate: consents.signature_date || '',
          signingPersonId: consents.signing_person_id || ''
        } : {
          gdpr: false, terms: false, electronicCommunication: false, signatureDate: '', signingPersonId: ''
        },
        
        currentStep: 0
      };

      console.log('Contract data loaded:', onboardingData);
      return { contract, onboardingData };
    },
    enabled: !!contractId
  });
};
