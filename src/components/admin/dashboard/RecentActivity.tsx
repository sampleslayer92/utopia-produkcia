
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentActivityProps {
  stats: {
    total: number;
  } | undefined;
}

const RecentActivity = ({ stats }: RecentActivityProps) => {
  const { t } = useTranslation('admin');

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900 text-lg">{t('sidebar.recentActivity.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
            <span className="text-slate-600">{t('sidebar.recentActivity.systemStarted')}</span>
            <span className="text-slate-400 ml-auto">{t('sidebar.recentActivity.justNow')}</span>
          </div>
          {stats?.total && stats.total > 0 && (
            <div className="flex items-center space-x-3 text-sm">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span className="text-slate-600">{t('sidebar.recentActivity.contractsLoaded', { count: stats.total })}</span>
              <span className="text-slate-400 ml-auto">{t('sidebar.recentActivity.momentAgo')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
