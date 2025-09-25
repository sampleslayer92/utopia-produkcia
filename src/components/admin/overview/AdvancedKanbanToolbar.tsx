import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { LayoutGrid, Table2, Settings, Plus, RotateCcw, Tags, Search, Filter, Calendar, Euro, Building2, Globe } from 'lucide-react';
import { KanbanPreferences } from '@/hooks/useKanbanColumns';
import StatusManagementModal from '../deals/StatusManagementModal';
import FilterPresetDropdown from './FilterPresetDropdown';
import DateRangePicker from './DateRangePicker';
import ValueRangeSlider from './ValueRangeSlider';
import StatusMultiSelect from './StatusMultiSelect';
import MerchantSelect from './MerchantSelect';
import SourceMultiSelect from './SourceMultiSelect';
import { OverviewFilters } from './OverviewKanbanBoard';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from '@/components/ui/separator';

interface AdvancedKanbanToolbarProps {
  preferences: KanbanPreferences;
  onPreferencesChange: (preferences: Partial<KanbanPreferences>) => void;
  onAddColumn?: () => void;
  onResetToDefault?: () => void;
  contractsCount?: number;
  filters: OverviewFilters;
  onFiltersChange: (filters: OverviewFilters) => void;
}

const AdvancedKanbanToolbar = ({ 
  preferences, 
  onPreferencesChange, 
  onAddColumn,
  onResetToDefault,
  contractsCount = 0,
  filters,
  onFiltersChange
}: AdvancedKanbanToolbarProps) => {
  const { t } = useTranslation('admin');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchValue });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const activeFiltersCount = 
    (filters.status.length > 0 ? 1 : 0) +
    (filters.dateRange.from || filters.dateRange.to ? 1 : 0) +
    (filters.valueRange.min !== null || filters.valueRange.max !== null ? 1 : 0) +
    (filters.merchant !== 'all' ? 1 : 0) +
    (filters.source.length > 0 ? 1 : 0) +
    (filters.entityType !== 'both' ? 1 : 0);

  const clearAllFilters = () => {
    onFiltersChange({
      entityType: 'both',
      search: '',
      status: [],
      dateRange: { from: null, to: null },
      valueRange: { min: null, max: null },
      merchant: 'all',
      source: [],
      preset: null
    });
    setSearchValue('');
  };

  return (
    <div className="border-b border-border bg-background/80 backdrop-blur-sm">
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 p-3">
        {/* Top row - View switcher and entity type */}
        <div className="flex items-center justify-between lg:justify-start gap-3 flex-wrap">
          <Tabs 
            value={preferences.viewMode} 
            onValueChange={(value) => onPreferencesChange({ viewMode: value as 'kanban' | 'table' })}
          >
            <TabsList className="grid w-auto grid-cols-2">
              <TabsTrigger value="kanban" className="flex items-center gap-2 px-2 lg:px-3">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">{t('overview.toolbar.kanban')}</span>
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2 px-2 lg:px-3">
                <Table2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t('overview.toolbar.table')}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Entity type filter - responsive sizing */}
          <Tabs 
            value={filters.entityType} 
            onValueChange={(value) => onFiltersChange({ ...filters, entityType: value as 'requests' | 'contracts' | 'both' })}
          >
            <TabsList className="grid w-auto grid-cols-3">
              <TabsTrigger value="both" className="text-xs px-2 lg:px-3">
                {t('overview.entityTypes.both')}
              </TabsTrigger>
              <TabsTrigger value="requests" className="text-xs px-2 lg:px-3">
                {t('overview.entityTypes.requests')}
              </TabsTrigger>
              <TabsTrigger value="contracts" className="text-xs px-2 lg:px-3">
                {t('overview.entityTypes.contracts')}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Badge variant="outline" className="text-xs font-medium">
            {contractsCount} {t('overview.toolbar.itemsCount')}
          </Badge>
        </div>

        {/* Bottom row - Search and Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Responsive Search */}
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('overview.toolbar.searchPlaceholder')}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9 w-full lg:w-64 h-9"
            />
          </div>

          {/* Advanced Filters */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 h-9"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{t('overview.toolbar.filters')}</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 lg:w-96 p-4" align="end" side="bottom" sideOffset={4}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{t('overview.toolbar.advancedFilters')}</h4>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      {t('overview.toolbar.clearAll')}
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tags className="h-4 w-4" />
                    {t('overview.filters.status')}
                  </label>
                  <StatusMultiSelect
                    value={filters.status}
                    onChange={(status) => onFiltersChange({ ...filters, status })}
                  />
                </div>

                {/* Date Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('overview.filters.dateRange')}
                  </label>
                  <DateRangePicker
                    value={filters.dateRange}
                    onChange={(dateRange) => onFiltersChange({ ...filters, dateRange })}
                  />
                </div>

                {/* Value Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    {t('overview.filters.valueRange')}
                  </label>
                  <ValueRangeSlider
                    value={filters.valueRange}
                    onChange={(valueRange) => onFiltersChange({ ...filters, valueRange })}
                  />
                </div>

                {/* Merchant Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {t('overview.filters.merchant')}
                  </label>
                  <MerchantSelect
                    value={filters.merchant}
                    onChange={(merchant) => onFiltersChange({ ...filters, merchant })}
                  />
                </div>

                {/* Source Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {t('overview.filters.source')}
                  </label>
                  <SourceMultiSelect
                    value={filters.source}
                    onChange={(source) => onFiltersChange({ ...filters, source })}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Action buttons with better mobile layout */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Presets */}
            <FilterPresetDropdown
              currentPreset={filters.preset}
              onPresetSelect={(preset) => onFiltersChange({ ...filters, preset })}
            />

            {preferences.viewMode === 'kanban' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAddColumn}
                  className="flex items-center gap-2 h-9"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden lg:inline">{t('overview.toolbar.addColumn')}</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsStatusModalOpen(true)}
                  className="flex items-center gap-2 h-9"
                >
                  <Tags className="h-4 w-4" />
                  <span className="hidden lg:inline">{t('overview.toolbar.statuses')}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResetToDefault}
                  className="flex items-center gap-2 h-9"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden lg:inline">{t('overview.toolbar.reset')}</span>
                </Button>
              </>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 h-9"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden lg:inline">{t('overview.toolbar.settings')}</span>
            </Button>
          </div>
        </div>
      </div>
      
      <StatusManagementModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />
    </div>
  );
};

export default AdvancedKanbanToolbar;