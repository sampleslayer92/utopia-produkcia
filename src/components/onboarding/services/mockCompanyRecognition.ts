import { CompanyInfo } from "@/types/onboarding";

export interface CompanyRecognitionResult {
  companyName: string;
  registryType: CompanyInfo['registryType'];
  ico?: string;
  dic?: string;
  court?: string;
  section?: string;
  insertNumber?: string;
  isVatPayer?: boolean;
}

// Enhanced mock database with more companies for better testing
const mockCompanyDatabase: Record<string, CompanyRecognitionResult> = {
  "Slovak Telekom": {
    companyName: "Slovak Telekom, a.s.",
    registryType: "Akciová spoločnosť",
    ico: "35763469",
    dic: "2020845843",
    court: "Okresný súd Bratislava I",
    section: "Sa",
    insertNumber: "4677/B",
    isVatPayer: true
  },
  "Orange Slovensko": {
    companyName: "Orange Slovensko, a.s.",
    registryType: "Akciová spoločnosť",
    ico: "35697270",
    dic: "2020317808",
    court: "Okresný súd Bratislava I",
    section: "Sa",
    insertNumber: "2988/B",
    isVatPayer: true
  },
  "Tatra banka": {
    companyName: "Tatra banka, a.s.",
    registryType: "Akciová spoločnosť",
    ico: "00686930",
    dic: "2020409522",
    court: "Okresný súd Bratislava I",
    section: "Sa",
    insertNumber: "737/B",
    isVatPayer: true
  },
  "Pekáreň Novák": {
    companyName: "Pekáreň Novák s.r.o.",
    registryType: "S.r.o.",
    ico: "12345678",
    dic: "2023456789",
    court: "Okresný súd Bratislava I",
    section: "Sro",
    insertNumber: "45678/B",
    isVatPayer: false
  },
  "Slovenská pošta": {
    companyName: "Slovenská pošta, a.s.",
    registryType: "Akciová spoločnosť",
    ico: "36631124",
    dic: "2022141175",
    court: "Okresný súd Bratislava I",
    section: "Sa",
    insertNumber: "4534/B",
    isVatPayer: true
  },
  "RTVS": {
    companyName: "Rozhlas a televízia Slovenska",
    registryType: "Nezisková organizácia",
    ico: "42173639",
    dic: "2022741536",
    court: "Okresný súd Bratislava I",
    section: "Nz",
    insertNumber: "234/B",
    isVatPayer: false
  },
  "Kaufland": {
    companyName: "Kaufland Slovenská republika v.o.s.",
    registryType: "S.r.o.",
    ico: "35799617",
    dic: "2020283047",
    court: "Okresný súd Bratislava I",
    section: "Sro",
    insertNumber: "8756/B",
    isVatPayer: true
  },
  "Tesco": {
    companyName: "Tesco Stores SR, a.s.",
    registryType: "Akciová spoločnosť",
    ico: "35990600",
    dic: "2021966188",
    court: "Okresný súd Bratislava I",
    section: "Sa",
    insertNumber: "5534/B",
    isVatPayer: true
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

// Helper functions for generating mock data
const generateMockSRO = (name: string): CompanyRecognitionResult => ({
  companyName: name.includes('s.r.o') ? name : `${name} s.r.o.`,
  registryType: "S.r.o.",
  ico: generateMockICO(),
  dic: generateMockDIC(),
  court: "Okresný súd Bratislava I",
  section: "Sro",
  insertNumber: `${Math.floor(Math.random() * 99999)}/B`,
  isVatPayer: Math.random() > 0.5
});

const generateMockAS = (name: string): CompanyRecognitionResult => ({
  companyName: name.includes('a.s') ? name : `${name} a.s.`,
  registryType: "Akciová spoločnosť",
  ico: generateMockICO(),
  dic: generateMockDIC(),
  court: "Okresný súd Bratislava I",
  section: "Sa",
  insertNumber: `${Math.floor(Math.random() * 9999)}/B`,
  isVatPayer: true
});

const generateMockNO = (name: string): CompanyRecognitionResult => ({
  companyName: name,
  registryType: "Nezisková organizácia",
  ico: generateMockICO(),
  dic: generateMockDIC(),
  court: "Okresný súd Bratislava I",
  section: "Oz",
  insertNumber: `${Math.floor(Math.random() * 9999)}/B`,
  isVatPayer: false
});

const generateMockZivnost = (name: string): CompanyRecognitionResult => ({
  companyName: name,
  registryType: "Živnosť",
  ico: generateMockICO(),
  dic: generateMockDIC(),
  isVatPayer: Math.random() > 0.7
});

const generateMockICO = (): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const generateMockDIC = (): string => {
  return `20${Math.floor(10000000 + Math.random() * 90000000)}`;
};
