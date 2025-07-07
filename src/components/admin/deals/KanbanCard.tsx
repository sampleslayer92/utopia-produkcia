
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
  } = useDraggable({
    id: contract.id,
    disabled: isMobile, // Disable drag on mobile
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sent_to_client':
      case 'email_viewed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'contract_generated':
      case 'waiting_for_signature':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'signed':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'lost':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      className={`${isMobile ? 'p-4' : 'p-3'} ${
        isMobile ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      } hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50 rotate-3 shadow-lg' : ''
      }`}
      onClick={isMobile ? handleViewContract : undefined}
      {...(isMobile ? {} : listeners)}
      {...(isMobile ? {} : attributes)}
    >
      <div className={`space-y-${isMobile ? '4' : '3'}`}>
        {/* Header with contract number and status */}
        <div className="flex items-center justify-between">
          <div className={`font-medium ${isMobile ? 'text-base' : 'text-sm'} text-gray-900`}>
            {contract.contract_number}
          </div>
          <Badge 
            variant="outline" 
            className={`${isMobile ? 'text-sm' : 'text-xs'} ${getStatusBadgeColor(contract.status)}`}
          >
            {t(`status.${contract.status}`)}
          </Badge>
        </div>

        {/* Client info */}
        <div className="space-y-2">
          <div className={`flex items-center gap-2 ${isMobile ? 'text-base' : 'text-sm'} text-gray-600`}>
            <Building2 className={`${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
            <span className="truncate font-medium">{contract.clientName}</span>
          </div>
          
          {contract.contact_info?.email && (
            <div className={`flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-sm'} text-gray-600`}>
              <User className={`${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
              <span className="truncate">{contract.contact_info.email}</span>
            </div>
          )}
        </div>

        {/* Contract details */}
        <div className={`flex items-center justify-between ${isMobile ? 'text-sm' : 'text-xs'} text-gray-500`}>
          <div className="flex items-center gap-1">
            <Calendar className={`${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
            <span>{new Date(contract.created_at).toLocaleDateString('sk-SK')}</span>
          </div>
          
          {contract.contractValue > 0 && (
            <div className="flex items-center gap-1">
              <Euro className={`${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
              <span className="font-medium">{contract.contractValue.toFixed(0)}€</span>
            </div>
          )}
        </div>

        {/* Contract type */}
        <div className={isMobile ? 'text-sm' : 'text-xs'}>
          <Badge variant="secondary" className="bg-gray-50 text-gray-600">
            {contract.contractType}
          </Badge>
        </div>

        {/* Action button - only show on desktop in mobile mode */}
        {!isMobile && (
          <div className="pt-2 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewContract}
              className="w-full h-7 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Zobraziť detail
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default KanbanCard;
