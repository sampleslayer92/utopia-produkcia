
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building, Calendar, Mail, User } from "lucide-react";
import { format } from "date-fns";
import { ContractWithInfo } from "@/hooks/useContractsData";
import ContractActionsDropdown from "../ContractActionsDropdown";
import ContractStatusBadge from "./ContractStatusBadge";

interface ContractTableContentProps {
  contracts: ContractWithInfo[];
}

const ContractTableContent = ({ contracts }: ContractTableContentProps) => {
  return (
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
          {contracts.map((contract: ContractWithInfo) => (
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
                <ContractStatusBadge status={contract.status} />
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
