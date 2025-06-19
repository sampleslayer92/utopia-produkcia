
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, Eye, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTeamPerformance } from "@/hooks/useTeamPerformance";

const TeamPage = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const { data: teamData, isLoading } = useTeamPerformance();

  const getPerformanceBadge = (performance: number) => {
    if (performance >= 90) return { color: "bg-green-100 text-green-700", label: t('dashboard.team.excellent') };
    if (performance >= 70) return { color: "bg-blue-100 text-blue-700", label: t('dashboard.team.good') };
    if (performance >= 50) return { color: "bg-yellow-100 text-yellow-700", label: t('dashboard.team.average') };
    return { color: "bg-red-100 text-red-700", label: t('dashboard.team.needsImprovement') };
  };

  if (isLoading) {
    return (
      <AdminLayout 
        title={t('team.title')} 
        subtitle={t('team.subtitle')}
      >
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-slate-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
                    <div className="h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title={t('team.title')} 
      subtitle={t('team.subtitle')}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {teamData?.members?.map((member: any, index: number) => {
          const badge = getPerformanceBadge(member.performance);
          return (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-lg">
                      {member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-slate-900">{member.name}</h3>
                        <p className="text-sm text-slate-600 mb-1">{member.role}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {member.email || 'Not available'}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {member.phone || 'Not available'}
                          </span>
                        </div>
                      </div>
                      <Badge className={badge.color}>
                        {badge.label}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-slate-900">{member.contractsThisMonth}</div>
                        <div className="text-xs text-slate-600">{t('team.contracts')}</div>
                        <div className="text-xs text-slate-500">{t('team.thisMonth')}</div>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">€{member.revenueGenerated?.toLocaleString()}</div>
                        <div className="text-xs text-slate-600">{t('team.revenue')}</div>
                        <div className="text-xs text-slate-500">{t('team.thisMonth')}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">{t('team.performance')}</span>
                        <span className="font-medium">{member.performance}%</span>
                      </div>
                      <Progress value={member.performance} className="h-2" />
                      
                      <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span className="flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          {t('team.target')}: {member.monthlyTarget} / €{member.revenueTarget?.toLocaleString()}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/admin/team/${index + 1}`)}
                          className="h-6 px-2"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {t('dashboard.team.viewAll')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default TeamPage;
