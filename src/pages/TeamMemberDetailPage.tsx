
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Target, TrendingUp, Mail, Phone, MapPin } from "lucide-react";
import { useTeamPerformance } from "@/hooks/useTeamPerformance";

const TeamMemberDetailPage = () => {
  const { t } = useTranslation('admin');
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { data: teamData, isLoading } = useTeamPerformance();

  if (isLoading) {
    return (
      <AdminLayout 
        title={t('team.member')} 
        subtitle=""
      >
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-slate-200 rounded"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const memberIndex = parseInt(memberId || '1') - 1;
  const member = teamData?.members?.[memberIndex];

  if (!member) {
    return (
      <AdminLayout 
        title={t('team.member')} 
        subtitle=""
      >
        <div className="text-center py-12">
          <p className="text-slate-600">Member not found</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/team')}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('contractDetail.backToList')}
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const getPerformanceBadge = (performance: number) => {
    if (performance >= 90) return { color: "bg-green-100 text-green-700", label: t('dashboard.team.excellent') };
    if (performance >= 70) return { color: "bg-blue-100 text-blue-700", label: t('dashboard.team.good') };
    if (performance >= 50) return { color: "bg-yellow-100 text-yellow-700", label: t('dashboard.team.average') };
    return { color: "bg-red-100 text-red-700", label: t('dashboard.team.needsImprovement') };
  };

  const badge = getPerformanceBadge(member.performance);

  const memberActions = (
    <Button 
      variant="outline" 
      onClick={() => navigate('/admin/team')}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {t('contractDetail.backToList')}
    </Button>
  );

  return (
    <AdminLayout 
      title={member.name} 
      subtitle={member.role}
      actions={memberActions}
    >
      <div className="space-y-6">
        {/* Member Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              {t('team.contactInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-xl">
                  {member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{member.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-slate-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{t('team.role')}: {member.role}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{t('team.email')}: {member.email || 'not.available@example.com'}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{t('team.phone')}: {member.phone || '+421 900 000 000'}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{t('team.joinedDate')}: 2023-01-15</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <Badge className={`${badge.color} mb-3 w-fit`}>
                      {badge.label}
                    </Badge>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('team.performance')}</span>
                        <span className="font-medium">{member.performance}%</span>
                      </div>
                      <Progress value={member.performance} className="h-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('team.thisMonth')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">{member.contractsThisMonth}</div>
                <p className="text-sm text-slate-600">{t('team.contracts')}</p>
                <div className="text-xs text-slate-500">
                  {t('team.target')}: {member.monthlyTarget}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('team.revenue')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-600">€{member.revenueGenerated?.toLocaleString()}</div>
                <p className="text-sm text-slate-600">{t('team.thisMonth')}</p>
                <div className="text-xs text-slate-500">
                  {t('team.target')}: €{member.revenueTarget?.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('team.yearToDate')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-purple-600">{member.contractsThisMonth * 8}</div>
                <p className="text-sm text-slate-600">{t('team.contracts')}</p>
                <div className="text-xs text-green-600 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15% vs last year
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {t('team.recentActivity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Contract signed', client: 'ABC Restaurant', date: '2 days ago', amount: '€1,200' },
                { action: 'New lead created', client: 'XYZ Shop', date: '5 days ago', amount: '€850' },
                { action: 'Contract approved', client: 'Coffee Corner', date: '1 week ago', amount: '€950' },
                { action: 'Meeting scheduled', client: 'Fashion Store', date: '1 week ago', amount: '-' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-slate-900">{activity.action}</p>
                    <p className="text-sm text-slate-600">{activity.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{activity.amount}</p>
                    <p className="text-xs text-slate-500">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default TeamMemberDetailPage;
