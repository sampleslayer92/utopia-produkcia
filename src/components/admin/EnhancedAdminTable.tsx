
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEnhancedContractsData, useContractTypeOptions, useSalesPersonOptions, useContractSourceOptions } from "@/hooks/useEnhancedContractsData";
import { useNavigate } from "react-router-dom";
import { useEnhancedAdminTableState } from "@/hooks/useEnhancedAdminTableState";
import BulkActionsHandler from "./table/BulkActionsHandler";
import EnhancedTableContent from "./table/EnhancedTableContent";

const EnhancedAdminTable = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  
  const {
    selectedContracts,
    filters,
    inlineFilters,
    handleInlineFiltersChange,
    handleSelectContract,
    handleSelectAll,
    clearSelection
  } = useEnhancedAdminTableState();

  const { data: contracts, isLoading, error } = useEnhancedContractsData(filters);
  const { data: contractTypes } = useContractTypeOptions();
  const { data: salesPersons } = useSalesPersonOptions();
  const { data: contractSources } = useContractSourceOptions();

  // Apply client-side filtering with inline filters
  const filteredContracts = contracts?.filter(contract => {
    // Date filtering
    if (inlineFilters.dateRange.from || inlineFilters.dateRange.to) {
      const contractDate = new Date(contract.created_at);
      const from = inlineFilters.dateRange.from ? new Date(inlineFilters.dateRange.from) : null;
      const to = inlineFilters.dateRange.to ? new Date(inlineFilters.dateRange.to) : null;
      if (from && contractDate < from) return false;
      if (to && contractDate > to) return false;
    }
    
    // Contract number filtering
    if (inlineFilters.contractNumber) {
      const searchTerm = inlineFilters.contractNumber.toLowerCase();
      if (!contract.contract_number.toLowerCase().includes(searchTerm)) return false;
    }

    // Client filtering
    if (inlineFilters.client) {
      const searchTerm = inlineFilters.client.toLowerCase();
      if (!contract.clientName.toLowerCase().includes(searchTerm) &&
          !contract.contact_info?.email?.toLowerCase().includes(searchTerm)) return false;
    }

    // Source filtering
    if (inlineFilters.source && inlineFilters.source !== 'all') {
      if (contract.source !== inlineFilters.source) return false;
    }

    // Contract type filtering
    if (inlineFilters.contractType && inlineFilters.contractType !== 'all') {
      if (contract.contractType !== inlineFilters.contractType) return false;
    }

    // Status filtering
    if (inlineFilters.status && inlineFilters.status !== 'all') {
      if (contract.status !== inlineFilters.status) return false;
    }

    // Sales person filtering
    if (inlineFilters.salesPerson && inlineFilters.salesPerson !== 'all') {
      if (contract.salesPerson !== inlineFilters.salesPerson) return false;
    }

    // Legacy search filtering
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        contract.contract_number.toString().includes(searchTerm) ||
        contract.clientName.toLowerCase().includes(searchTerm) ||
        contract.salesPerson.toLowerCase().includes(searchTerm) ||
        contract.contractType.toLowerCase().includes(searchTerm) ||
        contract.contact_info?.email?.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });

  const handleRowClick = (contractId: string) => {
    navigate(`/admin/contract/${contractId}/view`);
  };

  const handleSelectAllContracts = () => {
    handleSelectAll(filteredContracts || []);
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">{t('table.title')}</CardTitle>
          <CardDescription className="text-slate-600">
            {t('status.loading')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">{t('table.title')}</CardTitle>
          <CardDescription className="text-red-600">
            {t('status.error')}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <BulkActionsHandler
        selectedContracts={selectedContracts}
        onClearSelection={clearSelection}
      />
      
      <EnhancedTableContent
        contracts={contracts || []}
        filteredContracts={filteredContracts || []}
        selectedContracts={selectedContracts}
        onSelectContract={handleSelectContract}
        onSelectAll={handleSelectAllContracts}
        onRowClick={handleRowClick}
        contractTypes={contractTypes}
        salesPersons={salesPersons}
        contractSources={contractSources}
        onFiltersChange={handleInlineFiltersChange}
      />
    </div>
  );
};

export default EnhancedAdminTable;
