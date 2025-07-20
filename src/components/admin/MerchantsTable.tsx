
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, Mail, User, Euro, FileText, MapPin, TrendingUp } from "lucide-react";
import { useMerchantsData, Merchant } from "@/hooks/useMerchantsData";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResponsiveDataTable, ResponsiveDataTableColumn } from "@/components/ui/responsive-data-table";
import MerchantCard from "./MerchantCard";

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
  const isMobile = useIsMobile();

  const handleRowClick = (merchant: Merchant) => {
    navigate(`/admin/merchant/${merchant.id}/view`);
  };

  const cities = [
    'Bratislava',
    'Košice', 
    'Prešov',
    'Žilina',
    'Banská Bystrica',
    'Nitra',
    'Trnava',
    'Trenčín'
  ];

  const contractOptions = [
    { value: 'true', label: t('merchants.filters.withContracts') },
    { value: 'false', label: t('merchants.filters.withoutContracts') }
  ];

  const profitRangeOptions = [
    { value: '0-100', label: '€0 - €100' },
    { value: '100-500', label: '€100 - €500' },
    { value: '500-1000', label: '€500 - €1000' },
    { value: '1000+', label: '€1000+' }
  ];

  const columns: ResponsiveDataTableColumn<Merchant>[] = [
    {
      key: 'company',
      header: t('merchants.table.company'),
      accessor: (merchant) => (
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
            <Building2 className="h-3 w-3 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-sm truncate">{merchant.company_name}</p>
            {merchant.address_city && (
              <div className="flex items-center text-xs text-slate-500 mt-0.5">
                <MapPin className="h-2.5 w-2.5 mr-1 flex-shrink-0" />
                <span className="truncate">{merchant.address_city}</span>
              </div>
            )}
          </div>
        </div>
      ),
      filter: {
        type: 'text',
        placeholder: t('merchants.filters.searchPlaceholder')
      }
    },
    {
      key: 'contact',
      header: t('merchants.table.contactPerson'),
      accessor: (merchant) => (
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
            <User className="h-3 w-3 text-slate-600" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900 text-sm truncate">{merchant.contact_person_name}</p>
            <div className="flex items-center text-xs text-slate-500 mt-0.5">
              <Mail className="h-2.5 w-2.5 mr-1 flex-shrink-0" />
              <span className="hover:text-blue-600 transition-colors cursor-pointer truncate">{merchant.contact_person_email}</span>
            </div>
          </div>
        </div>
      ),
      hideOnCompact: true
    },
    {
      key: 'city',
      header: t('merchants.table.city'),
      accessor: (merchant) => (
        <div className="flex items-center space-x-1">
          <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
          <span className="text-slate-700 font-medium text-sm truncate">{merchant.address_city || 'N/A'}</span>
        </div>
      ),
      filter: {
        type: 'select',
        options: cities.map(city => ({ value: city, label: city })),
        placeholder: t('merchants.filters.allCities')
      },
      hideOnSmall: true
    },
    {
      key: 'ico',
      header: t('table.columns.ico'),
      accessor: (merchant) => (
        <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-xs">
          {merchant.ico || 'N/A'}
        </span>
      ),
      className: "text-slate-700",
      hideOnSmall: true
    },
    {
      key: 'contracts',
      header: t('merchants.table.contracts'),
      accessor: (merchant) => (
        <div className="flex items-center space-x-1">
          <div className="p-1 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
            <FileText className="h-2.5 w-2.5 text-blue-600" />
          </div>
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200 font-medium text-xs px-1.5 py-0.5"
          >
            {merchant.contract_count || 0}
          </Badge>
        </div>
      ),
      filter: {
        type: 'select',
        options: contractOptions,
        placeholder: t('merchants.filters.allMerchants')
      }
    },
    {
      key: 'profit',
      header: t('merchants.table.monthlyProfit'),
      accessor: (merchant) => (
        <div className="flex items-center space-x-1">
          <div className="p-1 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200">
            <TrendingUp className="h-2.5 w-2.5 text-emerald-600" />
          </div>
          <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 border border-emerald-200">
            <span className="font-semibold text-emerald-800 text-xs">
              €{(merchant.total_monthly_profit || 0).toFixed(2)}
            </span>
          </div>
        </div>
      ),
      filter: {
        type: 'select',
        options: profitRangeOptions,
        placeholder: t('merchants.filters.allValues')
      }
    },
    {
      key: 'created',
      header: t('merchants.table.created'),
      accessor: (merchant) => (
        <div className="flex items-center space-x-1 text-slate-600">
          <Calendar className="h-3 w-3 text-slate-400 flex-shrink-0" />
          <span className="text-xs font-medium">
            {format(new Date(merchant.created_at), 'dd.MM.yyyy')}
          </span>
        </div>
      ),
      hideOnSmall: true
    }
  ];

  // Mobile Card Layout
  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="px-1">
          <h2 className="text-lg font-bold text-slate-900 mb-2">{t('merchants.table.title')}</h2>
          <p className="text-sm text-slate-600 bg-gradient-to-r from-slate-100 to-blue-100 px-3 py-2 rounded-lg border border-slate-200">
            {t('merchants.table.overview', { count: merchants?.length || 0 })}
          </p>
        </div>
        <div className="space-y-3">
          {merchants?.map((merchant: Merchant) => (
            <MerchantCard
              key={merchant.id}
              merchant={merchant}
              onClick={handleRowClick}
            />
          )) || []}
        </div>
      </div>
    );
  }

  // Desktop Responsive Table Layout
  return (
    <ResponsiveDataTable
      data={merchants || []}
      columns={columns}
      title={t('merchants.table.title')}
      subtitle={t('merchants.table.overview', { count: merchants?.length || 0 })}
      isLoading={isLoading}
      error={error}
      onRowClick={handleRowClick}
      emptyMessage={t('table.emptyMessage')}
      emptyIcon={<Building2 className="h-10 w-10 text-slate-400" />}
    />
  );
};

export default MerchantsTable;
