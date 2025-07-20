
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, Table2, Settings, Plus, RotateCcw, Tags, Menu, Filter } from 'lucide-react';
import { KanbanPreferences } from '@/hooks/useKanbanColumns';
import StatusManagementModal from './StatusManagementModal';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CompactKanbanToolbarProps {
  preferences: KanbanPreferences;
  onPreferencesChange: (preferences: Partial<KanbanPreferences>) => void;
  onAddColumn?: () => void;
  onResetToDefault?: () => void;
  contractsCount?: number;
}

const CompactKanbanToolbar = ({ 
  preferences, 
  onPreferencesChange, 
  onAddColumn,
  onResetToDefault,
  contractsCount = 0 
}: CompactKanbanToolbarProps) => {
  const { t } = useTranslation('admin');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-3 py-2">
      {/* Left side - View switcher and count */}
      <div className="flex items-center gap-2">
        <Tabs 
          value={preferences.viewMode} 
          onValueChange={(value) => onPreferencesChange({ viewMode: value as 'kanban' | 'table' })}
        >
          <TabsList className="grid w-auto grid-cols-2 h-8">
            <TabsTrigger value="kanban" className="flex items-center gap-1 text-xs px-2">
              <LayoutGrid className="h-3 w-3" />
              <span className="hidden sm:inline">Kanban</span>
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-1 text-xs px-2">
              <Table2 className="h-3 w-3" />
              <span className="hidden sm:inline">Table</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Badge variant="outline" className="text-xs font-medium h-6">
          {contractsCount}
        </Badge>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-1">
        {preferences.viewMode === 'kanban' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2">
                <Menu className="h-3 w-3" />
                <span className="sr-only">{t('deals.toolbar.actions')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={onAddColumn}>
                <Plus className="h-3 w-3 mr-2" />
                <span className="text-xs">{t('deals.toolbar.addColumn')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsStatusModalOpen(true)}>
                <Tags className="h-3 w-3 mr-2" />
                <span className="text-xs">{t('deals.toolbar.statuses')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onResetToDefault}>
                <RotateCcw className="h-3 w-3 mr-2" />
                <span className="text-xs">{t('deals.toolbar.reset')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Settings className="h-3 w-3" />
          <span className="sr-only">{t('deals.toolbar.settings')}</span>
        </Button>
      </div>
      
      <StatusManagementModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />
    </div>
  );
};

export default CompactKanbanToolbar;
