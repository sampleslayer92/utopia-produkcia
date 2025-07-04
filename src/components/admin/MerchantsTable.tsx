
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Calendar, Mail, User, Euro, FileText } from "lucide-react";
import { useMerchantsData, Merchant } from "@/hooks/useMerchantsData";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface MerchantsTableProps {
  key?: number;
  filters?: {
    search: string;
    city: string;
    hasContracts: string;
    profitRange: string;
  };
}

const MerchantsTable = ({ key, filters }: MerchantsTableProps) => {
  const { t } = useTranslation('admin');
  const { data: merchants, isLoading, error, refetch } = useMerchantsData(filters);
  const navigate = useNavigate();

  const handleRowClick = (merchantId: string) => {
    navigate(`/admin/merchant/${merchantId}/view`);
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">{t('merchants.table.title')}</CardTitle>
          <CardDescription className="text-slate-600">
            {t('table.loading')}
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
          <CardTitle className="text-slate-900">{t('merchants.table.title')}</CardTitle>
          <CardDescription className="text-red-600">
            {t('table.error', { message: error.message })}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!merchants || merchants.length === 0) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">{t('merchants.table.title')}</CardTitle>
          <CardDescription className="text-slate-600">
            {t('table.emptySubtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-slate-500">
            <Building2 className="h-12 w-12 mb-4" />
            <p>{t('table.emptyMessage')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">{t('merchants.table.title')}</CardTitle>
        <CardDescription className="text-slate-600">
          {t('merchants.table.overview', { count: merchants.length })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-medium text-slate-700">{t('merchants.table.company')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('merchants.table.contactPerson')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('table.columns.ico')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('merchants.table.contracts')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('merchants.table.monthlyProfit')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('merchants.table.created')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchants.map((merchant: Merchant) => (
                <TableRow 
                  key={merchant.id} 
                  className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(merchant.id)}
                >
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">{merchant.company_name}</p>
                        {merchant.address_city && (
                          <p className="text-sm text-slate-600">{merchant.address_city}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">{merchant.contact_person_name}</p>
                        <p className="text-sm text-slate-600 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {merchant.contact_person_email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {merchant.ico || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-slate-500" />
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {t('merchants.table.contractsCount', { count: merchant.contract_count || 0 })}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-emerald-600">
                        €{(merchant.total_monthly_profit || 0).toFixed(2)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        {format(new Date(merchant.created_at), 'dd.MM.yyyy')}
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

export default MerchantsTable;
