
import { supabase } from '@/integrations/supabase/client';
import { ContactInfo, CompanyInfo, BusinessLocation, DeviceSelection, Fees, AuthorizedPerson, ActualOwner, Consents } from '@/types/onboarding';

export const insertContactInfo = async (contractId: string, contactInfo: ContactInfo) => {
  console.log('Inserting contact info for contract:', contractId, contactInfo);
  
  const { error } = await supabase
    .from('contact_info')
    .insert({
      contract_id: contractId,
      salutation: contactInfo.salutation || null,
      first_name: contactInfo.firstName,
      last_name: contactInfo.lastName,
      email: contactInfo.email,
      phone: contactInfo.phone,
      phone_prefix: contactInfo.phonePrefix,
      sales_note: contactInfo.salesNote || null,
      user_role: contactInfo.userRole || null
    });

  if (error) {
    console.error('Contact info insertion error:', error);
    throw error;
  }
};

export const insertCompanyInfo = async (contractId: string, companyInfo: CompanyInfo) => {
  console.log('Inserting company info for contract:', contractId, companyInfo);
  
  const { error } = await supabase
    .from('company_info')
    .insert({
      contract_id: contractId,
      ico: companyInfo.ico,
      dic: companyInfo.dic,
      company_name: companyInfo.companyName,
      registry_type: companyInfo.registryType as any,
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

  if (error) {
    console.error('Company info insertion error:', error);
    throw error;
  }
};

export const insertBusinessLocations = async (contractId: string, businessLocations: BusinessLocation[]) => {
  console.log('Inserting business locations for contract:', contractId, businessLocations);
  
  if (businessLocations.length === 0) {
    console.log('No business locations to insert');
    return;
  }

  const locationsData = businessLocations.map(location => ({
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
    seasonality: location.seasonality as any,
    seasonal_weeks: location.seasonalWeeks || null
  }));

  const { error } = await supabase
    .from('business_locations')
    .insert(locationsData);

  if (error) {
    console.error('Business locations insertion error:', error);
    throw error;
  }
};

export const insertDeviceSelection = async (contractId: string, deviceSelection: DeviceSelection, fees: Fees) => {
  console.log('Inserting device selection for contract:', contractId, deviceSelection, fees);
  
  // Insert contract items
  if (deviceSelection.dynamicCards && deviceSelection.dynamicCards.length > 0) {
    const itemsData = deviceSelection.dynamicCards.map(card => ({
      contract_id: contractId,
      item_id: card.id,
      item_type: card.type,
      category: card.category,
      name: card.name,
      description: card.description || null,
      count: card.count,
      monthly_fee: card.monthlyFee,
      company_cost: card.companyCost,
      custom_value: (card as any).customValue || null
    }));

    const { data: insertedItems, error: itemsError } = await supabase
      .from('contract_items')
      .insert(itemsData)
      .select('id, item_id');

    if (itemsError) {
      console.error('Contract items insertion error:', itemsError);
      throw itemsError;
    }

    // Insert addons for each item
    for (const item of insertedItems) {
      const card = deviceSelection.dynamicCards.find(c => c.id === item.item_id);
      if (card && card.addons && card.addons.length > 0) {
        const addonsData = card.addons.map(addon => ({
          contract_item_id: item.id,
          addon_id: addon.id,
          category: addon.category,
          name: addon.name,
          description: addon.description || null,
          quantity: addon.customQuantity || 1,
          monthly_fee: addon.monthlyFee,
          company_cost: addon.companyCost,
          is_per_device: addon.isPerDevice
        }));

        const { error: addonsError } = await supabase
          .from('contract_item_addons')
          .insert(addonsData);

        if (addonsError) {
          console.error('Contract item addons insertion error:', addonsError);
          throw addonsError;
        }
      }
    }
  }

  // Insert calculation data if available
  if (fees.calculatorResults) {
    const calculationData = {
      customerPaymentBreakdown: fees.calculatorResults.customerPaymentBreakdown,
      companyCostBreakdown: fees.calculatorResults.companyCostBreakdown
    };

    const { error: calculationError } = await supabase
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
        calculation_data: calculationData as any
      });

    if (calculationError) {
      console.error('Contract calculations insertion error:', calculationError);
      throw calculationError;
    }
  }

  // Insert legacy device selection data
  const { error } = await supabase
    .from('device_selection')
    .insert({
      contract_id: contractId,
      note: deviceSelection.note || null,
      mif_regulated_cards: fees.regulatedCards,
      mif_unregulated_cards: fees.unregulatedCards,
      transaction_types: deviceSelection.selectedSolutions
    });

  if (error) {
    console.error('Device selection insertion error:', error);
    throw error;
  }
};

export const insertAuthorizedPersons = async (contractId: string, authorizedPersons: AuthorizedPerson[]) => {
  console.log('Inserting authorized persons for contract:', contractId, authorizedPersons);
  
  if (authorizedPersons.length === 0) {
    console.log('No authorized persons to insert');
    return;
  }

  const personsData = authorizedPersons.map(person => ({
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
    document_type: person.documentType as any,
    document_number: person.documentNumber,
    document_validity: person.documentValidity,
    document_issuer: person.documentIssuer,
    document_country: person.documentCountry,
    citizenship: person.citizenship,
    is_politically_exposed: person.isPoliticallyExposed,
    is_us_citizen: person.isUSCitizen
  }));

  const { error } = await supabase
    .from('authorized_persons')
    .insert(personsData);

  if (error) {
    console.error('Authorized persons insertion error:', error);
    throw error;
  }
};

export const insertActualOwners = async (contractId: string, actualOwners: ActualOwner[]) => {
  console.log('Inserting actual owners for contract:', contractId, actualOwners);
  
  if (actualOwners.length === 0) {
    console.log('No actual owners to insert');
    return;
  }

  const ownersData = actualOwners.map(owner => ({
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
  }));

  const { error } = await supabase
    .from('actual_owners')
    .insert(ownersData);

  if (error) {
    console.error('Actual owners insertion error:', error);
    throw error;
  }
};

export const insertConsents = async (contractId: string, consents: Consents) => {
  console.log('Inserting consents for contract:', contractId, consents);
  
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

  if (error) {
    console.error('Consents insertion error:', error);
    throw error;
  }
};
