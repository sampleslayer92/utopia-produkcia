export type PersonRoleType = 
  | 'contact_person'
  | 'authorized_person' 
  | 'actual_owner'
  | 'statutory_representative';

export interface Person {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  birth_place?: string;
  birth_number?: string;
  permanent_address?: string;
  citizenship?: string;
  maiden_name?: string;
  document_type?: 'OP' | 'Pas' | 'ID';
  document_number?: string;
  document_issuer?: string;
  document_country?: string;
  document_validity?: string;
  position?: string;
  is_politically_exposed?: boolean;
  is_us_citizen?: boolean;
  is_predefined?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PersonRole {
  id: string;
  contract_id: string;
  person_id: string;
  role_type: PersonRoleType;
  created_at?: string;
  updated_at?: string;
}

export interface PersonWithRoles extends Person {
  roles: PersonRoleType[];
}

export const PERSON_ROLE_LABELS: Record<PersonRoleType, { sk: string; en: string }> = {
  contact_person: { sk: 'Kontaktná osoba', en: 'Contact Person' },
  authorized_person: { sk: 'Splnomocnená osoba', en: 'Authorized Person' },
  actual_owner: { sk: 'Skutočný majiteľ', en: 'Actual Owner' },
  statutory_representative: { sk: 'Štatutár', en: 'Statutory Representative' }
};