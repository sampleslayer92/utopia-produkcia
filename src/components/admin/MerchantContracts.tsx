
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Euro, FileText, Smartphone } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

interface Contract {
  id: string;
  contract_number: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  total_monthly_profit: number;
  contract_items_count: number;
}

interface MerchantContractsProps {
  contracts: Contract[];
}

const MerchantContracts = ({ contracts }: MerchantContractsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['admin', 'ui']);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">{t('ui:status.submitted')}</Badge>;
      case 'approved':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{t('ui:status.approved')}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200">{t('ui:status.rejected')}</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">{t('ui:status.draft')}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleRowClick = (contractId: string) => {
    navigate(`/admin/contract/${contractId}/view`);
  };

  if (contracts.length === 0) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {t('merchants.detail.contracts.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-slate-500">
            <FileText className="h-12 w-12 mb-4" />
            <p>{t('merchants.detail.contracts.noContracts')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          {t('merchants.detail.contracts.title')} ({contracts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-medium text-slate-700">{t('merchants.detail.contracts.table.contractNumber')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('merchants.detail.contracts.table.status')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('merchants.detail.contracts.table.devices')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('merchants.detail.contracts.table.monthlyProfit')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('merchants.detail.contracts.table.created')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow 
                  key={contract.id} 
                  className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(contract.id)}
                >
                  <TableCell className="font-medium text-slate-900">
                    #{contract.contract_number}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(contract.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-900">{contract.contract_items_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-emerald-600">
                        €{contract.total_monthly_profit.toFixed(2)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        {format(new Date(contract.created_at), 'dd.MM.yyyy HH:mm')}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MerchantContracts;
