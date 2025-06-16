
import { OnboardingData } from '@/types/onboarding';

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
  console.log('Transforming contract data:', {
    contract,
    contactInfo,
    companyInfo,
    businessLocations,
    deviceSelection,
    contractItems,
    contractCalculations,
    authorizedPersons,
    actualOwners,
    consents
  });

  // Transform contact info
  const transformedContactInfo = contactInfo ? {
    salutation: contactInfo.salutation as 'Pan' | 'Pani',
    firstName: contactInfo.first_name || '',
    lastName: contactInfo.last_name || '',
    email: contactInfo.email || '',
    phone: contactInfo.phone || '',
    phonePrefix: contactInfo.phone_prefix || '+421',
    salesNote: contactInfo.sales_note || ''
  } : {
    salutation: undefined,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phonePrefix: '+421',
    salesNote: ''
  };

  // Transform company info
  const transformedCompanyInfo = companyInfo ? {
    ico: companyInfo.ico || '',
    dic: companyInfo.dic || '',
    companyName: companyInfo.company_name || '',
    registryType: mapRegistryTypeFromDb(companyInfo.registry_type),
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
    contactAddress: companyInfo.contact_address_same_as_main ? null : {
      street: companyInfo.contact_address_street || '',
      city: companyInfo.contact_address_city || '',
      zipCode: companyInfo.contact_address_zip_code || ''
    },
    contactAddressSameAsMain: companyInfo.contact_address_same_as_main !== false,
    headOfficeEqualsOperatingAddress: true,
    contactPerson: {
      firstName: companyInfo.contact_person_first_name || '',
      lastName: companyInfo.contact_person_last_name || '',
      email: companyInfo.contact_person_email || '',
      phone: companyInfo.contact_person_phone || '',
      isTechnicalPerson: companyInfo.contact_person_is_technical || false
    }
  } : {
    ico: '',
    dic: '',
    companyName: '',
    registryType: 'Živnosť' as const,
    isVatPayer: false,
    vatNumber: '',
    court: '',
    section: '',
    insertNumber: '',
    address: { street: '', city: '', zipCode: '' },
    contactAddress: null,
    contactAddressSameAsMain: true,
    headOfficeEqualsOperatingAddress: true,
    contactPerson: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      isTechnicalPerson: false
    }
  };

  // Transform business locations
  const transformedBusinessLocations = businessLocations?.map(location => ({
    id: location.location_id,
    name: location.name || '',
    hasPOS: location.has_pos || false,
    address: {
      street: location.address_street || '',
      city: location.address_city || '',
      zipCode: location.address_zip_code || ''
    },
    businessSector: location.business_sector || '',
    estimatedTurnover: Number(location.estimated_turnover) || 0,
    averageTransaction: Number(location.average_transaction) || 0,
    seasonality: location.seasonality || 'year-round',
    seasonalWeeks: location.seasonal_weeks || null,
    contactPerson: {
      name: location.contact_person_name || '',
      email: location.contact_person_email || '',
      phone: location.contact_person_phone || ''
    },
    iban: location.iban || '',
    openingHours: location.opening_hours || ''
  })) || [];

  // Transform device selection with dynamic cards from contract items
  const deviceCards = contractItems?.filter(item => item.item_type === 'device')?.map(item => ({
    id: item.item_id,
    type: 'device' as const,
    name: item.name,
    category: item.category,
    description: item.description || '',
    count: item.count,
    monthlyFee: Number(item.monthly_fee),
    companyCost: Number(item.company_cost),
    customValue: item.custom_value || {}
  })) || [];

  const serviceCards = contractItems?.filter(item => item.item_type === 'service')?.map(item => ({
    id: item.item_id,
    type: 'service' as const,
    name: item.name,
    category: item.category,
    description: item.description || '',
    count: item.count,
    monthlyFee: Number(item.monthly_fee),
    companyCost: Number(item.company_cost),
    customValue: item.custom_value || {}
  })) || [];

  const transformedDeviceSelection = {
    selectedSolutions: [],
    dynamicCards: [...deviceCards, ...serviceCards],
    note: deviceSelection?.note || ''
  };

  // Transform authorized persons
  const transformedAuthorizedPersons = authorizedPersons?.map(person => ({
    id: person.person_id,
    personId: person.person_id,
    firstName: person.first_name || '',
    lastName: person.last_name || '',
    maidenName: person.maiden_name || '',
    birthDate: person.birth_date || '',
    birthPlace: person.birth_place || '',
    birthNumber: person.birth_number || '',
    citizenship: person.citizenship || 'SK',
    permanentAddress: person.permanent_address || '',
    email: person.email || '',
    phone: person.phone || '',
    phonePrefix: '+421',
    position: person.position || '',
    documentType: person.document_type || 'OP',
    documentNumber: person.document_number || '',
    documentIssuer: person.document_issuer || '',
    documentValidity: person.document_validity || '',
    documentCountry: person.document_country || 'SK',
    isPoliticallyExposed: person.is_politically_exposed || false,
    isUSCitizen: person.is_us_citizen || false
  })) || [];

  // Transform actual owners
  const transformedActualOwners = actualOwners?.map(owner => ({
    id: owner.owner_id,
    ownerId: owner.owner_id,
    firstName: owner.first_name || '',
    lastName: owner.last_name || '',
    maidenName: owner.maiden_name || '',
    birthDate: owner.birth_date || '',
    birthPlace: owner.birth_place || '',
    birthNumber: owner.birth_number || '',
    citizenship: owner.citizenship || 'SK',
    permanentAddress: owner.permanent_address || '',
    isPoliticallyExposed: owner.is_politically_exposed || false
  })) || [];

  // Transform consents
  const transformedConsents = {
    gdpr: consents?.gdpr_consent || false,
    terms: consents?.terms_consent || false,
    electronicCommunication: consents?.electronic_communication_consent || false,
    signatureDate: consents?.signature_date || undefined,
    signingPersonId: consents?.signing_person_id || undefined
  };

  const onboardingData: OnboardingData = {
    contractId: contract?.id || '',
    contractNumber: contract?.contract_number || '',
    currentStep: 0,
    visitedSteps: [],
    contactInfo: transformedContactInfo,
    companyInfo: transformedCompanyInfo,
    businessLocations: transformedBusinessLocations,
    deviceSelection: transformedDeviceSelection,
    devices: deviceCards,
    services: serviceCards,
    fees: {
      regulatedCards: Number(deviceSelection?.mif_regulated_cards) || 0,
      unregulatedCards: Number(deviceSelection?.mif_unregulated_cards) || 0
    },
    authorizedPersons: transformedAuthorizedPersons,
    actualOwners: transformedActualOwners,
    consents: transformedConsents
  };

  console.log('Transformed onboarding data:', onboardingData);
  return onboardingData;
};

// Helper function to map registry type from database to frontend
const mapRegistryTypeFromDb = (dbType: string): 'Živnosť' | 'S.r.o.' | 'Nezisková organizácia' | 'Akciová spoločnosť' => {
  switch (dbType) {
    case 'public':
      return 'Nezisková organizácia';
    case 'business':
      return 'S.r.o.';
    case 'other':
    default:
      return 'Živnosť';
  }
};
