import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useMerchantsData } from "@/hooks/useMerchantsData";
import { useTranslation } from 'react-i18next';

interface ContractFiltersProps {
  filters: {
    search: string;
    status: string;
    merchant: string;
    source: string;
  };
  onFiltersChange: (filters: any) => void;
}

const ContractFilters = ({ filters, onFiltersChange }: ContractFiltersProps) => {
  const { data: merchants } = useMerchantsData();
  const { t } = useTranslation(['admin', 'ui']);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? '' : value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      merchant: 'all',
      source: 'all'
    });
  };

  const statusOptions = [
    { value: 'draft', label: 'Koncept' },
    { value: 'submitted', label: 'Odoslané' },
    { value: 'approved', label: 'Schválené' },
    { value: 'rejected', label: 'Zamietnuté' },
    { value: 'in_progress', label: 'Rozpracované' },
    { value: 'sent_to_client', label: 'Odoslané klientovi' },
    { value: 'signed', label: 'Podpísané' },
    { value: 'lost', label: 'Stratené' }
  ];

  const sourceOptions = [
    { value: 'web', label: 'Web' },
    { value: 'partner', label: 'Partner' },
    { value: 'direct', label: 'Priamy kontakt' },
    { value: 'referral', label: 'Odporúčanie' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search">{t('contracts.filters.search')}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="search"
                placeholder={t('contracts.filters.searchPlaceholder')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="merchant">{t('contracts.filters.merchant')}</Label>
            <Select value={filters.merchant || 'all'} onValueChange={(value) => handleFilterChange('merchant', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('contracts.filters.allMerchants')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('contracts.filters.allMerchants')}</SelectItem>
                {merchants?.map((merchant) => (
                  <SelectItem key={merchant.id} value={merchant.id}>
                    {merchant.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">{t('contracts.filters.status')}</Label>
            <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('contracts.filters.allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('contracts.filters.allStatuses')}</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="source">{t('contracts.filters.source')}</Label>
            <Select value={filters.source || 'all'} onValueChange={(value) => handleFilterChange('source', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('contracts.filters.allSources')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('contracts.filters.allSources')}</SelectItem>
                {sourceOptions.map((source) => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

      {(filters.search || filters.status || filters.merchant || filters.source) && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={clearFilters} size="sm">
            <X className="h-4 w-4 mr-2" />
            {t('contracts.filters.clearFilters')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContractFilters;