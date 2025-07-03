import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Calendar, Activity } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface ContractHistoryTabProps {
  contractId: string;
}

const ContractHistoryTab = ({ contractId }: ContractHistoryTabProps) => {
  const { t } = useTranslation('admin');
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            {t('contracts.detail.history.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('contracts.detail.history.historyComingSoon')}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            {t('contracts.detail.history.userActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('contracts.detail.history.activityComingSoon')}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {t('contracts.detail.history.timeline')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('contracts.detail.history.timelineComingSoon')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractHistoryTab;