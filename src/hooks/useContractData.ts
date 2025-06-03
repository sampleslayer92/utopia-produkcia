
import { useContractQueries } from './contract/useContractQueries';
import { transformContractData } from './contract/useContractTransformers';

export const useContractData = (contractId: string) => {
  const queries = useContractQueries(contractId);
  
  if (queries.isLoading || queries.error || !queries.data) {
    return queries;
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
    ...queries,
    data: { contract, onboardingData }
  };
};
