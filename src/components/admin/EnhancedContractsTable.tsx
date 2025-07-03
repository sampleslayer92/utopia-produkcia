
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useContractsData, ContractWithInfo } from "@/hooks/useContractsData";
import ContractTableContent from "./enhanced-contracts/ContractTableContent";
import ContractTableEmptyState from "./enhanced-contracts/ContractTableEmptyState";
import { useTranslation } from 'react-i18next';

interface EnhancedContractsTableProps {
  filters?: {
    search: string;
    status: string;
    merchant: string;
    source: string;
  };
}

const EnhancedContractsTable = ({ filters }: EnhancedContractsTableProps) => {
  const { data: contracts, isLoading, error } = useContractsData();
  const { t } = useTranslation('ui');
  const searchTerm = filters?.search || "";
  const statusFilter = filters?.status || "all";

  // Filter contracts based on all filters
  const filteredContracts = contracts?.filter((contract: ContractWithInfo) => {
    const matchesSearch = !searchTerm || 
      contract.contract_number.includes(searchTerm) ||
      contract.contact_info?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contact_info?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contact_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.company_info?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.company_info?.ico?.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    
    const matchesMerchant = !filters?.merchant || filters.merchant === "all" || 
      contract.merchant_id === filters.merchant;
      
    const matchesSource = !filters?.source || filters.source === "all" || 
      contract.source === filters.source;

    return matchesSearch && matchesStatus && matchesMerchant && matchesSource;
  }) || [];

  const hasFilters = searchTerm.trim() !== "" || statusFilter !== "all" || 
    (filters?.merchant && filters.merchant !== "all") || 
    (filters?.source && filters.source !== "all");

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">{t('table.contractManagement')}</CardTitle>
          <CardDescription className="text-slate-600">
            {t('table.loadingContracts')}
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
          <CardTitle className="text-slate-900">{t('table.contractManagement')}</CardTitle>
          <CardDescription className="text-red-600">
            {t('table.errorLoadingContracts')}: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div>
          <CardTitle className="text-slate-900">{t('table.contractManagement')}</CardTitle>
          <CardDescription className="text-slate-600">
            {t('table.contractsOverview', { filtered: filteredContracts.length, total: contracts?.length || 0 })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {filteredContracts.length === 0 ? (
          <ContractTableEmptyState hasFilters={hasFilters} />
        ) : (
          <ContractTableContent contracts={filteredContracts} />
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedContractsTable;
