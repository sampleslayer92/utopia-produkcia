
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900 text-lg">{t('sidebar.quickActions.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start border-slate-300 hover:bg-slate-50"
          onClick={() => navigate('/onboarding')}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('sidebar.quickActions.createContract')}
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start border-slate-300 hover:bg-slate-50"
          disabled
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          {t('sidebar.quickActions.generateReports')}
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start border-slate-300 hover:bg-slate-50"
          disabled
        >
          <Users className="h-4 w-4 mr-2" />
          {t('sidebar.quickActions.manageUsers')}
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start border-slate-300 hover:bg-slate-50"
          disabled
        >
          <Settings className="h-4 w-4 mr-2" />
          {t('sidebar.quickActions.systemSettings')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
