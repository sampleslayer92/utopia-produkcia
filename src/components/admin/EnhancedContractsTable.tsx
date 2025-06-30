
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useContractsData, ContractWithInfo } from "@/hooks/useContractsData";
import ContractTableFilters from "./enhanced-contracts/ContractTableFilters";
import ContractTableContent from "./enhanced-contracts/ContractTableContent";
import ContractTableEmptyState from "./enhanced-contracts/ContractTableEmptyState";

const EnhancedContractsTable = () => {
  const { data: contracts, isLoading, error } = useContractsData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter contracts based on search term and status
  const filteredContracts = contracts?.filter((contract: ContractWithInfo) => {
    const matchesSearch = 
      contract.contract_number.includes(searchTerm) ||
      contract.contact_info?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contact_info?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contact_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.company_info?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.company_info?.ico?.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  const hasFilters = searchTerm || statusFilter !== "all";

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
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div>
          <CardTitle className="text-slate-900">Správa zmlúv</CardTitle>
          <CardDescription className="text-slate-600">
            Prehľad všetkých zmlúv v systéme ({filteredContracts.length} z {contracts?.length || 0})
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ContractTableFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />

        {filteredContracts.length === 0 ? (
          <ContractTableEmptyState hasFilters={hasFilters} />
        ) : (
          <ContractTableContent contracts={filteredContracts} />
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedContractsTable;
