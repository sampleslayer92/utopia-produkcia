
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Eye } from "lucide-react";
import { format } from "date-fns";
import { useContractBadges } from "./ContractBadges";
import { InlineTableFilter } from "./InlineTableFilters";

interface EnhancedContractsTableProps {
  contracts: any[];
  selectedContracts: string[];
  onSelectContract: (contractId: string) => void;
  onSelectAll: () => void;
  onRowClick: (contractId: string) => void;
  contractTypes?: string[];
  salesPersons?: string[];
  contractSources?: string[];
  onFiltersChange: (filters: any) => void;
}

const EnhancedContractsTable = ({
  contracts,
  selectedContracts,
  onSelectContract,
  onSelectAll,
  onRowClick,
  contractTypes = [],
  salesPersons = [],
  contractSources = [],
  onFiltersChange
}: EnhancedContractsTableProps) => {
  const { t } = useTranslation('admin');
  const { getStatusBadge, getSourceBadge } = useContractBadges();
  
  const [filters, setFilters] = useState({
    contractNumber: '',
    client: '',
    source: '',
    contractType: '',
    status: '',
    salesPerson: '',
    dateRange: { from: '', to: '' }
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const statusOptions = [
    { value: 'draft', label: t('status.draft') },
    { value: 'submitted', label: t('status.submitted') },
    { value: 'approved', label: t('status.approved') },
    { value: 'rejected', label: t('status.rejected') },
    { value: 'in_progress', label: t('status.in_progress') },
    { value: 'sent_to_client', label: t('status.sent_to_client') },
    { value: 'signed', label: t('status.signed') },
    { value: 'lost', label: t('status.lost') }
  ];

  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <Users className="h-16 w-16 mb-4 text-slate-300" />
        <h3 className="text-lg font-medium mb-2">{t('table.noResults.title')}</h3>
        <p className="text-center max-w-md">
          {t('table.noResults.subtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={selectedContracts.length === contracts.length && contracts.length > 0}
                onChange={onSelectAll}
                className="rounded border-slate-300"
              />
            </TableHead>
            <TableHead className="font-medium text-slate-700">
              <div className="flex items-center justify-between">
                {t('table.columns.contractNumber')}
                <InlineTableFilter
                  type="text"
                  placeholder="Hľadať číslo zmluvy..."
                  value={filters.contractNumber}
                  onValueChange={(value) => handleFilterChange('contractNumber', value)}
                  hasActiveFilter={!!filters.contractNumber}
                />
              </div>
            </TableHead>
            <TableHead className="font-medium text-slate-700">
              <div className="flex items-center justify-between">
                {t('table.columns.client')}
                <InlineTableFilter
                  type="text"
                  placeholder="Hľadať klienta..."
                  value={filters.client}
                  onValueChange={(value) => handleFilterChange('client', value)}
                  hasActiveFilter={!!filters.client}
                />
              </div>
            </TableHead>
            <TableHead className="font-medium text-slate-700">
              <div className="flex items-center justify-between">
                {t('table.columns.source')}
                <InlineTableFilter
                  type="select"
                  options={contractSources.map(source => ({ value: source, label: source }))}
                  value={filters.source}
                  onValueChange={(value) => handleFilterChange('source', value)}
                  hasActiveFilter={!!filters.source}
                />
              </div>
            </TableHead>
            <TableHead className="font-medium text-slate-700">
              <div className="flex items-center justify-between">
                {t('table.columns.contractType')}
                <InlineTableFilter
                  type="select"
                  options={contractTypes.map(type => ({ value: type, label: type }))}
                  value={filters.contractType}
                  onValueChange={(value) => handleFilterChange('contractType', value)}
                  hasActiveFilter={!!filters.contractType}
                />
              </div>
            </TableHead>
            <TableHead className="font-medium text-slate-700">{t('table.columns.monthlyValue')}</TableHead>
            <TableHead className="font-medium text-slate-700">
              <div className="flex items-center justify-between">
                {t('table.columns.status')}
                <InlineTableFilter
                  type="select"
                  options={statusOptions}
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                  hasActiveFilter={!!filters.status}
                />
              </div>
            </TableHead>
            <TableHead className="font-medium text-slate-700">{t('table.columns.completion')}</TableHead>
            <TableHead className="font-medium text-slate-700">
              <div className="flex items-center justify-between">
                {t('table.columns.salesPerson')}
                <InlineTableFilter
                  type="select"
                  options={salesPersons.map(person => ({ value: person, label: person }))}
                  value={filters.salesPerson}
                  onValueChange={(value) => handleFilterChange('salesPerson', value)}
                  hasActiveFilter={!!filters.salesPerson}
                />
              </div>
            </TableHead>
            <TableHead className="font-medium text-slate-700">
              <div className="flex items-center justify-between">
                {t('table.columns.created')}
                <InlineTableFilter
                  type="date-range"
                  value={filters.dateRange}
                  onValueChange={(value) => handleFilterChange('dateRange', value)}
                  hasActiveFilter={!!(filters.dateRange.from || filters.dateRange.to)}
                />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow 
              key={contract.id} 
              className="hover:bg-slate-50/80 transition-colors cursor-pointer"
              onClick={() => onRowClick(contract.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedContracts.includes(contract.id)}
                  onChange={() => onSelectContract(contract.id)}
                  className="rounded border-slate-300"
                />
              </TableCell>
              <TableCell className="font-medium text-slate-900">
                #{contract.contract_number}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-slate-900">{contract.clientName}</p>
                  {contract.contact_info?.email && (
                    <p className="text-sm text-slate-600">{contract.contact_info.email}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {getSourceBadge(contract.source)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-slate-700">
                  {contract.contractType}
                </Badge>
              </TableCell>
              <TableCell className="font-medium text-slate-900">
                €{contract.contractValue.toFixed(2)}
              </TableCell>
              <TableCell>
                {getStatusBadge(contract.status, contract.current_step)}
              </TableCell>
              <TableCell>
                <div className="text-sm text-slate-600">
                  {contract.completedSteps}/7 krokov
                </div>
              </TableCell>
              <TableCell className="text-slate-700">
                {contract.salesPerson}
              </TableCell>
              <TableCell className="text-slate-600 text-sm">
                {format(new Date(contract.created_at), 'dd.MM.yyyy HH:mm')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EnhancedContractsTable;
