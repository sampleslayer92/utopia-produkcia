import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useOrganizations } from '@/hooks/useOrganizations';

interface TeamFiltersProps {
  filters: {
    search: string;
    status: string;
    organization: string;
  };
  onFiltersChange: (filters: any) => void;
}

const TeamFilters = ({ filters, onFiltersChange }: TeamFiltersProps) => {
  const { t } = useTranslation('admin');
  const { data: organizations } = useOrganizations();

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      organization: 'all'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="search">{t('teams.filters.search')}</Label>
        <Input
          id="search"
          placeholder={t('teams.filters.searchPlaceholder')}
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization">{t('teams.filters.organization')}</Label>
        <Select value={filters.organization} onValueChange={(value) => handleFilterChange('organization', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('teams.filters.selectOrganization')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('teams.filters.allOrganizations')}</SelectItem>
            {organizations?.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">{t('teams.filters.status')}</Label>
        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('teams.filters.selectStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('teams.filters.allStatuses')}</SelectItem>
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

export default TeamFilters;