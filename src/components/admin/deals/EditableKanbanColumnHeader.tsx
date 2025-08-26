import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit2, Check, X, Palette, GripVertical } from 'lucide-react';
import { KanbanColumn } from '@/hooks/useKanbanColumns';
import { useTranslation } from 'react-i18next';
import { getTranslatedColumnTitle, hasColumnTitleTranslation } from '@/utils/columnTitleMapping';

interface EditableKanbanColumnHeaderProps {
  column: KanbanColumn;
  onUpdate: (columnId: string, updates: Partial<KanbanColumn>) => Promise<any>;
  count: number;
  isDragHandle?: boolean;
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

const EditableKanbanColumnHeader = ({ 
  column, 
  onUpdate, 
  count, 
  isDragHandle = false 
}: EditableKanbanColumnHeaderProps) => {
  const { t } = useTranslation('admin');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(column.title);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  // Get translated title for display
  const displayTitle = getTranslatedColumnTitle(column.title, t);

  const handleSave = async () => {
    if (editValue.trim() && editValue !== column.title) {
      await onUpdate(column.id, { title: editValue.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(column.title);
    setIsEditing(false);
  };

  const handleColorChange = async (color: string) => {
    await onUpdate(column.id, { color });
    setIsColorPickerOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center justify-between mb-4 group">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {isDragHandle && (
          <GripVertical 
            className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" 
          />
        )}
        
        <div 
          className="w-3 h-3 rounded-full flex-shrink-0" 
          style={{ backgroundColor: column.color }}
        />
        
        {isEditing ? (
          <div className="flex items-center gap-1 flex-1">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="h-7 text-sm font-semibold px-2"
              autoFocus
              onBlur={handleSave}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              className="h-7 w-7 p-0"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="h-7 w-7 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <h3 
            className="font-semibold text-foreground text-sm flex-1 min-w-0 truncate cursor-pointer hover:text-primary transition-colors"
            onClick={() => setIsEditing(true)}
            title={t('deals.kanban.columnHeader.clickToEdit')}
          >
            {displayTitle}
          </h3>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Badge 
          variant="secondary" 
          className="bg-background/80 text-muted-foreground text-xs px-2 py-1 font-medium shadow-sm"
        >
          {count}
        </Badge>
        
        <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Palette className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="end">
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-md border-2 transition-all hover:scale-110 ${
                    column.color === color 
                      ? 'border-foreground shadow-md' 
                      : 'border-transparent hover:border-muted-foreground'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {!isEditing && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditableKanbanColumnHeader;