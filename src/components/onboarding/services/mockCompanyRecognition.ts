
import { CompanyInfo, CompanyAddress } from "@/types/onboarding";

export interface CompanyRecognitionResult {
  companyName: string;
  registryType: CompanyInfo['registryType'];
  ico?: string;
  dic?: string;
  
  // Legacy fields (kept for backward compatibility)
  court?: string;
  section?: string;
  insertNumber?: string;
  
  // New registration info structure
  registrationInfo?: {
    registrationType?: 'commercial_register' | 'trade_license' | 'nonprofit_register' | 'other';
    court?: string;
    section?: string;
    insertNumber?: string;
    tradeOffice?: string;
    tradeLicenseNumber?: string;
    registrationAuthority?: string;
    registrationNumber?: string;
  };
  
  isVatPayer?: boolean;
  address?: CompanyAddress;
}

// Enhanced mock database with more companies and realistic Slovak addresses
const mockCompanyDatabase: Record<string, CompanyRecognitionResult> = {
  "Slovak Telekom": {
    companyName: "Slovak Telekom, a.s.",
    registryType: "Akciová spoločnosť",
    ico: "35763469",
    dic: "2020845843",
    court: "Okresný súd Bratislava I",
    section: "Sa",
    insertNumber: "4677/B",
    isVatPayer: true,
    address: {
      street: "Bajkalská 28",
      city: "Bratislava - mestská časť Nové Mesto",
      zipCode: "81762"
    }
  },
  "Orange Slovensko": {
    companyName: "Orange Slovensko, a.s.",
    registryType: "Akciová spoločnosť",
    ico: "35697270",
    dic: "2020317808",
    court: "Okresný súd Bratislava I",
    section: "Sa",
    insertNumber: "2988/B",
    isVatPayer: true,
    address: {
      street: "Metodova 8",
      city: "Bratislava - mestská časť Karlova Ves",
      zipCode: "82109"
    }
  },
  "Tatra banka": {
    companyName: "Tatra banka, a.s.",
    registryType: "Akciová spoločnosť",
    ico: "00686930",
    dic: "2020409522",
    court: "Okresný súd Bratislava I",
    section: "Sa",
    insertNumber: "737/B",
    isVatPayer: true,
    address: {
      street: "Hodžovo námestie 3",
      city: "Bratislava - mestská časť Staré Mesto",
      zipCode: "81106"
    }
  },
  "onePos": {
    companyName: "onePos s.r.o.",
    registryType: "S.r.o.",
    ico: "12345678",
    dic: "2023456789",
    court: "Okresný súd Bratislava I",
    section: "Sro",
    insertNumber: "142250/B",
    isVatPayer: true,
    address: {
      street: "Na Grunte 12888/5",
      city: "Bratislava - mestská časť Nové Mesto",
      zipCode: "83152"
    }
  },
  "Pekáreň Novák": {
    companyName: "Pekáreň Novák s.r.o.",
    registryType: "S.r.o.",
    ico: "87654321",
    dic: "2023456780",
    court: "Okresný súd Košice I",
    section: "Sro",
    insertNumber: "45678/B",
    isVatPayer: false,
    address: {
      street: "Hlavná ulica 15",
      city: "Košice - mestská časť Staré Mesto",
      zipCode: "04001"
    }
  },
  "Slovenská pošta": {
    companyName: "Slovenská pošta, a.s.",
    registryType: "Akciová spoločnosť",
    ico: "36631124",
    dic: "2022141175",
    court: "Okresný súd Bratislava I",
    section: "Sa",
    insertNumber: "4534/B",
    isVatPayer: true,
    address: {
      street: "Partizánska cesta 9",
      city: "Bratislava - mestská časť Nové Mesto",
      zipCode: "97599"
    }
  },
  "RTVS": {
    companyName: "Rozhlas a televízia Slovenska",
    registryType: "Nezisková organizácia",
    ico: "42173639",
    dic: "2022741536",
    court: "Okresný súd Bratislava I",
    section: "Nz",
    insertNumber: "234/B",
    isVatPayer: false,
    address: {
      street: "Mýtna 1",
      city: "Bratislava - mestská časť Staré Mesto",
      zipCode: "81790"
    }
  },
  "Kaufland": {
    companyName: "Kaufland Slovenská republika v.o.s.",
    registryType: "S.r.o.",
    ico: "35799617",
    dic: "2020283047",
    court: "Okresný súd Bratislava I",
    section: "Sro",
    insertNumber: "8756/B",
    isVatPayer: true,
    address: {
      street: "Einsteinova 24",
      city: "Bratislava - mestská časť Petržalka",
      zipCode: "85101"
    }
  },
  "Tesco": {
    companyName: "Tesco Stores SR, a.s.",
    registryType: "Akciová spoločnosť",
    ico: "35990600",
    dic: "2021966188",
    court: "Okresný súd Bratislava I",
    section: "Sa",
    insertNumber: "5534/B",
    isVatPayer: true,
    address: {
      street: "Kamenné námestie 1",
      city: "Bratislava - mestská časť Staré Mesto",
      zipCode: "81106"
    }
  }
};

// New function for autocomplete suggestions
export const searchCompanySuggestions = async (query: string): Promise<CompanyRecognitionResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));

  if (!query || query.length < 2) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: CompanyRecognitionResult[] = [];

  // Search in mock database
  for (const [key, company] of Object.entries(mockCompanyDatabase)) {
    const normalizedKey = key.toLowerCase();
    const normalizedCompanyName = company.companyName.toLowerCase();
    
    // Check if query matches beginning of key or company name
    if (normalizedKey.startsWith(normalizedQuery) || 
        normalizedCompanyName.includes(normalizedQuery) ||
        normalizedKey.includes(normalizedQuery)) {
      results.push(company);
    }
  }

  // If no exact matches, generate some mock suggestions based on common patterns
  if (results.length === 0) {
    if (normalizedQuery.includes('sro') || normalizedQuery.includes('s.r.o')) {
      results.push(generateMockSRO(query));
    } else if (normalizedQuery.includes('a.s') || normalizedQuery.includes('akciová')) {
      results.push(generateMockAS(query));
    } else if (normalizedQuery.includes('nezisková') || normalizedQuery.includes('n.o')) {
      results.push(generateMockNO(query));
    } else {
      // Generate a few different suggestions
      results.push(
        generateMockZivnost(query),
        generateMockSRO(query + " s.r.o."),
      );
    }
  }

  // Limit results to prevent overwhelming UI
  return results.slice(0, 8);
};

// Keep original function for backward compatibility
export const recognizeCompanyFromName = async (companyName: string): Promise<CompanyRecognitionResult | null> => {
  const suggestions = await searchCompanySuggestions(companyName);
  return suggestions.length > 0 ? suggestions[0] : null;
};

// Helper functions for generating mock data with realistic Slovak addresses
const generateMockSRO = (name: string): CompanyRecognitionResult => ({
  companyName: name.includes('s.r.o') ? name : `${name} s.r.o.`,
  registryType: "S.r.o.",
  ico: generateMockICO(),
  dic: generateMockDIC(),
  court: "Okresný súd Bratislava I",
  section: "Sro",
  insertNumber: `${Math.floor(Math.random() * 99999)}/B`,
  isVatPayer: Math.random() > 0.5,
  address: generateMockSlovakAddress()
});

const generateMockAS = (name: string): CompanyRecognitionResult => ({
  companyName: name.includes('a.s') ? name : `${name} a.s.`,
  registryType: "Akciová spoločnosť",
  ico: generateMockICO(),
  dic: generateMockDIC(),
  court: "Okresný súd Bratislava I",
  section: "Sa",
  insertNumber: `${Math.floor(Math.random() * 9999)}/B`,
  isVatPayer: true,
  address: generateMockSlovakAddress()
});

const generateMockNO = (name: string): CompanyRecognitionResult => ({
  companyName: name,
  registryType: "Nezisková organizácia",
  ico: generateMockICO(),
  dic: generateMockDIC(),
  court: "Okresný súd Bratislava I",
  section: "Oz",
  insertNumber: `${Math.floor(Math.random() * 9999)}/B`,
  isVatPayer: false,
  address: generateMockSlovakAddress()
});

const generateMockZivnost = (name: string): CompanyRecognitionResult => ({
  companyName: name,
  registryType: "Živnosť",
  ico: generateMockICO(),
  dic: generateMockDIC(),
  isVatPayer: Math.random() > 0.7,
  address: generateMockSlovakAddress()
});

const generateMockSlovakAddress = (): CompanyAddress => {
  const streets = [
    "Hlavná ulica", "Námestie SNP", "Štúrova", "Hviezdoslavovo námestie", 
    "Kollárova", "Dunajská", "Obchodná", "Grosslingova", "Šancová",
    "Na Grunte", "Metodova", "Bajkalská", "Einsteinova", "Partizánska cesta"
  ];
  
  const cities = [
    "Bratislava - mestská časť Staré Mesto",
    "Bratislava - mestská časť Nové Mesto", 
    "Bratislava - mestská časť Petržalka",
    "Bratislava - mestská časť Karlova Ves",
    "Košice - mestská časť Staré Mesto",
    "Prešov", 
    "Žilina", 
    "Banská Bystrica", 
    "Nitra", 
    "Trnava"
  ];
  
  const houseNumber = Math.floor(Math.random() * 200) + 1;
  const buildingNumber = Math.floor(Math.random() * 20000) + 1000;
  
  return {
    street: `${streets[Math.floor(Math.random() * streets.length)]} ${buildingNumber}/${houseNumber}`,
    city: cities[Math.floor(Math.random() * cities.length)],
    zipCode: `${Math.floor(Math.random() * 90000) + 10000}`
  };
};

const generateMockICO = (): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const generateMockDIC = (): string => {
  return `20${Math.floor(10000000 + Math.random() * 90000000)}`;
};
