import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MoreHorizontal, ChevronLeft, ChevronRight, Euro, Users, Plus } from 'lucide-react';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';
import { KanbanColumn } from '@/hooks/useKanbanColumns';
import PipedriveKanbanCard from './PipedriveKanbanCard';
import EditableKanbanColumnHeader from '../deals/EditableKanbanColumnHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from 'react-i18next';

interface PipedriveKanbanColumnProps {
  id: string;
  column: KanbanColumn;
  contracts: EnhancedContractData[];
  isDropTarget?: boolean;
  onUpdateColumn: (columnId: string, updates: Partial<KanbanColumn>) => Promise<any>;
  stats: { count: number; totalValue: number };
  width: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
  style?: React.CSSProperties;
}

const PipedriveKanbanColumn = ({ 
  id, 
  column, 
  contracts, 
  isDropTarget = false, 
  onUpdateColumn,
  stats,
  width,
  isCollapsed,
  onToggleCollapse,
  isMobile,
  style
}: PipedriveKanbanColumnProps) => {
  const { t } = useTranslation('admin');
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  if (isCollapsed) {
    return (
      <Card 
        ref={setNodeRef}
        className={`
          flex-shrink-0 bg-slate-50/50 border-slate-200/60 transition-all duration-300
          ${isDropTarget || isOver ? 'ring-2 ring-blue-300 shadow-lg' : ''}
        `}
        style={{ ...style, width: '60px' }}
      >
        <CardContent className="p-2 h-full">
          <div className="flex flex-col items-center h-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="p-1 mb-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <div className="writing-mode-vertical-rl text-orientation-mixed text-sm font-medium text-slate-700 flex-1 flex items-center">
              {column.title}
            </div>
            
            <Badge variant="secondary" className="text-xs mt-2">
              {stats.count}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      ref={setNodeRef}
      className={`
        flex-shrink-0 bg-white border-slate-200/60 transition-all duration-300
        ${isDropTarget || isOver ? 'ring-2 ring-blue-300 shadow-lg bg-blue-50/30' : ''}
        ${isMobile ? 'mb-4' : ''}
      `}
      style={{ ...style, width }}
    >
      <CardHeader className="pb-3 pt-3 px-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="p-1 h-6 w-6"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
            )}
            
            <EditableKanbanColumnHeader
              column={column}
              onUpdate={onUpdateColumn}
              count={stats.count}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Plus className="h-3 w-3 mr-2" />
                {t('overview.column.actions.addDeal')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {t('overview.column.actions.sortByValue')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('overview.column.actions.sortByDate')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                {t('overview.column.actions.deleteColumn')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Column statistics */}
        <div className="flex items-center gap-4 text-xs text-slate-600 pt-2">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{stats.count} {t('overview.column.stats.deals')}</span>
          </div>
          {stats.totalValue > 0 && (
            <div className="flex items-center gap-1">
              <Euro className="h-3 w-3" />
              <span>€{stats.totalValue.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Progress bar showing column completion */}
        <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
          <div 
            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min(100, (stats.count / Math.max(1, contracts.length)) * 100)}%` 
            }}
          />
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <ScrollArea className={`${isMobile ? 'h-auto' : 'h-[calc(100vh-280px)]'} px-3 pb-3`}>
          <div className="space-y-3 min-h-[100px]">
            {contracts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 mb-2">{t('overview.column.emptyState.noDeals')}</p>
                <Button variant="ghost" size="sm" className="text-xs">
                  {t('overview.column.emptyState.addDeal')}
                </Button>
              </div>
            ) : (
              contracts.map((contract) => (
                <PipedriveKanbanCard
                  key={contract.id}
                  contract={contract}
                  isMobile={isMobile}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PipedriveKanbanColumn;