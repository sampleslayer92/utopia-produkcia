
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

// Mock database of companies for testing
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
  }
};

export const recognizeCompanyFromName = async (companyName: string): Promise<CompanyRecognitionResult | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!companyName || companyName.length < 3) {
    return null;
  }

  // Simple fuzzy matching for demo
  const normalizedInput = companyName.toLowerCase().trim();
  
  for (const [key, company] of Object.entries(mockCompanyDatabase)) {
    if (key.toLowerCase().includes(normalizedInput) || 
        company.companyName.toLowerCase().includes(normalizedInput)) {
      return company;
    }
  }

  // If no exact match, generate mock data based on common patterns
  if (normalizedInput.includes('s.r.o') || normalizedInput.includes('sro')) {
    return generateMockSRO(companyName);
  } else if (normalizedInput.includes('a.s') || normalizedInput.includes('akciová')) {
    return generateMockAS(companyName);
  } else if (normalizedInput.includes('nezisková') || normalizedInput.includes('n.o')) {
    return generateMockNO(companyName);
  } else {
    return generateMockZivnost(companyName);
  }
};

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
