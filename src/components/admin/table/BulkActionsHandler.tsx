
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BulkActionsHandlerProps {
  selectedContracts: string[];
  onClearSelection: () => void;
}

const BulkActionsHandler = ({ selectedContracts, onClearSelection }: BulkActionsHandlerProps) => {
  const { t } = useTranslation('admin');

  if (selectedContracts.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 border-blue-200 bg-blue-50/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">
            {selectedContracts.length} {t('table.selectedContracts')}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            {t('table.bulkActions.view')}
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

export default BulkActionsHandler;
