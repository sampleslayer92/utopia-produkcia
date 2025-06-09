
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
import { Building, Calendar, Mail, User, Search, Filter, Plus } from "lucide-react";
import { useContractsData, ContractWithInfo } from "@/hooks/useContractsData";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import ContractActionsDropdown from "./ContractActionsDropdown";

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
  const { data: contracts, isLoading, error } = useContractsData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter contracts based on search term and status
  const filteredContracts = contracts?.filter((contract: ContractWithInfo) => {
    const matchesSearch = 
      contract.contract_number.includes(searchTerm) || // Changed from toString() since it's already a string
      contract.contact_info?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contact_info?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contact_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.company_info?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.company_info?.ico?.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-900">Správa zmlúv</CardTitle>
            <CardDescription className="text-slate-600">
              Prehľad všetkých zmlúv v systéme ({filteredContracts.length} z {contracts?.length || 0})
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
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Vyhľadať zmluvu (číslo, meno, email, spoločnosť, IČO)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter stavu" />
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
        </div>

        {filteredContracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Building className="h-16 w-16 mb-4 text-slate-300" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm || statusFilter !== "all" ? "Žiadne výsledky" : "Žiadne zmluvy"}
            </h3>
            <p className="text-center max-w-md">
              {searchTerm || statusFilter !== "all" 
                ? "Skúste zmeniť kritériá vyhľadávania alebo filtra."
                : "Zatiaľ nie sú vytvorené žiadne zmluvy. Vytvorte prvú zmluvu kliknutím na tlačidlo 'Nová zmluva'."
              }
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-medium text-slate-700">Číslo zmluvy</TableHead>
                  <TableHead className="font-medium text-slate-700">Kontakt</TableHead>
                  <TableHead className="font-medium text-slate-700">Spoločnosť</TableHead>
                  <TableHead className="font-medium text-slate-700">IČO</TableHead>
                  <TableHead className="font-medium text-slate-700">Stav</TableHead>
                  <TableHead className="font-medium text-slate-700">Vytvorené</TableHead>
                  <TableHead className="font-medium text-slate-700 w-16">Akcie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.map((contract: ContractWithInfo) => (
                  <TableRow 
                    key={contract.id} 
                    className="hover:bg-slate-50/50 transition-colors"
                  >
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
                      {contract.company_info?.ico || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(contract.status)}
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
                        contractNumber={contract.contract_number} // Already a string
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
  );
};

export default EnhancedContractsTable;
