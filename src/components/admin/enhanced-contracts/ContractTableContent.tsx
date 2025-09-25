
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
import { format } from "date-fns";
import { useContractBadges } from "../table/ContractBadges";
import { EnhancedContractData } from "@/hooks/useEnhancedContractsData";
import { BulkSelectionState } from "@/hooks/useGenericBulkSelection";

interface ContractTableContentProps {
  contracts: EnhancedContractData[];
  bulkSelection: BulkSelectionState<EnhancedContractData>;
}

const ContractTableContent = ({ contracts, bulkSelection }: ContractTableContentProps) => {
  const { t } = useTranslation('admin');
  const { getStatusBadge, getSourceBadge } = useContractBadges();

  return (
    <div className="w-full">
      {/* Mobile card layout for small screens */}
      <div className="block lg:hidden">
        <div className="space-y-3">
          {contracts.map((contract) => (
            <div 
              key={contract.id}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              data-contract-id={contract.id}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={bulkSelection.isItemSelected(contract.id)}
                    onChange={() => bulkSelection.selectItem(contract.id)}
                    className="rounded border-slate-300"
                  />
                  <span className="font-medium text-slate-900">#{contract.contract_number}</span>
                </div>
                {getStatusBadge(contract.status, contract.current_step)}
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-slate-900">{contract.clientName}</p>
                  {contract.contact_info?.email && (
                    <p className="text-sm text-slate-600">{contract.contact_info.email}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {getSourceBadge(contract.source)}
                  <Badge variant="outline" className="text-slate-700">
                    {contract.contractType}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900">€{contract.contractValue.toFixed(2)}</span>
                  <span className="text-slate-600">{contract.completedSteps}/7 krokov</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>{contract.salesPerson}</span>
                  <span>{format(new Date(contract.created_at), 'dd.MM.yyyy')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop table layout */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-12 sticky left-0 bg-slate-50 z-10">
                <input
                  type="checkbox"
                  checked={bulkSelection.isAllSelected}
                  onChange={() => bulkSelection.selectAll(contracts)}
                  className="rounded border-slate-300"
                />
              </TableHead>
              <TableHead className="font-medium text-slate-700 min-w-[120px]">{t('table.columns.contractNumber')}</TableHead>
              <TableHead className="font-medium text-slate-700 min-w-[200px]">{t('table.columns.client')}</TableHead>
              <TableHead className="font-medium text-slate-700 min-w-[100px]">{t('table.columns.source')}</TableHead>
              <TableHead className="font-medium text-slate-700 min-w-[120px]">{t('table.columns.contractType')}</TableHead>
              <TableHead className="font-medium text-slate-700 min-w-[120px]">{t('table.columns.monthlyValue')}</TableHead>
              <TableHead className="font-medium text-slate-700 min-w-[120px]">{t('table.columns.status')}</TableHead>
              <TableHead className="font-medium text-slate-700 min-w-[100px]">{t('table.columns.completion')}</TableHead>
              <TableHead className="font-medium text-slate-700 min-w-[150px]">{t('table.columns.salesPerson')}</TableHead>
              <TableHead className="font-medium text-slate-700 min-w-[140px]">{t('table.columns.created')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow 
                key={contract.id} 
                className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                data-contract-id={contract.id}
              >
                <TableCell onClick={(e) => e.stopPropagation()} className="sticky left-0 bg-white z-10">
                  <input
                    type="checkbox"
                    checked={bulkSelection.isItemSelected(contract.id)}
                    onChange={() => bulkSelection.selectItem(contract.id)}
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
    </div>
  );
};

export default ContractTableContent;
