
import { CompanyAddress } from './company';

export interface BankAccount {
  id: string;
  format: 'IBAN' | 'CisloUctuKodBanky';
  iban?: string;
  cisloUctu?: string;
  kodBanky?: string;
  mena: 'EUR' | 'CZK' | 'USD';
}

export interface OpeningHours {
  day: 'Po' | 'Ut' | 'St' | 'Št' | 'Pi' | 'So' | 'Ne';
  open: string;
  close: string;
  otvorene: boolean;
}

export interface BusinessLocation {
  id: string;
  name: string;
  hasPOS: boolean;
  address: CompanyAddress;
  iban: string;
  bankAccounts?: BankAccount[];
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  businessSector: string;
  businessSubject?: string;
  mccCode?: string;
  estimatedTurnover: number;
  monthlyTurnover?: number;
  averageTransaction: number;
  openingHours: string;
  openingHoursDetailed?: OpeningHours[];
  seasonality: 'year-round' | 'seasonal';
  seasonalWeeks?: number;
  assignedPersons?: string[];
  createdFromContact?: boolean; // Flag to track if created from contact data
}
