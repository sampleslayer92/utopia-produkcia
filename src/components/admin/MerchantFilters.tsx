import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface MerchantFiltersProps {
  filters: {
    search: string;
    city: string;
    hasContracts: string;
    profitRange: string;
  };
  onFiltersChange: (filters: any) => void;
}

const MerchantFilters = ({ filters, onFiltersChange }: MerchantFiltersProps) => {
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
      city: 'all',
      hasContracts: 'all',
      profitRange: 'all'
    });
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search">{t('merchants.filters.search')}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="search"
                placeholder={t('merchants.filters.searchPlaceholder')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="city">{t('merchants.filters.city')}</Label>
            <Select value={filters.city || 'all'} onValueChange={(value) => handleFilterChange('city', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('merchants.filters.allCities')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('merchants.filters.allCities')}</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="hasContracts">{t('merchants.filters.contracts')}</Label>
            <Select value={filters.hasContracts || 'all'} onValueChange={(value) => handleFilterChange('hasContracts', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('merchants.filters.allMerchants')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('merchants.filters.allMerchants')}</SelectItem>
                <SelectItem value="true">{t('merchants.filters.withContracts')}</SelectItem>
                <SelectItem value="false">{t('merchants.filters.withoutContracts')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="profitRange">{t('merchants.filters.monthlyProfit')}</Label>
            <Select value={filters.profitRange || 'all'} onValueChange={(value) => handleFilterChange('profitRange', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('merchants.filters.allValues')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('merchants.filters.allValues')}</SelectItem>
                <SelectItem value="0-100">€0 - €100</SelectItem>
                <SelectItem value="100-500">€100 - €500</SelectItem>
                <SelectItem value="500-1000">€500 - €1000</SelectItem>
                <SelectItem value="1000+">€1000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

      {(filters.search || filters.city || filters.hasContracts || filters.profitRange) && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={clearFilters} size="sm">
            <X className="h-4 w-4 mr-2" />
            {t('merchants.filters.clearFilters')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MerchantFilters;