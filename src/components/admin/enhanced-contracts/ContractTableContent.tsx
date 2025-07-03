
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, User, Mail, Building } from "lucide-react";
import { format } from "date-fns";
import { ContractWithInfo } from "@/hooks/useContractsData";
import ContractActionsDropdown from "../ContractActionsDropdown";
import ContractStatusBadge from "./ContractStatusBadge";
import CompletionBadge from "./CompletionBadge";
import MonthlyValueDisplay from "./MonthlyValueDisplay";
import SourceBadge from "./SourceBadge";
import ContractTypeBadge from "./ContractTypeBadge";
import { useTranslation } from 'react-i18next';

interface ContractTableContentProps {
  contracts: ContractWithInfo[];
}

const ContractTableContent = ({ contracts }: ContractTableContentProps) => {
  const { t } = useTranslation('admin');
  
  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-medium text-slate-700">{t('contracts.table.contractNumber')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('contracts.table.client')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('contracts.table.source')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('contracts.table.contractType')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('contracts.table.monthlyValue')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('contracts.table.status')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('contracts.table.completion')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('contracts.table.salesPerson')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('contracts.table.created')}</TableHead>
            <TableHead className="font-medium text-slate-700 w-16">{t('contracts.table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract: ContractWithInfo) => (
            <TableRow 
              key={contract.id} 
              className="hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="font-medium text-slate-900">
                #{contract.contract_number}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-slate-900">
                    {contract.client_name}
                  </p>
                  {contract.contact_info?.email && (
                    <p className="text-sm text-slate-600 flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {contract.contact_info.email}
                    </p>
                  )}
                  {contract.company_info?.ico && (
                    <p className="text-xs text-slate-500">
                      {t('form.labels.ico', { ns: 'ui' })}: {contract.company_info.ico}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <SourceBadge source={contract.source} />
              </TableCell>
              <TableCell>
                <ContractTypeBadge type={contract.contract_type} />
              </TableCell>
              <TableCell>
                <MonthlyValueDisplay value={contract.monthly_value} />
              </TableCell>
              <TableCell>
                <ContractStatusBadge status={contract.status} />
              </TableCell>
              <TableCell>
                <CompletionBadge 
                  percentage={contract.completion_percentage} 
                  currentStep={contract.current_step} 
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-700">
                    {contract.sales_person}
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
  );
};

export default ContractTableContent;
