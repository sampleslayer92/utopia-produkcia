export interface AresPersonInfo {
  firstName: string;
  lastName: string;
  position: string;
  birthDate?: string;
  citizenship?: string;
  functionStart?: string;
  functionEnd?: string;
}

export interface CompanyPersonsResult {
  companyName: string;
  ico: string;
  persons: AresPersonInfo[];
}

export interface AresPersonsResponse {
  success: boolean;
  data?: CompanyPersonsResult;
  error?: string;
}