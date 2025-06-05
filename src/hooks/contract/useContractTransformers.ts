
import { OnboardingData, BankAccount, OpeningHours } from '@/types/onboarding';

// Helper function to convert database salutation to frontend format
const convertSalutation = (dbSalutation: string): 'Pan' | 'Pani' | undefined => {
  if (dbSalutation === 'Pan' || dbSalutation === 'Pani') {
    return dbSalutation;
  }
  return undefined;
};

// Helper function to convert database registry type to frontend format
const convertRegistryType = (dbRegistryType: string): 'Živnosť' | 'S.r.o.' | 'Nezisková organizácia' | 'Akciová spoločnosť' => {
  switch (dbRegistryType) {
    case 'public':
      return 'Nezisková organizácia';
    case 'business':
      return 'S.r.o.';
    case 'other':
    default:
      return 'Živnosť';
  }
};

export const transformContractData = (
  contract: any,
  contactInfo: any,
  companyInfo: any,
  businessLocations: any[],
  deviceSelection: any,
  contractItems: any[],
  contractCalculations: any,
  authorizedPersons: any[],
  actualOwners: any[],
  consents: any
): OnboardingData => {
  // Transform contract items and addons into dynamic cards
  const transformedDynamicCards = contractItems?.map(item => {
    const transformedAddons = item.contract_item_addons?.map((addon: any) => ({
      id: addon.addon_id,
      type: 'addon' as const,
      category: addon.category,
      name: addon.name,
      description: addon.description || '',
      monthlyFee: Number(addon.monthly_fee) || 0,
      companyCost: Number(addon.company_cost) || 0,
      isPerDevice: addon.is_per_device || false,
      customQuantity: addon.quantity || 1
    })) || [];

    if (item.item_type === 'device') {
      return {
        id: item.id, // Use database ID instead of item_id
        type: 'device' as const,
        category: item.category,
        name: item.name,
        description: item.description || '',
        count: item.count || 1,
        monthlyFee: Number(item.monthly_fee) || 0,
        companyCost: Number(item.company_cost) || 0,
        specifications: [],
        addons: transformedAddons,
        itemType: 'device' // Add for consistency
      };
    } else {
      return {
        id: item.id, // Use database ID instead of item_id
        type: 'service' as const,
        category: item.category,
        name: item.name,
        description: item.description || '',
        count: item.count || 1,
        monthlyFee: Number(item.monthly_fee) || 0,
        companyCost: Number(item.company_cost) || 0,
        customValue: item.custom_value || undefined,
        addons: transformedAddons,
        itemType: 'service' // Add for consistency
      };
    }
  }) || [];

  // If no contract items exist, fall back to legacy device_selection
  const legacyDynamicCards = deviceSelection ? [
    ...(deviceSelection.pax_a920_pro_count > 0 ? [{
      id: 'pax-a920-pro-legacy',
      type: 'device' as const,
      category: 'terminal',
      name: 'PAX A920 PRO',
      description: 'Mobilný terminál',
      count: deviceSelection.pax_a920_pro_count,
      monthlyFee: deviceSelection.pax_a920_pro_monthly_fee || 0,
      companyCost: 0,
      specifications: [],
      addons: [],
      itemType: 'device'
    }] : []),
    ...(deviceSelection.pax_a80_count > 0 ? [{
      id: 'pax-a80-legacy',
      type: 'device' as const,
      category: 'terminal',
      name: 'PAX A80',
      description: 'Stacionárny terminál',
      count: deviceSelection.pax_a80_count,
      monthlyFee: deviceSelection.pax_a80_monthly_fee || 0,
      companyCost: 0,
      specifications: [],
      addons: [],
      itemType: 'device'
    }] : []),
    ...(deviceSelection.tablet_10_count > 0 ? [{
      id: 'tablet-10-legacy',
      type: 'device' as const,
      category: 'pos',
      name: 'Tablet 10"',
      description: 'Kompaktný tablet pre POS systém',
      count: deviceSelection.tablet_10_count,
      monthlyFee: deviceSelection.tablet_10_monthly_fee || 0,
      companyCost: 0,
      specifications: [],
      addons: [],
      itemType: 'device'
    }] : []),
    ...(deviceSelection.tablet_15_count > 0 ? [{
      id: 'tablet-15-legacy',
      type: 'device' as const,
      category: 'pos',
      name: 'Tablet 15"',
      description: 'Veľký tablet pre POS systém',
      count: deviceSelection.tablet_15_count,
      monthlyFee: deviceSelection.tablet_15_monthly_fee || 0,
      companyCost: 0,
      specifications: [],
      addons: [],
      itemType: 'device'
    }] : []),
    ...(deviceSelection.tablet_pro_15_count > 0 ? [{
      id: 'tablet-pro-15-legacy',
      type: 'device' as const,
      category: 'pos',
      name: 'Tablet Pro 15"',
      description: 'Profesionálny tablet pre POS systém',
      count: deviceSelection.tablet_pro_15_count,
      monthlyFee: deviceSelection.tablet_pro_15_monthly_fee || 0,
      companyCost: 0,
      specifications: [],
      addons: [],
      itemType: 'device'
    }] : []),
  ] : [];

  const finalDynamicCards = transformedDynamicCards.length > 0 ? transformedDynamicCards : legacyDynamicCards;

  // Transform calculation results
  const calculatorResults = contractCalculations ? {
    monthlyTurnover: Number(contractCalculations.monthly_turnover) || 0,
    totalCustomerPayments: Number(contractCalculations.total_customer_payments) || 0,
    totalCompanyCosts: Number(contractCalculations.total_company_costs) || 0,
    effectiveRegulated: Number(contractCalculations.effective_regulated) || 0,
    effectiveUnregulated: Number(contractCalculations.effective_unregulated) || 0,
    regulatedFee: Number(contractCalculations.regulated_fee) || 0,
    unregulatedFee: Number(contractCalculations.unregulated_fee) || 0,
    transactionMargin: Number(contractCalculations.transaction_margin) || 0,
    serviceMargin: Number(contractCalculations.service_margin) || 0,
    totalMonthlyProfit: Number(contractCalculations.total_monthly_profit) || 0,
    customerPaymentBreakdown: contractCalculations.calculation_data?.customerPaymentBreakdown || [],
    companyCostBreakdown: contractCalculations.calculation_data?.companyCostBreakdown || []
  } : undefined;

  return {
    contactInfo: contactInfo ? {
      salutation: convertSalutation(contactInfo.salutation || ''),
      firstName: contactInfo.first_name || '',
      lastName: contactInfo.last_name || '',
      email: contactInfo.email || '',
      phone: contactInfo.phone || '',
      phonePrefix: contactInfo.phone_prefix || '+421',
      salesNote: contactInfo.sales_note || ''
    } : {
      salutation: undefined, firstName: '', lastName: '', email: '', phone: '', phonePrefix: '+421', salesNote: ''
    },
    
    companyInfo: companyInfo ? {
      ico: companyInfo.ico || '',
      dic: companyInfo.dic || '',
      companyName: companyInfo.company_name || '',
      registryType: convertRegistryType(companyInfo.registry_type || 'other'),
      isVatPayer: companyInfo.is_vat_payer || false,
      vatNumber: companyInfo.vat_number || '',
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
        zipCode: companyInfo.address_zip_code || ''
      },
      contactAddressSameAsMain: companyInfo.contact_address_same_as_main ?? true,
      contactPerson: {
        firstName: companyInfo.contact_person_first_name || '',
        lastName: companyInfo.contact_person_last_name || '',
        email: companyInfo.contact_person_email || '',
        phone: companyInfo.contact_person_phone || '',
        isTechnicalPerson: companyInfo.contact_person_is_technical ?? false
      }
    } : {
      ico: '', dic: '', companyName: '', registryType: 'Živnosť', isVatPayer: false, vatNumber: '', court: '', section: '', insertNumber: '',
      address: { street: '', city: '', zipCode: '' },
      contactAddress: { street: '', city: '', zipCode: '' },
      contactAddressSameAsMain: true,
      contactPerson: { firstName: '', lastName: '', email: '', phone: '', isTechnicalPerson: false }
    },
    
    businessLocations: businessLocations?.map(loc => {
      // Default bank account from legacy IBAN
      const defaultBankAccount: BankAccount = {
        id: `legacy-${loc.location_id}`,
        format: 'IBAN',
        iban: loc.iban || '',
        mena: 'EUR'
      };

      // Default opening hours (weekdays open, weekends closed)
      const defaultOpeningHours: OpeningHours[] = [
        { day: "Po", open: "09:00", close: "17:00", otvorene: true },
        { day: "Ut", open: "09:00", close: "17:00", otvorene: true },
        { day: "St", open: "09:00", close: "17:00", otvorene: true },
        { day: "Št", open: "09:00", close: "17:00", otvorene: true },
        { day: "Pi", open: "09:00", close: "17:00", otvorene: true },
        { day: "So", open: "09:00", close: "14:00", otvorene: false },
        { day: "Ne", open: "09:00", close: "17:00", otvorene: false }
      ];

      return {
        id: loc.location_id,
        name: loc.name,
        hasPOS: loc.has_pos,
        address: {
          street: loc.address_street,
          city: loc.address_city,
          zipCode: loc.address_zip_code
        },
        iban: loc.iban, // Keep for backward compatibility
        bankAccounts: [defaultBankAccount],
        contactPerson: {
          name: loc.contact_person_name,
          phone: loc.contact_person_phone,
          email: loc.contact_person_email
        },
        businessSector: loc.business_sector, // Keep for backward compatibility
        businessSubject: loc.business_sector || '',
        mccCode: '',
        estimatedTurnover: loc.estimated_turnover, // Keep for backward compatibility
        monthlyTurnover: loc.estimated_turnover || 0,
        averageTransaction: loc.average_transaction,
        openingHours: loc.opening_hours, // Keep for backward compatibility
        openingHoursDetailed: defaultOpeningHours,
        seasonality: loc.seasonality,
        seasonalWeeks: loc.seasonal_weeks,
        assignedPersons: []
      };
    }) || [],
    
    deviceSelection: {
      selectedSolutions: [],
      dynamicCards: finalDynamicCards,
      note: deviceSelection?.note || ''
    },
    
    // Add contractItems for easy access in admin components
    contractItems: finalDynamicCards,
    
    fees: {
      regulatedCards: deviceSelection?.mif_regulated_cards || 0.90,
      unregulatedCards: deviceSelection?.mif_unregulated_cards || 0.90,
      calculatorResults
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
};
