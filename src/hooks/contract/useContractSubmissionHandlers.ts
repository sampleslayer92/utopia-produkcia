
import { supabase } from '@/integrations/supabase/client';
import { 
  safeString, 
  safeEmail, 
  validateRegistryType, 
  validateSalutation, 
  validateDocumentType, 
  validateSeasonality 
} from './useContractSubmissionValidators';

export const insertContactInfo = async (contractId: string, contactInfo: any) => {
  const { error } = await supabase
    .from('contact_info')
    .insert({
      contract_id: contractId,
      salutation: validateSalutation(contactInfo.salutation),
      first_name: safeString(contactInfo.firstName, 'Neuvedené'),
      last_name: safeString(contactInfo.lastName, 'Neuvedené'),
      email: safeEmail(contactInfo.email),
      phone: safeString(contactInfo.phone, ''),
      phone_prefix: safeString(contactInfo.phonePrefix, '+421'),
      sales_note: contactInfo.salesNote || null
    });

  if (error) throw error;
};

export const insertCompanyInfo = async (contractId: string, companyInfo: any) => {
  const { error } = await supabase
    .from('company_info')
    .insert({
      contract_id: contractId,
      ico: safeString(companyInfo.ico, ''),
      dic: safeString(companyInfo.dic, ''),
      company_name: safeString(companyInfo.companyName, 'Neuvedené'),
      registry_type: validateRegistryType(companyInfo.registryType),
      is_vat_payer: companyInfo.isVatPayer || false,
      vat_number: companyInfo.vatNumber || null,
      court: companyInfo.court || null,
      section: companyInfo.section || null,
      insert_number: companyInfo.insertNumber || null,
      address_street: safeString(companyInfo.address?.street, ''),
      address_city: safeString(companyInfo.address?.city, ''),
      address_zip_code: safeString(companyInfo.address?.zipCode, ''),
      contact_address_same_as_main: companyInfo.contactAddressSameAsMain !== false,
      contact_address_street: companyInfo.contactAddress?.street || null,
      contact_address_city: companyInfo.contactAddress?.city || null,
      contact_address_zip_code: companyInfo.contactAddress?.zipCode || null,
      contact_person_name: `${safeString(companyInfo.contactPerson?.firstName, '')} ${safeString(companyInfo.contactPerson?.lastName, '')}`.trim(),
      contact_person_first_name: safeString(companyInfo.contactPerson?.firstName, ''),
      contact_person_last_name: safeString(companyInfo.contactPerson?.lastName, ''),
      contact_person_email: safeEmail(companyInfo.contactPerson?.email),
      contact_person_phone: safeString(companyInfo.contactPerson?.phone, ''),
      contact_person_is_technical: companyInfo.contactPerson?.isTechnicalPerson || false
    });

  if (error) throw error;
};

export const insertBusinessLocations = async (contractId: string, businessLocations: any[]) => {
  for (const location of businessLocations) {
    const { error } = await supabase
      .from('business_locations')
      .insert({
        contract_id: contractId,
        location_id: safeString(location.id, `loc_${Date.now()}`),
        name: safeString(location.name, 'Neuvedené'),
        has_pos: location.hasPOS || false,
        address_street: safeString(location.address?.street, ''),
        address_city: safeString(location.address?.city, ''),
        address_zip_code: safeString(location.address?.zipCode, ''),
        iban: safeString(location.iban, ''),
        contact_person_name: safeString(location.contactPerson?.name, ''),
        contact_person_email: safeEmail(location.contactPerson?.email),
        contact_person_phone: safeString(location.contactPerson?.phone, ''),
        business_sector: safeString(location.businessSector, ''),
        estimated_turnover: location.estimatedTurnover || 0,
        average_transaction: location.averageTransaction || 0,
        opening_hours: safeString(location.openingHours, ''),
        seasonality: validateSeasonality(location.seasonality),
        seasonal_weeks: location.seasonalWeeks || null
      });

    if (error) throw error;
  }
};

export const insertDeviceSelection = async (contractId: string, deviceSelection: any, fees: any) => {
  // Save to new contract_items and contract_item_addons tables
  for (const card of deviceSelection?.dynamicCards || []) {
    const { data: contractItem, error: itemError } = await supabase
      .from('contract_items')
      .insert({
        contract_id: contractId,
        item_id: safeString(card.id, `item_${Date.now()}`),
        item_type: safeString(card.type, 'device'),
        category: safeString(card.category, 'other'),
        name: safeString(card.name, 'Neuvedené'),
        description: safeString(card.description, ''),
        count: card.count || 1,
        monthly_fee: card.monthlyFee || 0,
        company_cost: card.companyCost || 0,
        custom_value: card.customValue || null
      })
      .select('id')
      .single();

    if (itemError) throw itemError;

    // Save addons for this item
    if (card.addons && card.addons.length > 0 && contractItem) {
      for (const addon of card.addons) {
        const { error: addonError } = await supabase
          .from('contract_item_addons')
          .insert({
            contract_item_id: contractItem.id,
            addon_id: safeString(addon.id, `addon_${Date.now()}`),
            category: safeString(addon.category, 'other'),
            name: safeString(addon.name, 'Neuvedené'),
            description: safeString(addon.description, ''),
            quantity: addon.isPerDevice ? card.count : (addon.customQuantity || 1),
            monthly_fee: addon.monthlyFee || 0,
            company_cost: addon.companyCost || 0,
            is_per_device: addon.isPerDevice || false
          });

        if (addonError) throw addonError;
      }
    }
  }

  // Save calculation results if they exist
  if (fees?.calculatorResults) {
    const { error: calcError } = await supabase
      .from('contract_calculations')
      .insert({
        contract_id: contractId,
        monthly_turnover: fees.calculatorResults.monthlyTurnover || 0,
        total_customer_payments: fees.calculatorResults.totalCustomerPayments || 0,
        total_company_costs: fees.calculatorResults.totalCompanyCosts || 0,
        effective_regulated: fees.calculatorResults.effectiveRegulated || 0,
        effective_unregulated: fees.calculatorResults.effectiveUnregulated || 0,
        regulated_fee: fees.calculatorResults.regulatedFee || 0,
        unregulated_fee: fees.calculatorResults.unregulatedFee || 0,
        transaction_margin: fees.calculatorResults.transactionMargin || 0,
        service_margin: fees.calculatorResults.serviceMargin || 0,
        total_monthly_profit: fees.calculatorResults.totalMonthlyProfit || 0,
        calculation_data: JSON.parse(JSON.stringify(fees.calculatorResults))
      });

    if (calcError) throw calcError;
  }

  // Keep legacy device_selection table for backward compatibility
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
      pax_a920_pro_sim_cards: 0, // SIM is now an addon
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
      mif_regulated_cards: fees?.regulatedCards || 0.90,
      mif_unregulated_cards: fees?.unregulatedCards || 0.90,
      mif_dcc_rabat: 0,
      note: deviceSelection?.note || null
    });

  if (error) throw error;
};

export const insertAuthorizedPersons = async (contractId: string, authorizedPersons: any[]) => {
  for (const person of authorizedPersons) {
    const { error } = await supabase
      .from('authorized_persons')
      .insert({
        contract_id: contractId,
        person_id: safeString(person.id, `person_${Date.now()}`),
        first_name: safeString(person.firstName, 'Neuvedené'),
        last_name: safeString(person.lastName, 'Neuvedené'),
        email: safeEmail(person.email),
        phone: safeString(person.phone, ''),
        maiden_name: person.maidenName || null,
        birth_date: person.birthDate || '1900-01-01',
        birth_place: safeString(person.birthPlace, ''),
        birth_number: safeString(person.birthNumber, ''),
        permanent_address: safeString(person.permanentAddress, ''),
        position: safeString(person.position, ''),
        document_type: validateDocumentType(person.documentType),
        document_number: safeString(person.documentNumber, ''),
        document_validity: person.documentValidity || '2099-12-31',
        document_issuer: safeString(person.documentIssuer, ''),
        document_country: safeString(person.documentCountry, 'SK'),
        citizenship: safeString(person.citizenship, 'SK'),
        is_politically_exposed: person.isPoliticallyExposed || false,
        is_us_citizen: person.isUSCitizen || false
      });

    if (error) throw error;
  }
};

export const insertActualOwners = async (contractId: string, actualOwners: any[]) => {
  for (const owner of actualOwners) {
    const { error } = await supabase
      .from('actual_owners')
      .insert({
        contract_id: contractId,
        owner_id: safeString(owner.id, `owner_${Date.now()}`),
        first_name: safeString(owner.firstName, 'Neuvedené'),
        last_name: safeString(owner.lastName, 'Neuvedené'),
        maiden_name: owner.maidenName || null,
        birth_date: owner.birthDate || '1900-01-01',
        birth_place: safeString(owner.birthPlace, ''),
        birth_number: safeString(owner.birthNumber, ''),
        citizenship: safeString(owner.citizenship, 'SK'),
        permanent_address: safeString(owner.permanentAddress, ''),
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
      gdpr_consent: consents.gdpr || false,
      terms_consent: consents.terms || false,
      electronic_communication_consent: consents.electronicCommunication || false,
      signature_date: consents.signatureDate || null,
      signing_person_id: consents.signingPersonId || null
    });

  if (error) throw error;
};
