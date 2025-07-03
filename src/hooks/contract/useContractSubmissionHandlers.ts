import { supabase } from '@/integrations/supabase/client';
import { ContactInfo, CompanyInfo, BusinessLocation, DeviceSelection, Fees, AuthorizedPerson, ActualOwner, Consents } from '@/types/onboarding';
import { 
  validateRegistryType, 
  validateSalutation, 
  validateDocumentType, 
  validateSeasonality,
  safeString,
  safeEmail,
  ensureValidUUID
} from './useContractSubmissionValidators';
import { createMerchantIfNeeded } from './merchantCreationUtils';

export const insertContactInfo = async (contractId: string, contactInfo: ContactInfo) => {
  console.log('Inserting contact info for contract:', contractId, contactInfo);
  
  const { error } = await supabase
    .from('contact_info')
    .insert({
      contract_id: contractId,
      salutation: validateSalutation(contactInfo.salutation),
      first_name: safeString(contactInfo.firstName, 'Nezadané'),
      last_name: safeString(contactInfo.lastName, 'Nezadané'),
      email: safeEmail(contactInfo.email),
      phone: safeString(contactInfo.phone, ''),
      phone_prefix: safeString(contactInfo.phonePrefix, '+421'),
      sales_note: contactInfo.salesNote || null,
      user_role: safeString(contactInfo.userRole) || null
    });

  if (error) {
    console.error('Contact info insertion error:', error);
    throw new Error(`Chyba pri ukladaní kontaktných údajov: ${error.message}`);
  }
};

export const insertCompanyInfo = async (contractId: string, companyInfo: CompanyInfo, contactInfo?: ContactInfo) => {
  console.log('Inserting company info for contract:', contractId, companyInfo);
  
  const { error } = await supabase
    .from('company_info')
    .insert({
      contract_id: contractId,
      ico: safeString(companyInfo.ico, ''),
      dic: safeString(companyInfo.dic, ''),
      company_name: safeString(companyInfo.companyName, 'Nezadané'),
      registry_type: validateRegistryType(companyInfo.registryType),
      is_vat_payer: companyInfo.isVatPayer || false,
      vat_number: companyInfo.vatNumber || null,
      court: safeString(companyInfo.court) || null,
      section: safeString(companyInfo.section) || null,
      insert_number: safeString(companyInfo.insertNumber) || null,
      address_street: safeString(companyInfo.address.street, 'Nezadané'),
      address_city: safeString(companyInfo.address.city, 'Nezadané'),
      address_zip_code: safeString(companyInfo.address.zipCode, '00000'),
      contact_address_same_as_main: companyInfo.contactAddressSameAsMain || true,
      contact_address_street: companyInfo.contactAddress?.street || null,
      contact_address_city: companyInfo.contactAddress?.city || null,
      contact_address_zip_code: companyInfo.contactAddress?.zipCode || null,
      contact_person_name: `${safeString(companyInfo.contactPerson.firstName, 'Nezadané')} ${safeString(companyInfo.contactPerson.lastName, 'Nezadané')}`,
      contact_person_first_name: safeString(companyInfo.contactPerson.firstName, 'Nezadané'),
      contact_person_last_name: safeString(companyInfo.contactPerson.lastName, 'Nezadané'),
      contact_person_email: safeEmail(companyInfo.contactPerson.email),
      contact_person_phone: safeString(companyInfo.contactPerson.phone, ''),
      contact_person_is_technical: companyInfo.contactPerson.isTechnicalPerson || false
    });

  if (error) {
    console.error('Company info insertion error:', error);
    throw new Error(`Chyba pri ukladaní údajov o spoločnosti: ${error.message}`);
  }

  // Auto-create merchant after successful company info insertion
  try {
    console.log('Auto-creating merchant for contract:', contractId);
    
    // Direct implementation of merchant creation logic
    const result = await createMerchantIfNeeded(contractId, companyInfo, contactInfo);
    
    if (result.success) {
      console.log('Merchant created/linked successfully:', result.merchantId);
    } else {
      console.log('Merchant creation skipped:', result.reason);
    }
  } catch (error) {
    console.error('Auto merchant creation failed:', error);
    // Don't throw here - merchant creation is optional and can be done later
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
    location_id: ensureValidUUID(location.id),
    name: safeString(location.name, 'Nezadané'),
    has_pos: location.hasPOS || false,
    address_street: safeString(location.address.street, 'Nezadané'),
    address_city: safeString(location.address.city, 'Nezadané'),
    address_zip_code: safeString(location.address.zipCode, '00000'),
    iban: safeString(location.iban, ''),
    contact_person_name: safeString(location.contactPerson.name, 'Nezadané'),
    contact_person_email: safeEmail(location.contactPerson.email),
    contact_person_phone: safeString(location.contactPerson.phone, ''),
    business_sector: safeString(location.businessSector, 'Nezadané'),
    estimated_turnover: location.estimatedTurnover || 0,
    average_transaction: location.averageTransaction || 0,
    opening_hours: safeString(location.openingHours, 'Nezadané'),
    seasonality: validateSeasonality(location.seasonality),
    seasonal_weeks: location.seasonalWeeks || null
  }));

  const { error } = await supabase
    .from('business_locations')
    .insert(locationsData);

  if (error) {
    console.error('Business locations insertion error:', error);
    throw new Error(`Chyba pri ukladaní prevádzok: ${error.message}`);
  }
};

export const insertDeviceSelection = async (contractId: string, deviceSelection: DeviceSelection, fees: Fees) => {
  console.log('Inserting device selection for contract:', contractId, deviceSelection, fees);
  
  // FIRST: Clear existing contract items and addons to prevent duplicates
  console.log('Clearing existing contract items to prevent duplicates...');
  
  // Get existing contract item IDs first
  const { data: existingItems, error: getItemsError } = await supabase
    .from('contract_items')
    .select('id')
    .eq('contract_id', contractId);

  if (getItemsError) {
    console.error('Error getting existing contract items:', getItemsError);
    throw new Error(`Chyba pri načítaní existujúcich zariadení: ${getItemsError.message}`);
  }

  // Delete existing addons first (foreign key constraint)
  if (existingItems && existingItems.length > 0) {
    const itemIds = existingItems.map(item => item.id);
    
    const { error: deleteAddonsError } = await supabase
      .from('contract_item_addons')
      .delete()
      .in('contract_item_id', itemIds);

    if (deleteAddonsError) {
      console.error('Error deleting existing addons:', deleteAddonsError);
      // Don't throw here, continue with deletion of items
    }
  }

  // Delete existing contract items
  const { error: deleteItemsError } = await supabase
    .from('contract_items')
    .delete()
    .eq('contract_id', contractId);

  if (deleteItemsError) {
    console.error('Error deleting existing contract items:', deleteItemsError);
    throw new Error(`Chyba pri mazaní existujúcich zariadení: ${deleteItemsError.message}`);
  }

  console.log('Existing contract items cleared successfully');
  
  // Insert contract items
  if (deviceSelection.dynamicCards && deviceSelection.dynamicCards.length > 0) {
    const itemsData = deviceSelection.dynamicCards.map(card => ({
      contract_id: contractId,
      item_id: ensureValidUUID(card.id),
      item_type: safeString(card.type, 'device'),
      category: safeString(card.category, 'other'),
      name: safeString(card.name, 'Nezadané'),
      description: card.description || null,
      count: card.count || 1,
      monthly_fee: card.monthlyFee || 0,
      company_cost: card.companyCost || 0,
      custom_value: (card as any).customValue || null
    }));

    const { data: insertedItems, error: itemsError } = await supabase
      .from('contract_items')
      .insert(itemsData)
      .select('id, item_id');

    if (itemsError) {
      console.error('Contract items insertion error:', itemsError);
      throw new Error(`Chyba pri ukladaní zariadení a služieb: ${itemsError.message}`);
    }

    // Insert addons for each item
    for (const item of insertedItems) {
      const card = deviceSelection.dynamicCards.find(c => c.id === item.item_id);
      if (card && card.addons && card.addons.length > 0) {
        const addonsData = card.addons.map(addon => ({
          contract_item_id: item.id,
          addon_id: ensureValidUUID(addon.id),
          addon_name: safeString(addon.name, 'Nezadané'),
          count: addon.customQuantity || 1,
          monthly_fee: addon.monthlyFee || 0,
          company_cost: addon.companyCost || 0
        }));

        const { error: addonsError } = await supabase
          .from('contract_item_addons')
          .insert(addonsData);

        if (addonsError) {
          console.error('Contract item addons insertion error:', addonsError);
          throw new Error(`Chyba pri ukladaní doplnkov: ${addonsError.message}`);
        }
      }
    }
  }

  // Insert calculation data if available
  if (fees.calculatorResults) {
    // Clear existing calculation data first
    const { error: deleteCalcError } = await supabase
      .from('contract_calculations')
      .delete()
      .eq('contract_id', contractId);

    if (deleteCalcError) {
      console.error('Error deleting existing calculations:', deleteCalcError);
      // Don't throw, continue with insertion
    }

    const calculationData = {
      customerPaymentBreakdown: fees.calculatorResults.customerPaymentBreakdown,
      companyCostBreakdown: fees.calculatorResults.companyCostBreakdown
    };

    const { error: calculationError } = await supabase
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
        calculation_data: calculationData as any
      });

    if (calculationError) {
      console.error('Contract calculations insertion error:', calculationError);
      throw new Error(`Chyba pri ukladaní kalkulácií: ${calculationError.message}`);
    }
  }

  // Insert legacy device selection data (clear first to prevent duplicates)
  const { error: deleteDeviceSelectionError } = await supabase
    .from('device_selection')
    .delete()
    .eq('contract_id', contractId);

  if (deleteDeviceSelectionError) {
    console.error('Error deleting existing device selection:', deleteDeviceSelectionError);
    // Don't throw, continue with insertion
  }

  const { error } = await supabase
    .from('device_selection')
    .insert({
      contract_id: contractId,
      note: deviceSelection.note || null,
      mif_regulated_cards: fees.regulatedCards || 0,
      mif_unregulated_cards: fees.unregulatedCards || 0,
      transaction_types: deviceSelection.selectedSolutions || []
    });

  if (error) {
    console.error('Device selection insertion error:', error);
    throw new Error(`Chyba pri ukladaní výberu zariadení: ${error.message}`);
  }
};

export const insertAuthorizedPersons = async (contractId: string, authorizedPersons: AuthorizedPerson[]) => {
  console.log('Upserting authorized persons for contract:', contractId, authorizedPersons);
  
  if (authorizedPersons.length === 0) {
    console.log('No authorized persons to upsert');
    return;
  }

  const personsData = authorizedPersons.map(person => ({
    contract_id: contractId,
    person_id: ensureValidUUID(person.id),
    first_name: safeString(person.firstName, 'Nezadané'),
    last_name: safeString(person.lastName, 'Nezadané'),
    email: safeEmail(person.email),
    phone: safeString(person.phone, ''),
    maiden_name: person.maidenName || null,
    birth_date: person.birthDate || '1900-01-01',
    birth_place: safeString(person.birthPlace, 'Nezadané'),
    birth_number: safeString(person.birthNumber, ''),
    permanent_address: safeString(person.permanentAddress, 'Nezadané'),
    position: safeString(person.position, 'Nezadané'),
    document_type: validateDocumentType(person.documentType),
    document_number: safeString(person.documentNumber, ''),
    document_validity: person.documentValidity || '2099-12-31',
    document_issuer: safeString(person.documentIssuer, 'Nezadané'),
    document_country: safeString(person.documentCountry, 'SK'),
    citizenship: safeString(person.citizenship, 'SK'),
    is_politically_exposed: person.isPoliticallyExposed || false,
    is_us_citizen: person.isUSCitizen || false
  }));

  // Use UPSERT to prevent duplicates
  const { error } = await supabase
    .from('authorized_persons')
    .upsert(personsData, { 
      onConflict: 'person_id,contract_id',
      ignoreDuplicates: false 
    });

  if (error) {
    console.error('Authorized persons upsert error:', error);
    throw new Error(`Chyba pri ukladaní oprávnených osôb: ${error.message}`);
  }
};

export const insertActualOwners = async (contractId: string, actualOwners: ActualOwner[]) => {
  console.log('Upserting actual owners for contract:', contractId, actualOwners);
  
  if (actualOwners.length === 0) {
    console.log('No actual owners to upsert');
    return;
  }

  const ownersData = actualOwners.map(owner => ({
    contract_id: contractId,
    owner_id: ensureValidUUID(owner.id),
    first_name: safeString(owner.firstName, 'Nezadané'),
    last_name: safeString(owner.lastName, 'Nezadané'),
    maiden_name: owner.maidenName || null,
    birth_date: owner.birthDate || '1900-01-01',
    birth_place: safeString(owner.birthPlace, 'Nezadané'),
    birth_number: safeString(owner.birthNumber, ''),
    citizenship: safeString(owner.citizenship, 'SK'),
    permanent_address: safeString(owner.permanentAddress, 'Nezadané'),
    is_politically_exposed: owner.isPoliticallyExposed || false
  }));

  // Use UPSERT to prevent duplicates
  const { error } = await supabase
    .from('actual_owners')
    .upsert(ownersData, { 
      onConflict: 'owner_id,contract_id',
      ignoreDuplicates: false 
    });

  if (error) {
    console.error('Actual owners upsert error:', error);
    throw new Error(`Chyba pri ukladaní skutočných vlastníkov: ${error.message}`);
  }
};

export const insertConsents = async (contractId: string, consents: Consents) => {
  console.log('Inserting consents for contract:', contractId, consents);
  
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

  if (error) {
    console.error('Consents insertion error:', error);
    throw new Error(`Chyba pri ukladaní súhlasov: ${error.message}`);
  }
};
