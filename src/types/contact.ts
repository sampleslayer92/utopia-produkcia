
export interface ContactInfo {
  personId?: string; // Add stable person ID
  country?: string; // Country code (e.g., 'SK', 'CZ', 'AT')
  salutation?: 'Pan' | 'Pani';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phonePrefix: string;
  salesNote?: string;
  userRole?: string;
  userRoles?: string[]; // Add support for multiple roles
}

export interface ContactPerson {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isTechnicalPerson: boolean;
}

export interface AuthorizedPerson {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phonePrefix: string; // Add phonePrefix field
  maidenName?: string;
  birthDate: string;
  birthPlace: string;
  birthNumber: string;
  permanentAddress: string;
  position: string;
  documentType: 'OP' | 'Pas';
  documentNumber: string;
  documentValidity: string;
  documentIssuer: string;
  documentCountry: string;
  citizenship: string;
  isPoliticallyExposed: boolean;
  isUSCitizen: boolean;
  documentFrontUrl?: string;
  documentBackUrl?: string;
  createdFromContact?: boolean; // Flag to track if created from contact data
}

export interface ActualOwner {
  id: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  birthDate: string;
  birthPlace: string;
  birthNumber: string;
  citizenship: string;
  permanentAddress: string;
  isPoliticallyExposed: boolean;
  createdFromContact?: boolean; // Flag to track if created from contact data
}
