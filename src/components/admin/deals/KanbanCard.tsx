
import { useDraggable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Building2, Euro, Eye } from 'lucide-react';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface KanbanCardProps {
  contract: EnhancedContractData;
  isDragging?: boolean;
  isMobile?: boolean;
}

const KanbanCard = ({ contract, isDragging = false, isMobile = false }: KanbanCardProps) => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isDraggingFromKit,
  } = useDraggable({
    id: contract.id,
    disabled: false, // Enable drag on all devices including mobile
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000,
  } : undefined;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-muted text-muted-foreground border-border';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'sent_to_client':
      case 'email_viewed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'contract_generated':
      case 'waiting_for_signature':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      case 'signed':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'lost':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleViewContract = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/admin/contract/${contract.id}/view`);
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`
        kanban-card
        ${isMobile ? 'p-4' : 'p-3'} 
        cursor-grab active:cursor-grabbing
        bg-kanban-card border-border/50
        hover:shadow-lg hover:shadow-kanban-card-shadow/20 
        transition-all duration-200 ease-out
        ${isDragging || isDraggingFromKit ? 'opacity-80 shadow-xl shadow-kanban-drag-shadow/30 scale-105 rotate-1' : 'hover:scale-[1.02]'}
        ${isMobile ? 'min-h-touch' : ''}
        rounded-lg group
        ${isDragging ? 'animate-kanban-drag' : ''}
        will-change-transform
      `}
      {...listeners}
      {...attributes}
    >
      <div className={`space-y-${isMobile ? '4' : '3'}`}>
        {/* Drag handle indicator */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex flex-col space-y-1">
            <div className="w-1 h-1 bg-muted-foreground/40 rounded-full"></div>
            <div className="w-1 h-1 bg-muted-foreground/40 rounded-full"></div>
            <div className="w-1 h-1 bg-muted-foreground/40 rounded-full"></div>
          </div>
        </div>

        {/* Header with contract number and status */}
        <div className="flex items-center justify-between mb-1">
          <div className={`font-semibold ${isMobile ? 'text-base' : 'text-sm'} text-foreground truncate pr-6`}>
            {contract.contract_number}
          </div>
          <Badge 
            variant="outline" 
            className={`${isMobile ? 'text-xs' : 'text-xs'} ${getStatusBadgeColor(contract.status)} font-medium flex-shrink-0`}
          >
            {t(`status.${contract.status}`)}
          </Badge>
        </div>

        {/* Client info */}
        <div className="space-y-2 mb-3">
          <div className={`flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-sm'} text-foreground`}>
            <Building2 className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'} text-muted-foreground flex-shrink-0`} />
            <span className="truncate font-medium">{contract.clientName}</span>
          </div>
          
          {contract.contact_info?.email && (
            <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground`}>
              <User className={`${isMobile ? 'h-3 w-3' : 'h-3 w-3'} flex-shrink-0`} />
              <span className="truncate">{contract.contact_info.email}</span>
            </div>
          )}
        </div>

        {/* Contract details */}
        <div className={`flex items-center justify-between ${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground mb-3`}>
          <div className="flex items-center gap-1">
            <Calendar className={`${isMobile ? 'h-3 w-3' : 'h-3 w-3'} flex-shrink-0`} />
            <span className="text-xs">{new Date(contract.created_at).toLocaleDateString('sk-SK')}</span>
          </div>
          
          {contract.contractValue > 0 && (
            <div className="flex items-center gap-1">
              <Euro className={`${isMobile ? 'h-3 w-3' : 'h-3 w-3'} flex-shrink-0`} />
              <span className="font-semibold text-foreground text-xs">{contract.contractValue.toFixed(0)}€</span>
            </div>
          )}
        </div>

        {/* Contract type */}
        <div className="mb-3">
          <Badge variant="secondary" className="bg-muted/50 text-muted-foreground text-xs px-2 py-1">
            {contract.contractType}
          </Badge>
        </div>

        {/* Action button - always show but style differently */}
        <div className="pt-2 border-t border-border/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewContract}
            className={`w-full ${isMobile ? 'h-10 text-xs' : 'h-7 text-xs'} hover:bg-accent/50 transition-colors group-hover:bg-accent/80`}
          >
            <Eye className={`${isMobile ? 'h-4 w-4' : 'h-3 w-3'} mr-1`} />
            <span className={isMobile ? 'text-xs' : 'text-xs'}>{t('deals.kanban.card.viewDetail')}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default KanbanCard;
