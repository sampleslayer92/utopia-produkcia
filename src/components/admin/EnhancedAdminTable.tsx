import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BulkActionsPanel from "./table/BulkActionsPanel";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'submitted':
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Odoslané</Badge>;
    case 'approved':
      return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Schválené</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-700 border-red-200">Zamietnuté</Badge>;
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Koncept</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const calculateProgress = (completedSteps: number) => {
  return Math.round((completedSteps / 8) * 100);
};

const EnhancedAdminTable = () => {
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
    toast.success(`Pole "${field}" aktualizované na "${value}" pre ${selectedContracts.length} zmlúv`);
    setSelectedContracts([]);
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete contracts:', selectedContracts);
    toast.success(`Vymazaných ${selectedContracts.length} zmlúv`);
    setSelectedContracts([]);
  };

  const handleExportData = () => {
    console.log('Exporting contracts data...');
    toast.success('Export údajov spustený');
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Rozšírená správa zmlúv</CardTitle>
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
          <CardTitle className="text-slate-900">Rozšírená správa zmlúv</CardTitle>
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
        />
      )}
      
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">Rozšírená správa zmlúv</CardTitle>
              <CardDescription className="text-slate-600">
                Pokročilé filtrovanie a správa zmlúv ({filteredContracts?.length || 0} z {contracts?.length || 0})
                <br />
                <span className="inline-flex items-center text-sm text-slate-500 mt-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Kliknite na riadok pre zobrazenie detailov zmluvy
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
                Export
              </Button>
              <Button 
                onClick={() => navigate('/onboarding')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nová zmluva
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
                placeholder="Vyhľadať zmluvu..."
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
                  <SelectValue placeholder="Stav" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Všetky stavy</SelectItem>
                  <SelectItem value="draft">Koncept</SelectItem>
                  <SelectItem value="submitted">Odoslané</SelectItem>
                  <SelectItem value="approved">Schválené</SelectItem>
                  <SelectItem value="rejected">Zamietnuté</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contract Type Filter */}
            <Select value={filters.contractType} onValueChange={(value) => handleFilterChange('contractType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Typ zmluvy" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Všetky typy</SelectItem>
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
                  <SelectValue placeholder="Obchodník" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Všetci obchodníci</SelectItem>
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
                    "Dátumový rozsah"
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
              <h3 className="text-lg font-medium mb-2">Žiadne výsledky</h3>
              <p className="text-center max-w-md">
                Skúste zmeniť kritériá vyhľadávania alebo filtra.
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
                    <TableHead className="font-medium text-slate-700">Číslo zmluvy</TableHead>
                    <TableHead className="font-medium text-slate-700">Klient</TableHead>
                    <TableHead className="font-medium text-slate-700">Typ zmluvy</TableHead>
                    <TableHead className="font-medium text-slate-700">Hodnota/mes.</TableHead>
                    <TableHead className="font-medium text-slate-700">Stav</TableHead>
                    <TableHead className="font-medium text-slate-700">Dokončenosť</TableHead>
                    <TableHead className="font-medium text-slate-700">Obchodník</TableHead>
                    <TableHead className="font-medium text-slate-700">Vytvorené</TableHead>
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
