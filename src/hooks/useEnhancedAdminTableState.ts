
import { useState } from 'react';
import { EnhancedContractData } from './useEnhancedContractsData';

interface InlineFilters {
  dateRange: {
    from?: string;
    to?: string;
  };
  contractNumber: string;
  client: string;
  source: string;
  contractType: string;
  status: string;
  salesPerson: string;
}

export const useEnhancedAdminTableState = () => {
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [inlineFilters, setInlineFilters] = useState<InlineFilters>({
    dateRange: {},
    contractNumber: '',
    client: '',
    source: 'all',
    contractType: 'all',
    status: 'all',
    salesPerson: 'all',
  });

  const handleInlineFiltersChange = (newFilters: Partial<InlineFilters>) => {
    setInlineFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSelectContract = (contractId: string) => {
    setSelectedContracts(prev => 
      prev.includes(contractId)
        ? prev.filter(id => id !== contractId)
        : [...prev, contractId]
    );
  };

  const handleSelectAll = (contracts: EnhancedContractData[]) => {
    const allIds = contracts.map(c => c.id);
    setSelectedContracts(
      selectedContracts.length === allIds.length ? [] : allIds
    );
  };

  const clearSelection = () => {
    setSelectedContracts([]);
  };

  return {
    selectedContracts,
    filters,
    inlineFilters,
    handleInlineFiltersChange,
    handleSelectContract,
    handleSelectAll,
    clearSelection,
    setFilters,
  };
};
