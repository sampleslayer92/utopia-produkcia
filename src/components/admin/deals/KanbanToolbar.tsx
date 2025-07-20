
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, Table2, Settings, Plus, RotateCcw, Tags, Menu } from 'lucide-react';
import { KanbanPreferences } from '@/hooks/useKanbanColumns';
import { useViewport } from '@/hooks/useViewport';
import StatusManagementModal from './StatusManagementModal';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KanbanToolbarProps {
  preferences: KanbanPreferences;
  onPreferencesChange: (preferences: Partial<KanbanPreferences>) => void;
  onAddColumn?: () => void;
  onResetToDefault?: () => void;
  contractsCount?: number;
}

const KanbanToolbar = ({ 
  preferences, 
  onPreferencesChange, 
  onAddColumn,
  onResetToDefault,
  contractsCount = 0 
}: KanbanToolbarProps) => {
  const { t } = useTranslation('admin');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const viewport = useViewport();

  return (
    <div className={`
      flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm
      ${viewport.isMobile ? 'p-2' : 'p-4'}
    `}>
      {/* Left side - View switcher and info */}
      <div className="flex items-center gap-2 md:gap-4">
        <Tabs 
          value={preferences.viewMode} 
          onValueChange={(value) => onPreferencesChange({ viewMode: value as 'kanban' | 'table' })}
        >
          <TabsList className="grid w-auto grid-cols-2">
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              {!viewport.isMobile && <span>{t('deals.toolbar.kanban')}</span>}
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table2 className="h-4 w-4" />
              {!viewport.isMobile && <span>{t('deals.toolbar.table')}</span>}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Badge 
          variant="outline" 
          className={`font-medium ${viewport.isMobile ? 'text-xs' : 'text-xs'}`}
        >
          {contractsCount} {viewport.isMobile ? '' : t('deals.toolbar.dealsCount')}
        </Badge>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        {preferences.viewMode === 'kanban' && !viewport.isMobile && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddColumn}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t('deals.toolbar.addColumn')}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStatusModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Tags className="h-4 w-4" />
              <span className="hidden sm:inline">{t('deals.toolbar.statuses')}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetToDefault}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">{t('deals.toolbar.reset')}</span>
            </Button>
          </>
        )}

        {/* Mobile Menu */}
        {viewport.isMobile && preferences.viewMode === 'kanban' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onAddColumn}>
                <Plus className="h-4 w-4 mr-2" />
                {t('deals.toolbar.addColumn')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsStatusModalOpen(true)}>
                <Tags className="h-4 w-4 mr-2" />
                {t('deals.toolbar.statuses')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onResetToDefault}>
                <RotateCcw className="h-4 w-4 mr-2" />
                {t('deals.toolbar.reset')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          {!viewport.isMobile && <span className="hidden sm:inline">{t('deals.toolbar.settings')}</span>}
        </Button>
      </div>
      
      <StatusManagementModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />
    </div>
  );
};

export default KanbanToolbar;
