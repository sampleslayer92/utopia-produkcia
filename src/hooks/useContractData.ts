
import { useContractQueries } from './contract/useContractQueries';
import { transformContractData } from './contract/useContractTransformers';
import { OnboardingData } from '@/types/onboarding';

interface ContractDataSuccess {
  data: {
    contract: any;
    onboardingData: OnboardingData;
  };
  isLoading: false;
  error: null;
  isPending: false;
  isError: false;
}

interface ContractDataLoading {
  data: undefined;
  isLoading: true;
  error: null;
  isPending: true;
  isError: false;
}

interface ContractDataError {
  data: undefined;
  isLoading: false;
  error: any;
  isPending: false;
  isError: true;
}

type ContractDataResult = ContractDataSuccess | ContractDataLoading | ContractDataError;

export const useContractData = (contractId: string): ContractDataResult => {
  const queries = useContractQueries(contractId);
  
  if (queries.isLoading) {
    return {
      data: undefined,
      isLoading: true,
      error: null,
      isPending: true,
      isError: false
    };
  }

  if (queries.error || !queries.data) {
    return {
      data: undefined,
      isLoading: false,
      error: queries.error,
      isPending: false,
      isError: true
    };
  }

  const {
    contract,
    contactInfo,
    companyInfo,
    businessLocations,
    deviceSelection,
    authorizedPersons,
    actualOwners,
    consents
  } = queries.data;

  const onboardingData = transformContractData(
    contract,
    contactInfo,
    companyInfo,
    businessLocations,
    deviceSelection,
    authorizedPersons,
    actualOwners,
    consents
  );

  return {
    data: { contract, onboardingData },
    isLoading: false,
    error: null,
    isPending: false,
    isError: false
  };
};
