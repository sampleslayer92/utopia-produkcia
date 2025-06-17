
import { OnboardingData } from '@/types/onboarding';

const cleanValue = (value: any): any => {
  if (value === '' || value === 'null' || value === null) {
    return null;
  }
  return value;
};

const cleanStringValue = (value: any): string => {
  if (value === '' || value === 'null' || value === null || value === undefined) {
    return '';
  }
  return String(value);
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
    salutation: cleanValue(contactInfo.salutation) as 'Pan' | 'Pani' | undefined,
    firstName: cleanStringValue(contactInfo.first_name),
    lastName: cleanStringValue(contactInfo.last_name),
    email: cleanStringValue(contactInfo.email),
    phone: cleanStringValue(contactInfo.phone),
    phonePrefix: cleanStringValue(contactInfo.phone_prefix) || '+421',
    salesNote: cleanStringValue(contactInfo.sales_note)
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
    ico: cleanStringValue(companyInfo.ico),
    dic: cleanStringValue(companyInfo.dic),
    companyName: cleanStringValue(companyInfo.company_name),
    registryType: mapRegistryTypeFromDb(companyInfo.registry_type),
    isVatPayer: Boolean(companyInfo.is_vat_payer),
    vatNumber: cleanStringValue(companyInfo.vat_number),
    court: cleanStringValue(companyInfo.court),
    section: cleanStringValue(companyInfo.section),
    insertNumber: cleanStringValue(companyInfo.insert_number),
    address: {
      street: cleanStringValue(companyInfo.address_street),
      city: cleanStringValue(companyInfo.address_city),
      zipCode: cleanStringValue(companyInfo.address_zip_code)
    },
    contactAddress: companyInfo.contact_address_same_as_main ? null : {
      street: cleanStringValue(companyInfo.contact_address_street),
      city: cleanStringValue(companyInfo.contact_address_city),
      zipCode: cleanStringValue(companyInfo.contact_address_zip_code)
    },
    contactAddressSameAsMain: companyInfo.contact_address_same_as_main !== false,
    headOfficeEqualsOperatingAddress: true,
    contactPerson: {
      firstName: cleanStringValue(companyInfo.contact_person_first_name),
      lastName: cleanStringValue(companyInfo.contact_person_last_name),
      email: cleanStringValue(companyInfo.contact_person_email),
      phone: cleanStringValue(companyInfo.contact_person_phone),
      isTechnicalPerson: Boolean(companyInfo.contact_person_is_technical)
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
    name: cleanStringValue(location.name),
    hasPOS: Boolean(location.has_pos),
    address: {
      street: cleanStringValue(location.address_street),
      city: cleanStringValue(location.address_city),
      zipCode: cleanStringValue(location.address_zip_code)
    },
    businessSector: cleanStringValue(location.business_sector),
    estimatedTurnover: Number(location.estimated_turnover) || 0,
    averageTransaction: Number(location.average_transaction) || 0,
    seasonality: cleanStringValue(location.seasonality) || 'year-round',
    seasonalWeeks: cleanValue(location.seasonal_weeks),
    contactPerson: {
      name: cleanStringValue(location.contact_person_name),
      email: cleanStringValue(location.contact_person_email),
      phone: cleanStringValue(location.contact_person_phone)
    },
    iban: cleanStringValue(location.iban),
    openingHours: cleanStringValue(location.opening_hours)
  })) || [];

  // Transform device selection with dynamic cards from contract items
  const deviceCards = contractItems?.filter(item => item.item_type === 'device')?.map(item => ({
    id: item.item_id,
    type: 'device' as const,
    name: cleanStringValue(item.name),
    category: cleanStringValue(item.category),
    description: cleanStringValue(item.description),
    count: Number(item.count) || 1,
    monthlyFee: Number(item.monthly_fee) || 0,
    companyCost: Number(item.company_cost) || 0,
    customValue: item.custom_value || {}
  })) || [];

  const serviceCards = contractItems?.filter(item => item.item_type === 'service')?.map(item => ({
    id: item.item_id,
    type: 'service' as const,
    name: cleanStringValue(item.name),
    category: cleanStringValue(item.category),
    description: cleanStringValue(item.description),
    count: Number(item.count) || 1,
    monthlyFee: Number(item.monthly_fee) || 0,
    companyCost: Number(item.company_cost) || 0,
    customValue: item.custom_value || {}
  })) || [];

  const transformedDeviceSelection = {
    selectedSolutions: [],
    dynamicCards: [...deviceCards, ...serviceCards],
    note: cleanStringValue(deviceSelection?.note)
  };

  // Transform authorized persons
  const transformedAuthorizedPersons = authorizedPersons?.map(person => ({
    id: person.person_id,
    personId: person.person_id,
    firstName: cleanStringValue(person.first_name),
    lastName: cleanStringValue(person.last_name),
    maidenName: cleanStringValue(person.maiden_name),
    birthDate: cleanValue(person.birth_date),
    birthPlace: cleanStringValue(person.birth_place),
    birthNumber: cleanStringValue(person.birth_number),
    citizenship: cleanStringValue(person.citizenship) || 'SK',
    permanentAddress: cleanStringValue(person.permanent_address),
    email: cleanStringValue(person.email),
    phone: cleanStringValue(person.phone),
    phonePrefix: '+421',
    position: cleanStringValue(person.position),
    documentType: cleanStringValue(person.document_type) || 'OP',
    documentNumber: cleanStringValue(person.document_number),
    documentIssuer: cleanStringValue(person.document_issuer),
    documentValidity: cleanValue(person.document_validity),
    documentCountry: cleanStringValue(person.document_country) || 'SK',
    isPoliticallyExposed: Boolean(person.is_politically_exposed),
    isUSCitizen: Boolean(person.is_us_citizen)
  })) || [];

  // Transform actual owners
  const transformedActualOwners = actualOwners?.map(owner => ({
    id: owner.owner_id,
    ownerId: owner.owner_id,
    firstName: cleanStringValue(owner.first_name),
    lastName: cleanStringValue(owner.last_name),
    maidenName: cleanStringValue(owner.maiden_name),
    birthDate: cleanValue(owner.birth_date),
    birthPlace: cleanStringValue(owner.birth_place),
    birthNumber: cleanStringValue(owner.birth_number),
    citizenship: cleanStringValue(owner.citizenship) || 'SK',
    permanentAddress: cleanStringValue(owner.permanent_address),
    isPoliticallyExposed: Boolean(owner.is_politically_exposed)
  })) || [];

  // Transform consents
  const transformedConsents = {
    gdpr: Boolean(consents?.gdpr_consent),
    terms: Boolean(consents?.terms_consent),
    electronicCommunication: Boolean(consents?.electronic_communication_consent),
    signatureDate: cleanValue(consents?.signature_date),
    signingPersonId: cleanValue(consents?.signing_person_id)
  };

  const onboardingData: OnboardingData = {
    contractId: cleanStringValue(contract?.id),
    contractNumber: cleanStringValue(contract?.contract_number),
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
