
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { useEnhancedContractsData, useContractTypeOptions, useSalesPersonOptions, useContractSourceOptions } from "@/hooks/useEnhancedContractsData";
import { useBulkContractActions } from "@/hooks/useBulkContractActions";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BulkActionsPanel from "./table/BulkActionsPanel";
import ContractFilters from "./table/ContractFilters";
import ContractsTable from "./table/ContractsTable";

const EnhancedAdminTable = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
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

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const { data: contracts, isLoading, error } = useEnhancedContractsData(filters);
  const { data: contractTypes } = useContractTypeOptions();
  const { data: salesPersons } = useSalesPersonOptions();
  const { data: contractSources } = useContractSourceOptions();
  const { bulkUpdate, bulkDelete, isUpdating, isDeleting } = useBulkContractActions();

  // Apply client-side filtering
  const filteredContracts = contracts?.filter(contract => {
    // Date filtering
    if (dateRange.from || dateRange.to) {
      const contractDate = new Date(contract.created_at);
      const from = dateRange.from;
      const to = dateRange.to;
      if (from && contractDate < from) return false;
      if (to && contractDate > to) return false;
    }
    
    // Search filtering
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        contract.contract_number.includes(searchTerm) ||
        contract.clientName.toLowerCase().includes(searchTerm) ||
        contract.salesPerson.toLowerCase().includes(searchTerm) ||
        contract.contractType.toLowerCase().includes(searchTerm) ||
        contract.contact_info?.email?.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    setFilters(prev => ({
      ...prev,
      dateFrom: range.from ? format(range.from, 'yyyy-MM-dd') : '',
      dateTo: range.to ? format(range.to, 'yyyy-MM-dd') : ''
    }));
  };

  const handleSelectContract = (contractId: string) => {
    setSelectedContracts(prev => 
      prev.includes(contractId) 
        ? prev.filter(id => id !== contractId)
        : [...prev, contractId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContracts.length === filteredContracts?.length) {
      setSelectedContracts([]);
    } else {
      setSelectedContracts(filteredContracts?.map(c => c.id) || []);
    }
  };

  const handleRowClick = (contractId: string) => {
    navigate(`/admin/contract/${contractId}/view`);
  };

  const handleBulkUpdate = (field: string, value: string) => {
    console.log(`Bulk update: ${field} = ${value} on contracts:`, selectedContracts);
    
    if (selectedContracts.length === 0) {
      toast.error(t('messages.noContractsSelected'));
      return;
    }

    bulkUpdate(
      { contractIds: selectedContracts, field, value },
      {
        onSuccess: () => {
          setSelectedContracts([]);
        },
        onError: (error) => {
          console.error('Bulk update failed:', error);
        }
      }
    );
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete contracts:', selectedContracts);
    
    if (selectedContracts.length === 0) {
      toast.error(t('messages.noContractsToDelete'));
      return;
    }

    const getDeleteUnit = (count: number) => {
      if (count === 1) return t('messages.deleteUnits.single');
      if (count < 5) return t('messages.deleteUnits.few');
      return t('messages.deleteUnits.many');
    };

    const confirmed = window.confirm(
      t('messages.confirmDelete', { 
        count: selectedContracts.length, 
        unit: getDeleteUnit(selectedContracts.length) 
      })
    );

    if (!confirmed) {
      console.log('Bulk delete cancelled by user');
      return;
    }

    bulkDelete(selectedContracts, {
      onSuccess: () => {
        setSelectedContracts([]);
      },
      onError: (error) => {
        console.error('Bulk delete failed:', error);
      }
    });
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">{t('table.title')}</CardTitle>
          <CardDescription className="text-slate-600">
            Načítavam zmluvy...
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
            Chyba pri načítavaní zmlúv: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {selectedContracts.length > 0 && (
        <BulkActionsPanel
          selectedCount={selectedContracts.length}
          onClearSelection={() => setSelectedContracts([])}
          onBulkUpdate={handleBulkUpdate}
          onBulkDelete={handleBulkDelete}
          isLoading={isUpdating || isDeleting}
        />
      )}
      
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">{t('table.title')}</CardTitle>
              <CardDescription className="text-slate-600">
                {t('table.subtitle', { 
                  filtered: filteredContracts?.length || 0, 
                  total: contracts?.length || 0 
                })}
                <br />
                <span className="inline-flex items-center text-sm text-slate-500 mt-1">
                  <Eye className="h-3 w-3 mr-1" />
                  {t('table.clickHint')}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ContractFilters
            filters={filters}
            dateRange={dateRange}
            contractTypes={contractTypes}
            salesPersons={salesPersons}
            contractSources={contractSources}
            onFilterChange={handleFilterChange}
            onDateRangeChange={handleDateRangeChange}
          />

          <ContractsTable
            contracts={filteredContracts || []}
            selectedContracts={selectedContracts}
            onSelectContract={handleSelectContract}
            onSelectAll={handleSelectAll}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAdminTable;
