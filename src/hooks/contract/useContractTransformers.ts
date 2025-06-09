import { BusinessLocation, DeviceCard, OnboardingData, AuthorizedPerson, ActualOwner, BankAccount } from "@/types/onboarding";

export const transformBusinessLocationForContract = (location: BusinessLocation) => {
  return {
    location_id: location.id,
    name: location.name,
    has_pos: location.hasPOS,
    address_street: location.address.street,
    address_city: location.address.city,
    address_zip_code: location.address.zipCode,
    iban: location.bankAccounts?.[0]?.iban || location.iban || '',
    contact_person_name: location.contactPerson.name,
    contact_person_email: location.contactPerson.email,
    contact_person_phone: location.contactPerson.phone,
    business_sector: location.businessSubject || location.businessSector || '',
    estimated_turnover: location.monthlyTurnover || location.estimatedTurnover || 0,
    average_transaction: location.averageTransaction,
    opening_hours: location.openingHours,
    seasonality: location.seasonality,
    seasonal_weeks: location.seasonalWeeks
  };
};

export const transformBankAccountForContract = (bankAccount: BankAccount) => {
  return {
    typ: bankAccount.typ,
    iban: bankAccount.iban || '',
    cislo_uctu: bankAccount.cisloUctu || '',
    kod_banky: bankAccount.kodBanky || '',
    mena: bankAccount.mena
  };
};

export const transformDeviceCardForContract = (device: DeviceCard) => {
  return {
    device_id: device.id,
    category: device.category,
    name: device.name,
    description: device.description,
    count: device.count,
    monthly_fee: device.monthlyFee,
    company_cost: device.companyCost,
    specifications: device.specifications?.join(', ') || '',
    sim_cards: device.simCards,
    custom_value: device.customValue
  };
};

export const transformAuthorizedPersonForContract = (person: AuthorizedPerson) => {
  return {
    first_name: person.firstName,
    last_name: person.lastName,
    email: person.email,
    phone: person.phone,
    phone_prefix: person.phonePrefix,
    maiden_name: person.maidenName,
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
  };
};

export const transformActualOwnerForContract = (owner: ActualOwner) => {
  return {
    first_name: owner.firstName,
    last_name: owner.lastName,
    maiden_name: owner.maidenName,
    birth_date: owner.birthDate,
    birth_place: owner.birthPlace,
    birth_number: owner.birthNumber,
    citizenship: owner.citizenship,
    permanent_address: owner.permanentAddress,
    is_politically_exposed: owner.isPoliticallyExposed
  };
};

export const transformOnboardingDataForContract = (data: OnboardingData) => {
  return {
    contact_info: {
      salutation: data.contactInfo.salutation,
      first_name: data.contactInfo.firstName,
      last_name: data.contactInfo.lastName,
      email: data.contactInfo.email,
      phone: data.contactInfo.phone,
      phone_prefix: data.contactInfo.phonePrefix,
      sales_note: data.contactInfo.salesNote,
      user_role: data.contactInfo.userRole,
      user_roles: data.contactInfo.userRoles?.join(', ')
    },
    company_info: {
      ico: data.companyInfo.ico,
      dic: data.companyInfo.dic,
      company_name: data.companyInfo.companyName,
      registry_type: data.companyInfo.registryType,
      is_vat_payer: data.companyInfo.isVatPayer,
      vat_number: data.companyInfo.vatNumber,
      court: data.companyInfo.court,
      section: data.companyInfo.section,
      insert_number: data.companyInfo.insertNumber,
      address_street: data.companyInfo.address.street,
      address_city: data.companyInfo.address.city,
      address_zip_code: data.companyInfo.address.zipCode,
      contact_address_same_as_main: data.companyInfo.contactAddressSameAsMain,
      contact_address_street: data.companyInfo.contactAddress?.street,
      contact_address_city: data.companyInfo.contactAddress?.city,
      contact_address_zip_code: data.companyInfo.contactAddress?.zipCode,
      contact_person_first_name: data.companyInfo.contactPerson.firstName,
      contact_person_last_name: data.companyInfo.contactPerson.lastName,
      contact_person_email: data.companyInfo.contactPerson.email,
      contact_person_phone: data.companyInfo.contactPerson.phone,
      is_technical_person: data.companyInfo.contactPerson.isTechnicalPerson
    },
    business_locations: data.businessLocations.map(transformBusinessLocationForContract),
    device_selection: {
      selected_solutions: data.deviceSelection.selectedSolutions.join(', '),
      dynamic_cards: data.deviceSelection.dynamicCards.map(transformDeviceCardForContract),
      note: data.deviceSelection.note
    },
    fees: {
      regulated_cards: data.fees.regulatedCards,
      unregulated_cards: data.fees.unregulatedCards
    },
    authorized_persons: data.authorizedPersons.map(transformAuthorizedPersonForContract),
    actual_owners: data.actualOwners.map(transformActualOwnerForContract),
    consents: {
      gdpr: data.consents.gdpr,
      terms: data.consents.terms,
      electronic_communication: data.consents.electronicCommunication,
      signature_date: data.consents.signatureDate,
      signing_person_id: data.consents.signingPersonId
    }
  };
};
