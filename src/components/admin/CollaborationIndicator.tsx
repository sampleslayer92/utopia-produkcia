import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, AlertTriangle } from 'lucide-react';
import { useRealTimeCollaboration } from '@/hooks/useRealTimeCollaboration';

interface CollaborationIndicatorProps {
  contractId: string;
  currentUserEmail: string;
  currentUserName: string;
  currentStep?: number;
}

const CollaborationIndicator = ({ 
  contractId, 
  currentUserEmail, 
  currentUserName,
  currentStep 
}: CollaborationIndicatorProps) => {
  const { activeSessions, conflicts, updateCurrentStep } = useRealTimeCollaboration(
    contractId, 
    currentUserEmail, 
    currentUserName
  );

  // Update current step when it changes
  React.useEffect(() => {
    if (currentStep !== undefined) {
      updateCurrentStep(currentStep);
    }
  }, [currentStep, updateCurrentStep]);

  if (activeSessions.length === 0 && conflicts.length === 0) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Aktívne relácie ({activeSessions.length})
            </span>
          </div>
          
          {conflicts.length > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Konflikty
            </Badge>
          )}
        </div>

        {activeSessions.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-blue-700">
              {activeSessions.length} aktívnych používateľov pracuje na zmluve
            </p>
          </div>
        )}

        {conflicts.length > 0 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-800">
              ⚠️ Možné konflikty pri úprave zmluvy
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollaborationIndicator;