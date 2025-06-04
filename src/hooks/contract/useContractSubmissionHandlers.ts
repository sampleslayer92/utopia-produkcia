import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';
import { safeString, safeEmail, validateRegistryType } from './useContractSubmissionValidators';

export const insertContactInfo = async (contractId: string, contactInfo: any) => {
  const { error } = await supabase
    .from('contact_info')
    .insert({
      contract_id: contractId,
      salutation: contactInfo.salutation || null,
      first_name: safeString(contactInfo.firstName, 'Test'),
      last_name: safeString(contactInfo.lastName, 'Test'),
      email: safeEmail(contactInfo.email),
      phone: safeString(contactInfo.phone, '000000000'),
      phone_prefix: contactInfo.phonePrefix || '+421',
      sales_note: contactInfo.salesNote || null
    });
  
  if (error) throw error;
};

export const insertCompanyInfo = async (contractId: string, companyInfo: any) => {
  const validRegistryType = validateRegistryType(companyInfo.registryType);
  
  // Combine first and last name for legacy field
  const contactPersonName = `${safeString(companyInfo.contactPerson.firstName, 'Test')} ${safeString(companyInfo.contactPerson.lastName, 'Contact')}`.trim();

  const { error } = await supabase
    .from('company_info')
    .insert({
      contract_id: contractId,
      ico: safeString(companyInfo.ico, '00000000'),
      dic: safeString(companyInfo.dic, '00000000'),
      company_name: safeString(companyInfo.companyName, 'Test Company'),
      registry_type: validRegistryType,
      is_vat_payer: companyInfo.isVatPayer || false,
      vat_number: companyInfo.vatNumber || null,
      court: companyInfo.court || null,
      section: companyInfo.section || null,
      insert_number: companyInfo.insertNumber || null,
      address_street: safeString(companyInfo.address.street, 'Test Street 1'),
      address_city: safeString(companyInfo.address.city, 'Test City'),
      address_zip_code: safeString(companyInfo.address.zipCode, '00000'),
      contact_address_street: companyInfo.contactAddress?.street || null,
      contact_address_city: companyInfo.contactAddress?.city || null,
      contact_address_zip_code: companyInfo.contactAddress?.zipCode || null,
      contact_address_same_as_main: companyInfo.contactAddressSameAsMain,
      // Legacy field - combine first and last name
      contact_person_name: contactPersonName,
      // New separate fields
      contact_person_first_name: safeString(companyInfo.contactPerson.firstName, 'Test'),
      contact_person_last_name: safeString(companyInfo.contactPerson.lastName, 'Contact'),
      contact_person_email: safeEmail(companyInfo.contactPerson.email),
      contact_person_phone: safeString(companyInfo.contactPerson.phone, '000000000'),
      contact_person_is_technical: companyInfo.contactPerson.isTechnicalPerson
    });

  if (error) throw error;
};

export const insertBusinessLocations = async (contractId: string, businessLocations: any[]) => {
  if (!businessLocations || businessLocations.length === 0) return;

  for (const location of businessLocations) {
    if (!location.name && !location.address.street) continue;
    
    const { error } = await supabase
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

    if (error) throw error;
  }
};

export const insertDeviceSelection = async (contractId: string, deviceSelection: any, fees: any) => {
  const deviceCards = deviceSelection?.dynamicCards?.filter((card: any) => card.type === 'device') || [];
  
  const paxA920Pro = deviceCards.find((card: any) => card.name === 'PAX A920 PRO');
  const paxA80 = deviceCards.find((card: any) => card.name === 'PAX A80');
  const tablet10 = deviceCards.find((card: any) => card.name === 'Tablet 10"');
  const tablet15 = deviceCards.find((card: any) => card.name === 'Tablet 15"');
  const tabletPro15 = deviceCards.find((card: any) => card.name === 'Tablet Pro 15"');

  const { error } = await supabase
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
      software_licenses: deviceSelection?.dynamicCards?.filter((card: any) => card.category === 'software').map((card: any) => card.name) || [],
      accessories: deviceSelection?.dynamicCards?.filter((card: any) => card.category === 'accessories').map((card: any) => card.name) || [],
      ecommerce: deviceSelection?.dynamicCards?.filter((card: any) => card.category === 'ecommerce').map((card: any) => card.name) || [],
      technical_service: deviceSelection?.dynamicCards?.filter((card: any) => card.category === 'technical').map((card: any) => card.name) || [],
      transaction_types: [],
      mif_regulated_cards: fees?.regulatedCards || 0,
      mif_unregulated_cards: fees?.unregulatedCards || 0,
      mif_dcc_rabat: 0,
      note: deviceSelection?.note || null
    });

  if (error) throw error;
};

export const insertAuthorizedPersons = async (contractId: string, authorizedPersons: any[]) => {
  if (!authorizedPersons || authorizedPersons.length === 0) return;

  for (const person of authorizedPersons) {
    if (!person.firstName && !person.lastName) continue;
    
    const { error } = await supabase
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

    if (error) throw error;
  }
};

export const insertActualOwners = async (contractId: string, actualOwners: any[]) => {
  if (!actualOwners || actualOwners.length === 0) return;

  for (const owner of actualOwners) {
    if (!owner.firstName && !owner.lastName) continue;
    
    const { error } = await supabase
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

    if (error) throw error;
  }
};

export const insertConsents = async (contractId: string, consents: any) => {
  const { error } = await supabase
    .from('consents')
    .insert({
      contract_id: contractId,
      gdpr_consent: consents?.gdpr || false,
      terms_consent: consents?.terms || false,
      electronic_communication_consent: consents?.electronicCommunication || false,
      signature_date: consents?.signatureDate || null,
      signing_person_id: consents?.signingPersonId || null
    });

  if (error) throw error;
};
