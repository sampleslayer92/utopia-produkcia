
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from 'react-i18next';
import { Users, Target, TrendingUp } from "lucide-react";
import { useTeamPerformance } from "@/hooks/useTeamPerformance";

const TeamPerformance = () => {
  const { t } = useTranslation('admin');
  const { data: teamData, isLoading } = useTeamPerformance();

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-900">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            {t('dashboard.team.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPerformanceBadge = (performance: number) => {
    if (performance >= 90) return { color: "bg-green-100 text-green-700", label: t('dashboard.team.excellent') };
    if (performance >= 70) return { color: "bg-blue-100 text-blue-700", label: t('dashboard.team.good') };
    if (performance >= 50) return { color: "bg-yellow-100 text-yellow-700", label: t('dashboard.team.average') };
    return { color: "bg-red-100 text-red-700", label: t('dashboard.team.needsImprovement') };
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-slate-900">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          {t('dashboard.team.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {teamData?.members?.map((member: any, index: number) => {
            const badge = getPerformanceBadge(member.performance);
            return (
              <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                    {member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-slate-900">{member.name}</h4>
                      <p className="text-sm text-slate-600">{member.role}</p>
                    </div>
                    <Badge className={badge.color}>
                      {badge.label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">{t('dashboard.team.contractsThisMonth')}</span>
                      <span className="font-medium">{member.contractsThisMonth}/{member.monthlyTarget}</span>
                    </div>
                    <Progress value={member.performance} className="h-2" />
                    
                    <div className="flex justify-between text-xs text-slate-500">
                      <span className="flex items-center">
                        <Target className="h-3 w-3 mr-1" />
                        {t('dashboard.team.target')}: €{member.revenueTarget?.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        €{member.revenueGenerated?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamPerformance;
