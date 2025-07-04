
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
import { Building, Calendar, Mail, User } from "lucide-react";
import { useContractsData, ContractWithInfo } from "@/hooks/useContractsData";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const ContractsTable = () => {
  const { t } = useTranslation('admin');
  const { data: contracts, isLoading, error } = useContractsData();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'submitted': "bg-blue-100 text-blue-700 border-blue-200",
      'approved': "bg-emerald-100 text-emerald-700 border-emerald-200",
      'rejected': "bg-red-100 text-red-700 border-red-200",
      'draft': "bg-gray-100 text-gray-700 border-gray-200"
    };

    return (
      <Badge className={statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-700 border-gray-200"}>
        {t(`status.${status}`)}
      </Badge>
    );
  };

  const handleRowClick = (contractId: string) => {
    navigate(`/admin/contract/${contractId}/edit`);
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">{t('table.title')}</CardTitle>
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
          <CardTitle className="text-slate-900">{t('table.title')}</CardTitle>
          <CardDescription className="text-red-600">
            {t('table.error', { message: error.message })}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!contracts || contracts.length === 0) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">{t('table.title')}</CardTitle>
          <CardDescription className="text-slate-600">
            {t('table.emptySubtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-slate-500">
            <Building className="h-12 w-12 mb-4" />
            <p>{t('table.emptyMessage')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">{t('table.title')}</CardTitle>
        <CardDescription className="text-slate-600">
          {t('table.subtitle', { count: contracts.length })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-medium text-slate-700">{t('table.columns.contractNumber')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('table.columns.contact')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('table.columns.company')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('table.columns.ico')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('table.columns.status')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('table.columns.created')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract: ContractWithInfo) => (
                <TableRow 
                  key={contract.id} 
                  className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(contract.id)}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractsTable;
