
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users } from "lucide-react";
import { format } from "date-fns";
import { useContractBadges } from "./ContractBadges";

interface ContractsTableProps {
  contracts: any[];
  selectedContracts: string[];
  onSelectContract: (contractId: string) => void;
  onSelectAll: () => void;
  onRowClick: (contractId: string) => void;
}

const ContractsTable = ({
  contracts,
  selectedContracts,
  onSelectContract,
  onSelectAll,
  onRowClick
}: ContractsTableProps) => {
  const { t } = useTranslation('admin');
  const { getStatusBadge, getSourceBadge } = useContractBadges();

  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <Users className="h-16 w-16 mb-4 text-slate-300" />
        <h3 className="text-lg font-medium mb-2">{t('table.noResults.title')}</h3>
        <p className="text-center max-w-md">
          {t('table.noResults.subtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={selectedContracts.length === contracts.length && contracts.length > 0}
                onChange={onSelectAll}
                className="rounded border-slate-300"
              />
            </TableHead>
            <TableHead className="font-medium text-slate-700">{t('table.columns.contractNumber')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('table.columns.client')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('table.columns.source')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('table.columns.contractType')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('table.columns.monthlyValue')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('table.columns.status')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('table.columns.completion')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('table.columns.salesPerson')}</TableHead>
            <TableHead className="font-medium text-slate-700">{t('table.columns.created')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow 
              key={contract.id} 
              className="hover:bg-slate-50/80 transition-colors cursor-pointer"
              onClick={() => onRowClick(contract.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedContracts.includes(contract.id)}
                  onChange={() => onSelectContract(contract.id)}
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
                {getSourceBadge(contract.source)}
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
                {getStatusBadge(contract.status, contract.current_step)}
              </TableCell>
              <TableCell>
                <div className="text-sm text-slate-600">
                  {contract.completedSteps}/7 krokov
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
  );
};

export default ContractsTable;
