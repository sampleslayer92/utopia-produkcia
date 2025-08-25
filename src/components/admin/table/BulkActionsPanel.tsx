
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Trash2, 
  Download, 
  Mail, 
  Archive
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface BulkActionsPanelProps {
  selectedItems: string[];
  onClearSelection: () => void;
  onBulkAction?: (action: string, items: string[]) => void;
}

const BulkActionsPanel = ({ 
  selectedItems, 
  onClearSelection, 
  onBulkAction 
}: BulkActionsPanelProps) => {
  const { t } = useTranslation('admin');

  if (selectedItems.length === 0) {
    return null;
  }

  const handleAction = (action: string) => {
    if (onBulkAction) {
      onBulkAction(action, selectedItems);
    }
  };

  return (
    <Card className="p-4 border-blue-200 bg-blue-50/50 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">
            {selectedItems.length} {t('table.selectedItems')}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAction('view')}
          >
            <Eye className="h-4 w-4 mr-2" />
            {t('table.bulkActions.view')}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAction('export')}
          >
            <Download className="h-4 w-4 mr-2" />
            {t('table.bulkActions.export')}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAction('email')}
          >
            <Mail className="h-4 w-4 mr-2" />
            {t('table.bulkActions.email')}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAction('archive')}
          >
            <Archive className="h-4 w-4 mr-2" />
            {t('table.bulkActions.archive')}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearSelection}
          >
            {t('table.bulkActions.clear')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BulkActionsPanel;
