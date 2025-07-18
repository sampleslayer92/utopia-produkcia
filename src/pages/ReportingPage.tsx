import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, FileText, Download, Calendar, DollarSign } from "lucide-react";
import { useEnhancedContractsData } from "@/hooks/useEnhancedContractsData";
import { useMerchantsData } from "@/hooks/useMerchantsData";
import { useBusinessLocations } from "@/hooks/useBusinessLocations";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const ReportingPage = () => {
  const { t } = useTranslation('admin');
  const { data: contracts = [] } = useEnhancedContractsData();
  const { data: merchants = [] } = useMerchantsData();
  const { data: locations = [] } = useBusinessLocations();

  const stats = {
    totalContracts: contracts.length,
    activeContracts: contracts.filter(c => c.status === 'signed').length,
    totalMerchants: merchants.length,
    totalLocations: locations.length,
    pendingContracts: contracts.filter(c => c.status === 'pending_signature').length,
    draftContracts: contracts.filter(c => c.status === 'draft').length,
    totalRevenue: contracts
      .filter(c => c.status === 'signed')
      .reduce((sum) => sum + Math.random() * 1000, 0), // Mock calculation for now
    avgContractValue: contracts.length > 0 
      ? contracts.reduce((sum) => sum + Math.random() * 500, 0) / contracts.length 
      : 0
  };

  // Chart data
  const contractStatusData = [
    { name: t('reporting.signed'), value: stats.activeContracts, color: '#22C55E' },
    { name: t('reporting.pending'), value: stats.pendingContracts, color: '#F59E0B' },
    { name: t('reporting.drafts'), value: stats.draftContracts, color: '#6B7280' },
  ];

  const monthlyRevenueData = [
    { month: 'Jan', revenue: Math.round(stats.totalRevenue * 0.7) },
    { month: 'Feb', revenue: Math.round(stats.totalRevenue * 0.8) },
    { month: 'Mar', revenue: Math.round(stats.totalRevenue * 0.85) },
    { month: 'Apr', revenue: Math.round(stats.totalRevenue * 0.9) },
    { month: 'Máj', revenue: Math.round(stats.totalRevenue * 0.95) },
    { month: 'Jún', revenue: Math.round(stats.totalRevenue) },
  ];

  const merchantGrowthData = [
    { month: 'Jan', merchants: Math.round(stats.totalMerchants * 0.6) },
    { month: 'Feb', merchants: Math.round(stats.totalMerchants * 0.7) },
    { month: 'Mar', merchants: Math.round(stats.totalMerchants * 0.8) },
    { month: 'Apr', merchants: Math.round(stats.totalMerchants * 0.85) },
    { month: 'Máj', merchants: Math.round(stats.totalMerchants * 0.92) },
    { month: 'Jún', merchants: stats.totalMerchants },
  ];

  const reportCards = [
    {
      title: t('reporting.contractsOverview'),
      description: t('reporting.contractsOverviewDesc'),
      icon: FileText,
      stats: [
        { label: t('reporting.totalContracts'), value: stats.totalContracts },
        { label: t('reporting.activeContracts'), value: stats.activeContracts },
        { label: t('reporting.pendingContracts'), value: stats.pendingContracts }
      ]
    },
    {
      title: t('reporting.merchantsAnalysis'),
      description: t('reporting.merchantsAnalysisDesc'),
      icon: Users,
      stats: [
        { label: t('reporting.totalMerchants'), value: stats.totalMerchants },
        { label: t('reporting.totalLocations'), value: stats.totalLocations },
        { label: t('reporting.avgLocationsPerMerchant'), value: Math.round((stats.totalLocations / stats.totalMerchants) * 10) / 10 || 0 }
      ]
    },
    {
      title: t('reporting.performanceMetrics'),
      description: t('reporting.performanceMetricsDesc'),
      icon: TrendingUp,
      stats: [
        { label: t('reporting.conversionRate'), value: `${Math.round((stats.activeContracts / stats.totalContracts) * 100) || 0}%` },
        { label: t('reporting.draftContracts'), value: stats.draftContracts },
        { label: t('reporting.completionRate'), value: `${Math.round(((stats.activeContracts + stats.pendingContracts) / stats.totalContracts) * 100) || 0}%` }
      ]
    }
  ];

  return (
    <AdminLayout
      title={t('navigation.reporting')}
      subtitle={t('reporting.subtitle')}
    >
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">{t('reporting.dashboard')}</h2>
            <p className="text-muted-foreground">{t('reporting.dashboardDesc')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              {t('reporting.dateRange')}
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              {t('reporting.export')}
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reporting.totalContracts')}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContracts}</div>
              <p className="text-xs text-muted-foreground">{t('reporting.allTimeTotal')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reporting.activeContracts')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeContracts}</div>
              <p className="text-xs text-muted-foreground">{t('reporting.signedAndActive')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reporting.totalMerchants')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMerchants}</div>
              <p className="text-xs text-muted-foreground">{t('reporting.registeredMerchants')}</p>
            </CardContent>
          </Card>
          
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('reporting.monthlyRevenue')}</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(stats.totalRevenue)}€</div>
                <p className="text-xs text-muted-foreground">{t('reporting.fromActiveContracts')}</p>
              </CardContent>
            </Card>
        </div>

        {/* Detailed Reports */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">{t('reporting.overview')}</TabsTrigger>
            <TabsTrigger value="business">{t('reporting.business')}</TabsTrigger>
            <TabsTrigger value="technical">{t('reporting.technical')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Contract Status Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('reporting.contractStatusDistribution')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={contractStatusData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {contractStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('reporting.monthlyRevenueChart')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}€`, t('reporting.revenue')]} />
                        <Bar dataKey="revenue" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Merchant Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{t('reporting.merchantGrowthChart')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={merchantGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}`, t('reporting.merchants')]} />
                      <Line 
                        type="monotone" 
                        dataKey="merchants" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {reportCards.map((report, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <report.icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {report.stats.map((stat, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{stat.label}</span>
                          <span className="font-semibold">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      {t('reporting.viewDetails')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="business" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('reporting.businessReports')}</CardTitle>
                <p className="text-muted-foreground">{t('reporting.businessReportsDesc')}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    {t('reporting.contractsReport')}
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Users className="h-6 w-6" />
                    {t('reporting.merchantsReport')}
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <TrendingUp className="h-6 w-6" />
                    {t('reporting.revenueReport')}
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <BarChart3 className="h-6 w-6" />
                    {t('reporting.performanceReport')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="technical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('reporting.technicalReports')}</CardTitle>
                <p className="text-muted-foreground">{t('reporting.technicalReportsDesc')}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    {t('reporting.systemLogs')}
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <BarChart3 className="h-6 w-6" />
                    {t('reporting.usageAnalytics')}
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <TrendingUp className="h-6 w-6" />
                    {t('reporting.errorReports')}
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Users className="h-6 w-6" />
                    {t('reporting.userActivity')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ReportingPage;