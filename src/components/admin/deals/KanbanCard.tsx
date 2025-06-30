
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
}

const KanbanCard = ({ contract, isDragging = false }: KanbanCardProps) => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: contract.id,
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
      className={`p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50 rotate-3 shadow-lg' : ''
      }`}
      {...listeners}
      {...attributes}
    >
      <div className="space-y-3">
        {/* Header with contract number and status */}
        <div className="flex items-center justify-between">
          <div className="font-medium text-sm text-gray-900">
            {contract.contract_number}
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs ${getStatusBadgeColor(contract.status)}`}
          >
            {t(`status.${contract.status}`)}
          </Badge>
        </div>

        {/* Client info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="h-3 w-3" />
            <span className="truncate">{contract.clientName}</span>
          </div>
          
          {contract.contact_info?.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-3 w-3" />
              <span className="truncate">{contract.contact_info.email}</span>
            </div>
          )}
        </div>

        {/* Contract details */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(contract.created_at).toLocaleDateString('sk-SK')}</span>
          </div>
          
          {contract.contractValue > 0 && (
            <div className="flex items-center gap-1">
              <Euro className="h-3 w-3" />
              <span>{contract.contractValue.toFixed(0)}€</span>
            </div>
          )}
        </div>

        {/* Contract type */}
        <div className="text-xs">
          <Badge variant="secondary" className="bg-gray-50 text-gray-600">
            {contract.contractType}
          </Badge>
        </div>

        {/* Action button */}
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
      </div>
    </Card>
  );
};

export default KanbanCard;
