
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { Users, Target, TrendingUp, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTeamPerformance } from "@/hooks/useTeamPerformance";

const TeamPerformance = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const { data: teamData, isLoading } = useTeamPerformance();

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-slate-900">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              {t('dashboard.team.title')}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3">
                <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-slate-200 rounded w-1/3 mb-1"></div>
                  <div className="h-2 bg-slate-200 rounded w-full"></div>
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

  // Show only top 3 performers for dashboard
  const topPerformers = teamData?.members?.slice().sort((a: any, b: any) => b.performance - a.performance).slice(0, 3) || [];

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-slate-900">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            {t('dashboard.team.title')}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/admin/team')}
            className="text-blue-600 hover:text-blue-700"
          >
            <Eye className="h-4 w-4 mr-1" />
            {t('dashboard.team.viewAll')}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPerformers.map((member: any, index: number) => {
            const badge = getPerformanceBadge(member.performance);
            return (
              <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50/50 rounded-lg hover:bg-slate-100/50 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-xs">
                    {member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-sm text-slate-900 truncate">{member.name}</h4>
                      <Badge className={`${badge.color} text-xs px-1 py-0`}>
                        {member.performance}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>{member.contractsThisMonth}/{member.monthlyTarget} {t('dashboard.team.contractsThisMonth')}</span>
                    <span className="flex items-center text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      €{member.revenueGenerated?.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={member.performance} className="h-1 mt-1" />
                </div>
              </div>
            );
          })}
          
          {topPerformers.length === 0 && (
            <div className="text-center py-6 text-slate-500">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No team members found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamPerformance;
