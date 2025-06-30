
import { useState } from "react";

export const useEnhancedAdminTableState = () => {
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    contractType: 'all',
    source: 'all',
    salesPerson: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  // Inline table filters
  const [inlineFilters, setInlineFilters] = useState({
    contractNumber: '',
    client: '',
    source: '',
    contractType: '',
    status: '',
    salesPerson: '',
    dateRange: { from: '', to: '' }
  });

  const handleInlineFiltersChange = (newInlineFilters: any) => {
    console.log('Inline filters changed:', newInlineFilters);
    setInlineFilters(newInlineFilters);
  };

  const handleSelectContract = (contractId: string) => {
    setSelectedContracts(prev => 
      prev.includes(contractId) 
        ? prev.filter(id => id !== contractId)
        : [...prev, contractId]
    );
  };

  const handleSelectAll = (filteredContracts: any[]) => {
    if (selectedContracts.length === filteredContracts?.length) {
      setSelectedContracts([]);
    } else {
      setSelectedContracts(filteredContracts?.map(c => c.id) || []);
    }
  };

  const clearSelection = () => {
    setSelectedContracts([]);
  };

  return {
    selectedContracts,
    filters,
    inlineFilters,
    setFilters,
    handleInlineFiltersChange,
    handleSelectContract,
    handleSelectAll,
    clearSelection
  };
};
