import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookmarkPlus, Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterPresetDropdownProps {
  currentPreset: string | null;
  onPresetSelect: (preset: string | null) => void;
}

const FilterPresetDropdown = ({ currentPreset, onPresetSelect }: FilterPresetDropdownProps) => {
  const { t } = useTranslation('admin');
  
  const presets = [
    { 
      id: 'hot_leads', 
      name: t('overview.filters.presets.hotLeads.name'), 
      description: t('overview.filters.presets.hotLeads.description') 
    },
    { 
      id: 'new_requests', 
      name: t('overview.filters.presets.newRequests.name'), 
      description: t('overview.filters.presets.newRequests.description') 
    },
    { 
      id: 'pending_review', 
      name: t('overview.filters.presets.pendingReview.name'), 
      description: t('overview.filters.presets.pendingReview.description') 
    },
    { 
      id: 'this_month', 
      name: t('overview.filters.presets.thisMonth.name'), 
      description: t('overview.filters.presets.thisMonth.description') 
    },
    { 
      id: 'high_value', 
      name: t('overview.filters.presets.highValue.name'), 
      description: t('overview.filters.presets.highValue.description') 
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 h-9"
        >
          <Bookmark className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentPreset ? presets.find(p => p.id === currentPreset)?.name : t('overview.filters.presets.presetsLabel')}
          </span>
          {currentPreset && (
            <Badge variant="secondary" className="ml-1 h-4 px-1">
              1
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2">
          <h4 className="font-medium text-sm mb-2">{t('overview.filters.presets.title')}</h4>
        </div>
        <DropdownMenuSeparator />
        
        {presets.map((preset) => (
          <DropdownMenuItem
            key={preset.id}
            onClick={() => onPresetSelect(preset.id)}
            className={`cursor-pointer ${currentPreset === preset.id ? 'bg-accent' : ''}`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{preset.name}</span>
              <span className="text-xs text-muted-foreground">{preset.description}</span>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onPresetSelect(null)}>
          <BookmarkPlus className="h-4 w-4 mr-2" />
          {t('overview.filters.presets.saveCurrentFilters')}
        </DropdownMenuItem>
        
        {currentPreset && (
          <DropdownMenuItem 
            onClick={() => onPresetSelect(null)}
            className="text-red-600"
          >
            {t('overview.filters.presets.clearPreset')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterPresetDropdown;