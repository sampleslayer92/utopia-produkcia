
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Users } from "lucide-react";
import { useEnhancedContractsData } from "@/hooks/useEnhancedContractsData";
import ContractTableContent from "./enhanced-contracts/ContractTableContent";
import { useGenericBulkSelection } from "@/hooks/useGenericBulkSelection";

interface EnhancedContractsTableProps {
  filters?: {
    status?: string;
    merchant?: string;
    source?: string;
    search?: string;
  };
}

const EnhancedContractsTable = ({ filters }: EnhancedContractsTableProps) => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  
  // Convert filters to match the hook's expected format
  const enhancedFilters = filters ? {
    status: filters.status !== 'all' ? filters.status : undefined,
    source: filters.source !== 'all' ? filters.source : undefined,
    search: filters.search || undefined,
    contractType: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    salesPerson: undefined
  } : undefined;

  const { data: contracts = [], isLoading, error } = useEnhancedContractsData(enhancedFilters);
  
  const bulkSelection = useGenericBulkSelection(contracts);

  const handleRowClick = (contractId: string) => {
    navigate(`/admin/contracts/${contractId}`);
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>{t('table.error')}: {error.message}</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">{t('table.loading')}</p>
        </div>
      </Card>
    );
  }

  if (contracts.length === 0) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-slate-500">
          <Users className="h-16 w-16 mb-4 text-slate-300" />
          <h3 className="text-lg font-medium mb-2">{t('table.noResults.title')}</h3>
          <p className="text-center max-w-md text-muted-foreground">
            {t('table.noResults.subtitle')}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk actions bar */}
      {bulkSelection.selectedItems.length > 0 && (
        <Card className="p-4 border-blue-200 bg-blue-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">
                {bulkSelection.selectedItems.length} {t('table.selectedContracts')}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                {t('table.bulkActions.view')}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => bulkSelection.clearSelection()}
              >
                {t('table.bulkActions.clear')}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Contracts table */}
      <Card>
        <div className="overflow-x-auto">
          <div 
            className="cursor-pointer" 
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (!target.closest('input') && !target.closest('button')) {
                const row = target.closest('tr');
                if (row) {
                  const contractId = row.getAttribute('data-contract-id');
                  if (contractId) {
                    handleRowClick(contractId);
                  }
                }
              }
            }}
          >
            <ContractTableContent 
              contracts={contracts}
              bulkSelection={bulkSelection}
            />
          </div>
        </div>
      </Card>

      {/* Summary info */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <p>
          {t('table.summary.showing', { 
            count: contracts.length,
            total: contracts.length 
          })}
        </p>
        <p>
          {t('table.summary.totalValue')}: €{contracts.reduce((sum, c) => sum + c.contractValue, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default EnhancedContractsTable;
