import { supabase } from '@/integrations/supabase/client';

export const insertContactInfo = async (contractId: string, contactInfo: any) => {
  const { error } = await supabase
    .from('contact_info')
    .insert({
      contract_id: contractId,
      salutation: contactInfo.salutation || null,
      first_name: contactInfo.firstName,
      last_name: contactInfo.lastName,
      email: contactInfo.email,
      phone: contactInfo.phone,
      phone_prefix: contactInfo.phonePrefix || '+421',
      sales_note: contactInfo.salesNote || null
    });

  if (error) throw error;
};

export const insertCompanyInfo = async (contractId: string, companyInfo: any) => {
  const { error } = await supabase
    .from('company_info')
    .insert({
      contract_id: contractId,
      ico: companyInfo.ico,
      dic: companyInfo.dic,
      company_name: companyInfo.companyName,
      registry_type: companyInfo.registryType,
      is_vat_payer: companyInfo.isVatPayer,
      vat_number: companyInfo.vatNumber || null,
      court: companyInfo.court || null,
      section: companyInfo.section || null,
      insert_number: companyInfo.insertNumber || null,
      address_street: companyInfo.address.street,
      address_city: companyInfo.address.city,
      address_zip_code: companyInfo.address.zipCode,
      contact_address_same_as_main: companyInfo.contactAddressSameAsMain,
      contact_address_street: companyInfo.contactAddress?.street || null,
      contact_address_city: companyInfo.contactAddress?.city || null,
      contact_address_zip_code: companyInfo.contactAddress?.zipCode || null,
      contact_person_name: `${companyInfo.contactPerson.firstName} ${companyInfo.contactPerson.lastName}`,
      contact_person_first_name: companyInfo.contactPerson.firstName,
      contact_person_last_name: companyInfo.contactPerson.lastName,
      contact_person_email: companyInfo.contactPerson.email,
      contact_person_phone: companyInfo.contactPerson.phone,
      contact_person_is_technical: companyInfo.contactPerson.isTechnicalPerson
    });

  if (error) throw error;
};

export const insertBusinessLocations = async (contractId: string, businessLocations: any[]) => {
  for (const location of businessLocations) {
    const { error } = await supabase
      .from('business_locations')
      .insert({
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
        item_id: card.id,
        item_type: card.type,
        category: card.category,
        name: card.name,
        description: card.description,
        count: card.count,
        monthly_fee: card.monthlyFee,
        company_cost: card.companyCost,
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
            addon_id: addon.id,
            category: addon.category,
            name: addon.name,
            description: addon.description,
            quantity: addon.isPerDevice ? card.count : (addon.customQuantity || 1),
            monthly_fee: addon.monthlyFee,
            company_cost: addon.companyCost,
            is_per_device: addon.isPerDevice
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
        monthly_turnover: fees.calculatorResults.monthlyTurnover,
        total_customer_payments: fees.calculatorResults.totalCustomerPayments,
        total_company_costs: fees.calculatorResults.totalCompanyCosts,
        effective_regulated: fees.calculatorResults.effectiveRegulated,
        effective_unregulated: fees.calculatorResults.effectiveUnregulated,
        regulated_fee: fees.calculatorResults.regulatedFee,
        unregulated_fee: fees.calculatorResults.unregulatedFee,
        transaction_margin: fees.calculatorResults.transactionMargin,
        service_margin: fees.calculatorResults.serviceMargin,
        total_monthly_profit: fees.calculatorResults.totalMonthlyProfit,
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
      mif_regulated_cards: fees?.regulatedCards || 0,
      mif_unregulated_cards: fees?.unregulatedCards || 0,
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
      });

    if (error) throw error;
  }
};

export const insertConsents = async (contractId: string, consents: any) => {
  const { error } = await supabase
    .from('consents')
    .insert({
      contract_id: contractId,
      gdpr_consent: consents.gdpr,
      terms_consent: consents.terms,
      electronic_communication_consent: consents.electronicCommunication,
      signature_date: consents.signatureDate || null,
      signing_person_id: consents.signingPersonId || null
    });

  if (error) throw error;
};
