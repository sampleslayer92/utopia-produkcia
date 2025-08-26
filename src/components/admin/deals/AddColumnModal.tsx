import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { KanbanColumn } from '@/hooks/useKanbanColumns';
import { useContractStatuses } from '@/hooks/useContractStatuses';
import { useTranslation } from 'react-i18next';

interface AddColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddColumn: (column: Omit<KanbanColumn, 'id'>) => Promise<any>;
  existingColumns: KanbanColumn[];
}

const COLOR_PALETTE = [
  '#6B7280', // Gray
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#F97316', // Orange
];

const AddColumnModal = ({ isOpen, onClose, onAddColumn, existingColumns }: AddColumnModalProps) => {
  const { t } = useTranslation('admin');
  const [title, setTitle] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { statuses: availableStatuses, isLoading: statusesLoading } = useContractStatuses();

  // Get used statuses to show availability
  const usedStatuses = new Set(existingColumns.flatMap(col => col.statuses));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedStatuses.length === 0) return;

    setIsLoading(true);
    try {
      const newColumn: Omit<KanbanColumn, 'id'> = {
        title: title.trim(),
        statuses: selectedStatuses,
        color: selectedColor,
        position: existingColumns.length,
        isActive: true
      };

      await onAddColumn(newColumn);
      
      // Reset form
      setTitle('');
      setSelectedStatuses([]);
      setSelectedColor(COLOR_PALETTE[0]);
      onClose();
    } catch (error) {
      console.error('Error adding column:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = (statusId: string) => {
    setSelectedStatuses(prev => 
      prev.includes(statusId) 
        ? prev.filter(id => id !== statusId)
        : [...prev, statusId]
    );
  };

  const handleClose = () => {
    setTitle('');
    setSelectedStatuses([]);
    setSelectedColor(COLOR_PALETTE[0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('deals.addColumnModal.title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">{t('deals.addColumnModal.columnNameLabel')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('deals.addColumnModal.columnNamePlaceholder')}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>{t('deals.addColumnModal.columnColorLabel')}</Label>
            <div className="flex gap-2">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    selectedColor === color 
                      ? 'border-foreground shadow-md' 
                      : 'border-transparent hover:border-muted-foreground'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>{t('deals.addColumnModal.statusesLabel')}</Label>
            {statusesLoading ? (
              <div className="border rounded-md p-3 text-center text-muted-foreground">
                {t('deals.addColumnModal.loadingStatuses')}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {availableStatuses.map((status) => {
                  const isUsed = usedStatuses.has(status.name);
                  const isSelected = selectedStatuses.includes(status.name);
                  
                  return (
                    <div
                      key={status.id}
                      className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-primary/10 border-primary' 
                          : isUsed 
                          ? 'bg-muted/50 border-muted opacity-60' 
                          : 'hover:bg-muted/50 border-border'
                      }`}
                      onClick={() => !isUsed && toggleStatus(status.name)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{status.label}</div>
                        <div className="text-xs text-muted-foreground truncate">{status.description}</div>
                      </div>
                      {isSelected && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          ✓
                        </Badge>
                      )}
                      {isUsed && !isSelected && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {t('deals.addColumnModal.used')}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {selectedStatuses.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-sm text-muted-foreground">{t('deals.addColumnModal.selected')}</span>
                {selectedStatuses.map(statusName => {
                  const status = availableStatuses.find(s => s.name === statusName);
                  return (
                    <Badge key={statusName} variant="secondary" className="text-xs">
                      {status?.label}
                      <button
                        type="button"
                        onClick={() => toggleStatus(statusName)}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('deals.addColumnModal.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim() || selectedStatuses.length === 0 || isLoading}
            >
              {isLoading ? t('deals.addColumnModal.adding') : t('deals.addColumnModal.addColumn')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddColumnModal;