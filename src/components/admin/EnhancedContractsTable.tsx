
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
import { Building, Calendar, Mail, User, Search, Plus } from "lucide-react";
import { useEnhancedContractsData, useContractTypeOptions, useSalesPersonOptions } from "@/hooks/useEnhancedContractsData";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import ContractActionsDropdown from "./ContractActionsDropdown";
import FilterableTableHead from "./contracts-table/FilterableTableHead";
import SelectionCheckbox from "./contracts-table/SelectionCheckbox";
import BulkActionsPanel from "./contracts-table/BulkActionsPanel";
import { useContractSelection } from "@/hooks/useContractSelection";

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

const EnhancedContractsTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [contractTypeFilter, setContractTypeFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [salespersonFilter, setSalespersonFilter] = useState<string>("all");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");

  // Selection state
  const {
    selectedIds,
    isAllSelected,
    selectAll,
    selectNone,
    toggleContract,
    toggleAll,
  } = useContractSelection();

  // Data queries
  const { data: contracts, isLoading, error } = useEnhancedContractsData({
    status: statusFilter,
    contractType: contractTypeFilter,
    client: clientFilter,
    salesperson: salespersonFilter,
    dateFrom: dateFromFilter,
    dateTo: dateToFilter,
    search: searchTerm,
  });

  const { data: contractTypes } = useContractTypeOptions();
  const { data: salesPersons } = useSalesPersonOptions();

  // Get actual selected contracts based on current page
  const actualSelectedIds = contracts ? 
    Array.from(selectedIds).filter(id => contracts.some(c => c.id === id)) : [];
  
  const effectiveSelectedCount = isAllSelected ? (contracts?.length || 0) : actualSelectedIds.length;
  const effectiveSelectedIds = isAllSelected ? (contracts?.map(c => c.id) || []) : actualSelectedIds;

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Správa zmlúv</CardTitle>
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
          <CardTitle className="text-slate-900">Správa zmlúv</CardTitle>
          <CardDescription className="text-red-600">
            Chyba pri načítavaní zmlúv: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">Správa zmlúv</CardTitle>
              <CardDescription className="text-slate-600">
                Pokročilá správa zmlúv s filtrovaním a hromadnými akciami ({contracts?.length || 0} zmlúv)
              </CardDescription>
            </div>
            <Button 
              onClick={() => navigate('/onboarding')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nová zmluva
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Global Search */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Fulltextové vyhľadávanie (číslo, meno, email, spoločnosť)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {contracts && contracts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Building className="h-16 w-16 mb-4 text-slate-300" />
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
                      <SelectionCheckbox
                        checked={isAllSelected || (contracts ? selectedIds.size === contracts.length && contracts.length > 0 : false)}
                        onCheckedChange={() => toggleAll(contracts?.map(c => c.id) || [])}
                      />
                    </TableHead>
                    <TableHead className="font-medium text-slate-700">Číslo zmluvy</TableHead>
                    <TableHead className="font-medium text-slate-700">Kontakt</TableHead>
                    <TableHead className="font-medium text-slate-700">Spoločnosť</TableHead>
                    <FilterableTableHead
                      title="Typ zmluvy"
                      filterType="select"
                      filterValue={contractTypeFilter}
                      onFilterChange={setContractTypeFilter}
                      options={contractTypes?.map(type => ({ value: type, label: type })) || []}
                    />
                    <FilterableTableHead
                      title="Stav"
                      filterType="select"
                      filterValue={statusFilter}
                      onFilterChange={setStatusFilter}
                      options={[
                        { value: 'draft', label: 'Koncept' },
                        { value: 'submitted', label: 'Odoslané' },
                        { value: 'approved', label: 'Schválené' },
                        { value: 'rejected', label: 'Zamietnuté' },
                      ]}
                    />
                    <FilterableTableHead
                      title="Obchodník"
                      filterType="select"
                      filterValue={salespersonFilter}
                      onFilterChange={setSalespersonFilter}
                      options={salesPersons?.map(person => ({ value: person, label: person })) || []}
                    />
                    <FilterableTableHead
                      title="Vytvorené"
                      filterType="date"
                      filterValue={dateFromFilter}
                      onFilterChange={setDateFromFilter}
                    />
                    <TableHead className="font-medium text-slate-700 w-16">Akcie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts?.map((contract) => (
                    <TableRow 
                      key={contract.id} 
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell>
                        <SelectionCheckbox
                          checked={isAllSelected || selectedIds.has(contract.id)}
                          onCheckedChange={() => toggleContract(contract.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        #{contract.contract_number}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-slate-500" />
                          <div>
                            <p className="font-medium text-slate-900">
                              {contract.contact_info 
                                ? `${contract.contact_info.first_name} ${contract.contact_info.last_name}`
                                : 'N/A'
                              }
                            </p>
                            {contract.contact_info?.email && (
                              <p className="text-sm text-slate-600 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {contract.contact_info.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-900">
                            {contract.company_info?.company_name || 'N/A'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {contract.contract_type || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(contract.status)}
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {contract.salesperson || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-slate-600">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {format(new Date(contract.created_at), 'dd.MM.yyyy HH:mm')}
                          </span>
                        </div>
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
      {effectiveSelectedCount > 0 && (
        <BulkActionsPanel
          selectedCount={effectiveSelectedCount}
          selectedIds={effectiveSelectedIds}
          onClose={selectNone}
        />
      )}
    </>
  );
};

export default EnhancedContractsTable;
