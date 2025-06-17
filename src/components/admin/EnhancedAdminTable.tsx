import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Filter, Plus, Search, Users, Eye } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEnhancedContractsData, useContractTypeOptions, useSalesPersonOptions } from "@/hooks/useEnhancedContractsData";
import { useBulkContractActions } from "@/hooks/useBulkContractActions";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BulkActionsPanel from "./table/BulkActionsPanel";

const EnhancedAdminTable = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    contractType: 'all',
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
  const { bulkUpdate, bulkDelete, isUpdating, isDeleting } = useBulkContractActions();

  const getStatusBadge = (status: string) => {
    const statusKey = status as keyof typeof statusMap;
    const statusMap = {
      'submitted': 'bg-blue-100 text-blue-700 border-blue-200',
      'approved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'rejected': 'bg-red-100 text-red-700 border-red-200',
      'draft': 'bg-gray-100 text-gray-700 border-gray-200'
    };

    return (
      <Badge className={statusMap[statusKey] || 'bg-gray-100 text-gray-700 border-gray-200'}>
        {t(`status.${status}`)}
      </Badge>
    );
  };

  const calculateProgress = (completedSteps: number) => {
    return Math.round((completedSteps / 8) * 100);
  };

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

  const handleExportData = () => {
    console.log('Exporting contracts data...');
    toast.success(t('messages.exportStarted'));
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
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={handleExportData}
                className="hover:bg-slate-50"
              >
                <Download className="h-4 w-4 mr-2" />
                {t('table.export')}
              </Button>
              <Button 
                onClick={() => navigate('/onboarding')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('table.newContract')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            {/* Search */}
            <div className="relative col-span-full md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t('table.search')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('table.filters.status')} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">{t('table.filters.allStatuses')}</SelectItem>
                  <SelectItem value="draft">{t('status.draft')}</SelectItem>
                  <SelectItem value="submitted">{t('status.submitted')}</SelectItem>
                  <SelectItem value="approved">{t('status.approved')}</SelectItem>
                  <SelectItem value="rejected">{t('status.rejected')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contract Type Filter */}
            <Select value={filters.contractType} onValueChange={(value) => handleFilterChange('contractType', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('table.filters.contractType')} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">{t('table.filters.allTypes')}</SelectItem>
                {contractTypes?.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sales Person Filter */}
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-slate-500" />
              <Select value={filters.salesPerson} onValueChange={(value) => handleFilterChange('salesPerson', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('table.filters.salesPerson')} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">{t('table.filters.allSalespeople')}</SelectItem>
                  {salesPersons?.map((person) => (
                    <SelectItem key={person} value={person}>{person}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd.MM.yyyy")} -{" "}
                        {format(dateRange.to, "dd.MM.yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd.MM.yyyy")
                    )
                  ) : (
                    t('table.filters.dateRange')
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => handleDateRangeChange({
                    from: range?.from,
                    to: range?.to
                  })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {filteredContracts?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Users className="h-16 w-16 mb-4 text-slate-300" />
              <h3 className="text-lg font-medium mb-2">{t('table.noResults.title')}</h3>
              <p className="text-center max-w-md">
                {t('table.noResults.subtitle')}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedContracts.length === filteredContracts?.length && filteredContracts.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300"
                      />
                    </TableHead>
                    <TableHead className="font-medium text-slate-700">{t('table.columns.contractNumber')}</TableHead>
                    <TableHead className="font-medium text-slate-700">{t('table.columns.client')}</TableHead>
                    <TableHead className="font-medium text-slate-700">{t('table.columns.contractType')}</TableHead>
                    <TableHead className="font-medium text-slate-700">{t('table.columns.monthlyValue')}</TableHead>
                    <TableHead className="font-medium text-slate-700">{t('table.columns.status')}</TableHead>
                    <TableHead className="font-medium text-slate-700">{t('table.columns.completion')}</TableHead>
                    <TableHead className="font-medium text-slate-700">{t('table.columns.salesPerson')}</TableHead>
                    <TableHead className="font-medium text-slate-700">{t('table.columns.created')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts?.map((contract) => (
                    <TableRow 
                      key={contract.id} 
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(contract.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedContracts.includes(contract.id)}
                          onChange={() => handleSelectContract(contract.id)}
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
                        <Badge variant="outline" className="text-slate-700">
                          {contract.contractType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        €{contract.contractValue.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(contract.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full" 
                              style={{ width: `${calculateProgress(contract.completedSteps)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-slate-600">
                            {calculateProgress(contract.completedSteps)}%
                          </span>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAdminTable;
