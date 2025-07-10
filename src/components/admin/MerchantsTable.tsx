
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, Mail, User, Euro, FileText } from "lucide-react";
import { useMerchantsData, Merchant } from "@/hooks/useMerchantsData";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { DataTable, DataTableColumn } from "@/components/ui/data-table";
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

  const columns: DataTableColumn<Merchant>[] = [
    {
      key: 'company',
      header: t('merchants.table.company'),
      accessor: (merchant) => (
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-slate-500" />
          <div>
            <p className="font-medium text-slate-900">{merchant.company_name}</p>
            {merchant.address_city && (
              <p className="text-sm text-slate-600">{merchant.address_city}</p>
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
          <User className="h-4 w-4 text-slate-500" />
          <div>
            <p className="font-medium text-slate-900">{merchant.contact_person_name}</p>
            <p className="text-sm text-slate-600 flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {merchant.contact_person_email}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'city',
      header: t('merchants.table.city'),
      accessor: (merchant) => merchant.address_city || 'N/A',
      filter: {
        type: 'select',
        options: cities.map(city => ({ value: city, label: city })),
        placeholder: t('merchants.filters.allCities')
      }
    },
    {
      key: 'ico',
      header: t('table.columns.ico'),
      accessor: (merchant) => merchant.ico || 'N/A',
      className: "text-slate-700"
    },
    {
      key: 'contracts',
      header: t('merchants.table.contracts'),
      accessor: (merchant) => (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-slate-500" />
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {t('merchants.table.contractsCount', { count: merchant.contract_count || 0 })}
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
        <div className="flex items-center space-x-2">
          <Euro className="h-4 w-4 text-emerald-600" />
          <span className="font-medium text-emerald-600">
            €{(merchant.total_monthly_profit || 0).toFixed(2)}
          </span>
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
        <div className="flex items-center space-x-2 text-slate-600">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            {format(new Date(merchant.created_at), 'dd.MM.yyyy')}
          </span>
        </div>
      )
    }
  ];

  // Mobile Card Layout
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="px-1">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">{t('merchants.table.title')}</h2>
          <p className="text-sm text-slate-600">
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

  // Desktop Table Layout
  return (
    <DataTable
      data={merchants || []}
      columns={columns}
      title={t('merchants.table.title')}
      subtitle={t('merchants.table.overview', { count: merchants?.length || 0 })}
      isLoading={isLoading}
      error={error}
      onRowClick={handleRowClick}
      emptyMessage={t('table.emptyMessage')}
      emptyIcon={<Building2 className="h-12 w-12 mb-4" />}
    />
  );
};

export default MerchantsTable;
