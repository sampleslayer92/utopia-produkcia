import { useDraggable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, User, Building2, Euro, Eye, Phone, Mail, Edit, MoreHorizontal } from 'lucide-react';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PipedriveKanbanCardProps {
  contract: EnhancedContractData;
  isDragging?: boolean;
  isMobile?: boolean;
}

const PipedriveKanbanCard = ({ contract, isDragging = false, isMobile = false }: PipedriveKanbanCardProps) => {
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
    disabled: false,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000,
  } : undefined;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'sent_to_client':
      case 'email_viewed':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'contract_generated':
      case 'waiting_for_signature':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'signed':
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'lost':
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (value: number) => {
    if (value > 50000) return 'border-l-green-500';
    if (value > 20000) return 'border-l-yellow-500';
    if (value > 5000) return 'border-l-blue-500';
    return 'border-l-slate-300';
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'web': return '🌐';
      case 'telesales': return '📞';
      case 'facebook': return '📘';
      case 'email': return '📧';
      case 'referral': return '👥';
      default: return '📄';
    }
  };

  const handleViewContract = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/admin/contract/${contract.id}/view`);
  };

  const handleQuickAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement quick actions
    console.log(`Quick action: ${action} for contract ${contract.id}`);
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`
        group relative
        ${isMobile ? 'p-3' : 'p-3'} 
        cursor-grab active:cursor-grabbing
        bg-white border border-slate-200/60
        hover:shadow-lg hover:shadow-slate-900/5
        transition-all duration-200 ease-out
        ${isDragging || isDraggingFromKit ? 'opacity-80 shadow-2xl shadow-slate-900/10 scale-105 rotate-1' : 'hover:scale-[1.02]'}
        ${isMobile ? 'min-h-touch' : ''}
        rounded-lg border-l-4 ${getPriorityColor(contract.contractValue || 0)}
        will-change-transform
      `}
      {...listeners}
      {...attributes}
    >
      <div className="space-y-3">
        {/* Header with contract number, status and priority */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-slate-900 truncate">
                {contract.contract_number}
              </span>
              <span className="text-xs text-slate-500">
                {getSourceIcon(contract.source || 'web')}
              </span>
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${getStatusBadgeColor(contract.status)} font-medium`}
            >
              {t(`status.${contract.status}`)}
            </Badge>
          </div>
          
          {/* Quick actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={(e) => handleQuickAction('call', e)}>
                <Phone className="h-3 w-3 mr-2" />
                Zavolať
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleQuickAction('email', e)}>
                <Mail className="h-3 w-3 mr-2" />
                Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleQuickAction('edit', e)}>
                <Edit className="h-3 w-3 mr-2" />
                Upraviť
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleViewContract}>
                <Eye className="h-3 w-3 mr-2" />
                Detail
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Client info with avatar */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contract.clientName}`} />
            <AvatarFallback className="text-xs bg-slate-100">
              {contract.clientName?.slice(0, 2).toUpperCase() || 'CL'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-slate-900 truncate">
              {contract.clientName}
            </div>
            {contract.contact_info?.email && (
              <div className="text-xs text-slate-500 truncate">
                {contract.contact_info.email}
              </div>
            )}
          </div>
        </div>

        {/* Contract value */}
        {contract.contractValue > 0 && (
          <div className="flex items-center justify-between bg-slate-50 rounded-md p-2">
            <div className="flex items-center gap-1">
              <Euro className="h-3 w-3 text-slate-500" />
              <span className="text-xs text-slate-600">Hodnota</span>
            </div>
            <span className="font-bold text-sm text-slate-900">
              €{contract.contractValue.toLocaleString()}
            </span>
          </div>
        )}

        {/* Progress indicator */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Progress</span>
            <span className="text-slate-500">
              {new Date(contract.created_at).toLocaleDateString('sk-SK')}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${
                contract.status === 'signed' ? 'bg-green-500 w-full' :
                contract.status === 'waiting_for_signature' ? 'bg-orange-500 w-4/5' :
                contract.status === 'contract_generated' ? 'bg-yellow-500 w-3/5' :
                contract.status === 'in_progress' ? 'bg-blue-500 w-2/5' :
                'bg-slate-400 w-1/5'
              }`}
            />
          </div>
        </div>

        {/* Quick action buttons on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewContract}
            className="h-6 text-xs flex-1 hover:bg-blue-50 hover:text-blue-700"
          >
            <Eye className="h-3 w-3 mr-1" />
            Detail
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleQuickAction('call', e)}
            className="h-6 px-2 hover:bg-green-50 hover:text-green-700"
          >
            <Phone className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleQuickAction('email', e)}
            className="h-6 px-2 hover:bg-purple-50 hover:text-purple-700"
          >
            <Mail className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PipedriveKanbanCard;