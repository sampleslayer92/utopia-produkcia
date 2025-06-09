import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, Calendar, Search, Filter, Plus, Download } from "lucide-react";
import { useEnhancedContractsData, useContractTypeOptions, useSalesPersonOptions, EnhancedContractData } from "@/hooks/useEnhancedContractsData";
import { useContractsRealtime } from "@/hooks/useContractsRealtime";
import { useBulkContractActions } from "@/hooks/useBulkContractActions";
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import ContractActionsDropdown from "./ContractActionsDropdown";
import TableColumnFilter from "./table/TableColumnFilter";
import BulkActionsPanel from "./table/BulkActionsPanel";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Vygenerovaná</Badge>;
    case 'submitted':
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Odoslaná</Badge>;
    case 'opened':
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Otvorená emailom</Badge>;
    case 'viewed':
      return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Zobrazená</Badge>;
    case 'approved':
      return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Podpísaná</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-700 border-red-200">Zamietnutá</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'd. M. yyyy', { locale: sk });
};

interface FilterState {
  status: string;
  contractType: string;
  dateFrom: string;
  dateTo: string;
  salesPerson: string;
  search: string;
}

interface ColumnFilters {
  status?: string;
  contractType?: string;
  clientName?: string;
  salesPerson?: string;
  createdAt?: { from: string; to: string };
}

const EnhancedAdminTable = () => {
  // Enable real-time updates
  useContractsRealtime();
  
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    contractType: 'all',
    dateFrom: '',
    dateTo: '',
    salesPerson: 'all',
    search: '',
  });

  // Column filters state
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({});

  // Selection state
  const [selectedContracts, setSelectedContracts] = useState<Set<string>>(new Set());

  const { data: contracts, isLoading, error } = useEnhancedContractsData(filters);
  const { data: contractTypes } = useContractTypeOptions();
  const { data: salesPersons } = useSalesPersonOptions();
  const { bulkUpdate, bulkDelete, isUpdating, isDeleting } = useBulkContractActions();

  // Apply column filters to contracts
  const filteredContracts = contracts?.filter(contract => {
    if (columnFilters.status && contract.status !== columnFilters.status) return false;
    if (columnFilters.contractType && contract.contractType !== columnFilters.contractType) return false;
    if (columnFilters.clientName && !contract.clientName.toLowerCase().includes(columnFilters.clientName.toLowerCase())) return false;
    if (columnFilters.salesPerson && contract.salesPerson !== columnFilters.salesPerson) return false;
    if (columnFilters.createdAt) {
      const contractDate = new Date(contract.created_at).toISOString().split('T')[0];
      const { from, to } = columnFilters.createdAt;
      if (from && contractDate < from) return false;
      if (to && contractDate > to) return false;
    }
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

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const updateColumnFilter = (column: keyof ColumnFilters, value: any) => {
    setColumnFilters(prev => ({ ...prev, [column]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      contractType: 'all',
      dateFrom: '',
      dateTo: '',
      salesPerson: 'all',
      search: '',
    });
    setColumnFilters({});
  };

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedContracts.size === filteredContracts?.length) {
      setSelectedContracts(new Set());
    } else {
      setSelectedContracts(new Set(filteredContracts?.map(c => c.id) || []));
    }
  };

  const toggleSelectContract = (contractId: string) => {
    const newSelection = new Set(selectedContracts);
    if (newSelection.has(contractId)) {
      newSelection.delete(contractId);
    } else {
      newSelection.add(contractId);
    }
    setSelectedContracts(newSelection);
  };

  const clearSelection = () => {
    setSelectedContracts(new Set());
  };

  // Bulk actions
  const handleBulkUpdate = (field: string, value: string) => {
    const contractIds = Array.from(selectedContracts);
    bulkUpdate({ contractIds, field, value });
    clearSelection();
  };

  const handleBulkDelete = () => {
    const contractIds = Array.from(selectedContracts);
    bulkDelete(contractIds);
    clearSelection();
  };

  // Check if column has active filter
  const hasActiveColumnFilter = (column: keyof ColumnFilters) => {
    const filter = columnFilters[column];
    if (!filter) return false;
    if (typeof filter === 'string') return filter.length > 0;
    if (typeof filter === 'object' && 'from' in filter) {
      return filter.from.length > 0 || filter.to.length > 0;
    }
    return false;
  };

  const statusOptions = [
    { value: 'draft', label: 'Vygenerovaná' },
    { value: 'submitted', label: 'Odoslaná' },
    { value: 'opened', label: 'Otvorená emailom' },
    { value: 'viewed', label: 'Zobrazená' },
    { value: 'approved', label: 'Podpísaná' },
    { value: 'rejected', label: 'Zamietnutá' },
  ];

  const contractTypeOptions = contractTypes?.map(type => ({ value: type, label: type })) || [];
  const salesPersonOptions = salesPersons?.map(person => ({ value: person, label: person })) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Quick Actions Bar */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/onboarding')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nová zmluva
            </Button>
            <Button variant="outline" disabled>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="text-sm text-slate-600">
            Načítavam zmluvy...
          </div>
        </div>

        {/* Loading Table */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Správa zmlúv</CardTitle>
          <CardDescription className="text-red-600">
            Chyba pri načítavaní zmlúv: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => navigate('/onboarding')}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nová zmluva
          </Button>
          <Button variant="outline" disabled>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="text-sm text-slate-600">
          Celkom zmlúv: {filteredContracts?.length || 0}
        </div>
      </div>

      {/* Enhanced Contracts Table */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">Správa zmlúv</CardTitle>
              <CardDescription className="text-slate-600">
                Kompletný prehľad všetkých zmlúv v systéme
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Advanced Filters */}
          <div className="space-y-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Vyhľadať zmluvu (ID, klient, obchodník, email)..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Všetky stavy" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Všetky stavy</SelectItem>
                  <SelectItem value="draft">Vygenerovaná</SelectItem>
                  <SelectItem value="submitted">Odoslaná</SelectItem>
                  <SelectItem value="opened">Otvorená emailom</SelectItem>
                  <SelectItem value="viewed">Zobrazená</SelectItem>
                  <SelectItem value="approved">Podpísaná</SelectItem>
                  <SelectItem value="rejected">Zamietnutá</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.contractType} onValueChange={(value) => updateFilter('contractType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Typ zmluvy" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Všetky typy</SelectItem>
                  {contractTypes?.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.salesPerson} onValueChange={(value) => updateFilter('salesPerson', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Obchodník" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Všetci obchodníci</SelectItem>
                  {salesPersons?.map(person => (
                    <SelectItem key={person} value={person}>{person}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                placeholder="Dátum od"
                value={filters.dateFrom}
                onChange={(e) => updateFilter('dateFrom', e.target.value)}
              />

              <Input
                type="date"
                placeholder="Dátum do"
                value={filters.dateTo}
                onChange={(e) => updateFilter('dateTo', e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Vymazať filtre
              </Button>
            </div>
          </div>

          {filteredContracts?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Building className="h-16 w-16 mb-4 text-slate-300" />
              <h3 className="text-lg font-medium mb-2">Žiadne výsledky</h3>
              <p className="text-center max-w-md">
                Pre zadané kritériá neboli nájdené žiadne zmluvy. Skúste zmeniť filter alebo vyhľadávací výraz.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedContracts.size === filteredContracts?.length && filteredContracts.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="font-medium text-slate-700">ID zmluvy</TableHead>
                    <TableHead className="font-medium text-slate-700">
                      <div className="flex items-center space-x-2">
                        <span>Status</span>
                        <TableColumnFilter
                          type="select"
                          options={statusOptions}
                          value={columnFilters.status}
                          onValueChange={(value) => updateColumnFilter('status', value)}
                          placeholder="Filtrovať status"
                          hasActiveFilter={hasActiveColumnFilter('status')}
                        />
                      </div>
                    </TableHead>
                    <TableHead className="font-medium text-slate-700">Vyplnené kroky</TableHead>
                    <TableHead className="font-medium text-slate-700">
                      <div className="flex items-center space-x-2">
                        <span>Dátum vytvorenia</span>
                        <TableColumnFilter
                          type="date-range"
                          value={columnFilters.createdAt}
                          onValueChange={(value) => updateColumnFilter('createdAt', value)}
                          hasActiveFilter={hasActiveColumnFilter('createdAt')}
                        />
                      </div>
                    </TableHead>
                    <TableHead className="font-medium text-slate-700 text-right">Hodnota (€)</TableHead>
                    <TableHead className="font-medium text-slate-700">
                      <div className="flex items-center space-x-2">
                        <span>Klient</span>
                        <TableColumnFilter
                          type="text"
                          value={columnFilters.clientName}
                          onValueChange={(value) => updateColumnFilter('clientName', value)}
                          placeholder="Filtrovať klienta"
                          hasActiveFilter={hasActiveColumnFilter('clientName')}
                        />
                      </div>
                    </TableHead>
                    <TableHead className="font-medium text-slate-700">
                      <div className="flex items-center space-x-2">
                        <span>Obchodník</span>
                        <TableColumnFilter
                          type="select"
                          options={salesPersonOptions}
                          value={columnFilters.salesPerson}
                          onValueChange={(value) => updateColumnFilter('salesPerson', value)}
                          placeholder="Filtrovať obchodníka"
                          hasActiveFilter={hasActiveColumnFilter('salesPerson')}
                        />
                      </div>
                    </TableHead>
                    <TableHead className="font-medium text-slate-700">
                      <div className="flex items-center space-x-2">
                        <span>Typ zmluvy</span>
                        <TableColumnFilter
                          type="select"
                          options={contractTypeOptions}
                          value={columnFilters.contractType}
                          onValueChange={(value) => updateColumnFilter('contractType', value)}
                          placeholder="Filtrovať typ"
                          hasActiveFilter={hasActiveColumnFilter('contractType')}
                        />
                      </div>
                    </TableHead>
                    <TableHead className="font-medium text-slate-700 w-16">Akcie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts?.map((contract: EnhancedContractData) => (
                    <TableRow 
                      key={contract.id} 
                      className={`hover:bg-slate-50/50 transition-colors ${
                        selectedContracts.has(contract.id) ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedContracts.has(contract.id)}
                          onCheckedChange={() => toggleSelectContract(contract.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        #{contract.contract_number}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(contract.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-emerald-600 h-2 rounded-full" 
                              style={{ width: `${(contract.completedSteps / 7) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-slate-600">{contract.completedSteps}/7</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-slate-600">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {formatDate(contract.created_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(contract.contractValue)}
                      </TableCell>
                      <TableCell className="text-slate-900">
                        {contract.clientName}
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {contract.salesPerson}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-blue-200 text-blue-700">
                          {contract.contractType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ContractActionsDropdown 
                          contractId={contract.id} 
                          contractNumber={contract.contract_number}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions Panel */}
      <BulkActionsPanel
        selectedCount={selectedContracts.size}
        onClearSelection={clearSelection}
        onBulkUpdate={handleBulkUpdate}
        onBulkDelete={handleBulkDelete}
        isLoading={isUpdating || isDeleting}
      />
    </div>
  );
};

export default EnhancedAdminTable;
