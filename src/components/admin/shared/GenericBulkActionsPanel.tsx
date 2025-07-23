
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, X, Power, PowerOff, Edit, Download } from 'lucide-react';
import BulkDeleteModal from '../table/BulkDeleteModal';

export interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline';
  onClick: () => void;
  disabled?: boolean;
}

interface GenericBulkActionsPanelProps {
  selectedCount: number;
  entityName: string;
  entityNamePlural: string;
  onClearSelection: () => void;
  onBulkDelete?: () => void;
  onBulkActivate?: () => void;
  onBulkDeactivate?: () => void;
  onBulkExport?: () => void;
  customActions?: BulkAction[];
  isLoading?: boolean;
}

export const GenericBulkActionsPanel = ({
  selectedCount,
  entityName,
  entityNamePlural,
  onClearSelection,
  onBulkDelete,
  onBulkActivate,
  onBulkDeactivate,
  onBulkExport,
  customActions = [],
  isLoading = false
}: GenericBulkActionsPanelProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    if (onBulkDelete) {
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    onBulkDelete?.();
    setShowDeleteModal(false);
  };

  const getCountText = (count: number) => {
    if (count === 1) return `${count} ${entityName} označený`;
    if (count < 5) return `${count} ${entityNamePlural} označené`;
    return `${count} ${entityNamePlural} označených`;
  };

  const getDeleteButtonText = (count: number) => {
    if (count === 1) return `Vymazať ${entityName}`;
    return `Vymazať ${entityNamePlural}`;
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-4 min-w-96 max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {getCountText(selectedCount)}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Aktivovať */}
          {onBulkActivate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkActivate}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <Power className="h-4 w-4" />
              <span>Aktivovať</span>
            </Button>
          )}

          {/* Deaktivovať */}
          {onBulkDeactivate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDeactivate}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <PowerOff className="h-4 w-4" />
              <span>Deaktivovať</span>
            </Button>
          )}

          {/* Export */}
          {onBulkExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkExport}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exportovať</span>
            </Button>
          )}

          {/* Custom Actions */}
          {customActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={action.onClick}
              disabled={action.disabled || isLoading}
              className="flex items-center space-x-2"
            >
              {action.icon}
              <span>{action.label}</span>
            </Button>
          ))}

          {/* Delete */}
          {onBulkDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>{getDeleteButtonText(selectedCount)}</span>
            </Button>
          )}
        </div>
      </div>

      {onBulkDelete && (
        <BulkDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          selectedCount={selectedCount}
        />
      )}
    </>
  );
};
