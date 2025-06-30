
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import EnhancedContractsTable from "./EnhancedContractsTable";
import MerchantFixButton from "./MerchantFixButton";

interface EnhancedTableContentProps {
  contracts: any[];
  filteredContracts: any[];
  selectedContracts: string[];
  onSelectContract: (contractId: string) => void;
  onSelectAll: () => void;
  onRowClick: (contractId: string) => void;
  contractTypes?: string[];
  salesPersons?: string[];
  contractSources?: string[];
  onFiltersChange: (filters: any) => void;
}

const EnhancedTableContent = ({
  contracts,
  filteredContracts,
  selectedContracts,
  onSelectContract,
  onSelectAll,
  onRowClick,
  contractTypes,
  salesPersons,
  contractSources,
  onFiltersChange
}: EnhancedTableContentProps) => {
  const { t } = useTranslation('admin');

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-900">{t('table.title')}</CardTitle>
            <CardDescription className="text-slate-600">
              {t('table.subtitle', { 
                filtered: filteredContracts?.length || 0, 
                total: contracts?.length || 0 
              })}
              <br />
              <span className="inline-flex items-center text-sm text-slate-500 mt-1">
                <Eye className="h-3 w-3 mr-1" />
                {t('table.clickHint')}
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <MerchantFixButton />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <EnhancedContractsTable
          contracts={filteredContracts || []}
          selectedContracts={selectedContracts}
          onSelectContract={onSelectContract}
          onSelectAll={onSelectAll}
          onRowClick={onRowClick}
          contractTypes={contractTypes}
          salesPersons={salesPersons}
          contractSources={contractSources}
          onFiltersChange={onFiltersChange}
        />
      </CardContent>
    </Card>
  );
};

export default EnhancedTableContent;
