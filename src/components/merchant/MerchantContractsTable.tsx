
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { MerchantContract } from "@/hooks/useMerchantContracts";

interface MerchantContractsTableProps {
  contracts: MerchantContract[];
}

const MerchantContractsTable = ({ contracts }: MerchantContractsTableProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Návrh", variant: "secondary" as const },
      submitted: { label: "Odoslaný", variant: "default" as const },
      approved: { label: "Schválený", variant: "default" as const },
      rejected: { label: "Zamietnutý", variant: "destructive" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { label: status, variant: "secondary" as const };
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const handleViewContract = (contractId: string) => {
    navigate(`/admin/contract/${contractId}/view`);
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Moje zmluvy
        </CardTitle>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Zatiaľ nemáte žiadne zmluvy</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Číslo zmluvy</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Stav</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Zariadenia</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Mesačný zisk</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Vytvorená</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Akcie</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {contract.contract_number}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(contract.status)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {contract.total_devices}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      €{contract.total_monthly_profit.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {format(new Date(contract.created_at), 'dd.MM.yyyy')}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewContract(contract.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Zobraziť
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MerchantContractsTable;
