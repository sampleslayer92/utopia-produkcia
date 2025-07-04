import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface OrganizationFiltersProps {
  filters: {
    search: string;
    status: string;
  };
  onFiltersChange: (filters: any) => void;
}

const OrganizationFilters = ({ filters, onFiltersChange }: OrganizationFiltersProps) => {
  const { t } = useTranslation('admin');

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="search">{t('organizations.filters.search')}</Label>
        <Input
          id="search"
          placeholder={t('organizations.filters.searchPlaceholder')}
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">{t('organizations.filters.status')}</Label>
        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('organizations.filters.selectStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('organizations.filters.allStatuses')}</SelectItem>
            <SelectItem value="active">{t('common:status.active')}</SelectItem>
            <SelectItem value="inactive">{t('common:status.inactive')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="w-full md:w-auto"
        >
          <X className="h-4 w-4 mr-2" />
          {t('common:buttons.clearFilters')}
        </Button>
      </div>
    </div>
  );
};

export default OrganizationFilters;