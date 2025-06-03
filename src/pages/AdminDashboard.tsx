
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Building, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  BarChart3,
  Settings,
  Calendar,
  Plus,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import EnhancedContractsTable from "@/components/admin/EnhancedContractsTable";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useContractsStats } from "@/hooks/useContractsData";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useContractsStats();

  const statsCards = [
    {
      title: "Celkový počet zmlúv",
      value: statsLoading ? "..." : (stats?.total.toString() || "0"),
      change: statsLoading ? "..." : `+${stats?.recentContracts || 0} za 30 dní`,
      icon: FileText,
      trend: "up",
      color: "emerald"
    },
    {
      title: "Odoslané zmluvy",
      value: statsLoading ? "..." : (stats?.submitted.toString() || "0"),
      change: "Čakajú na schválenie",
      icon: CreditCard,
      trend: "up",
      color: "blue"
    },
    {
      title: "Schválené zmluvy",
      value: statsLoading ? "..." : (stats?.approved.toString() || "0"),
      change: "Aktívne zmluvy",
      icon: Building,
      trend: "up",
      color: "green"
    },
    {
      title: "Koncepty",
      value: statsLoading ? "..." : (stats?.draft.toString() || "0"),
      change: "Nedokončené",
      icon: Users,
      trend: "neutral",
      color: "gray"
    }
  ];

  const systemAlerts = [
    { 
      type: "info", 
      message: `${stats?.submitted || 0} zmlúv čaká na schválenie`, 
      priority: "medium" 
    },
    { 
      type: "success", 
      message: "Systém funguje bez problémov", 
      priority: "low" 
    },
  ];

  const getCardColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return "bg-emerald-100 text-emerald-600";
      case 'blue':
        return "bg-blue-100 text-blue-600";
      case 'green':
        return "bg-green-100 text-green-600";
      case 'gray':
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-emerald-100 text-emerald-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-600">Prehľad systému a správa zmlúv</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  <Activity className="h-3 w-3 mr-1" />
                  Online
                </Badge>
                <Button 
                  onClick={() => navigate('/onboarding')}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nová zmluva
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="border-slate-300"
                >
                  Domovská stránka
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <Card key={index} className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                      <p className={`text-sm flex items-center ${
                        stat.trend === 'up' ? 'text-emerald-600' : 'text-slate-500'
                      }`}>
                        {stat.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                        {stat.trend === 'neutral' && <Calendar className="h-3 w-3 mr-1" />}
                        {stat.change}
                      </p>
                    </div>
                    <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${getCardColorClasses(stat.color)}`}>
                      <stat.icon className="h-7 w-7" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Enhanced Contracts Table */}
            <div className="lg:col-span-3">
              <EnhancedContractsTable />
            </div>

            {/* Sidebar with alerts and actions */}
            <div className="space-y-6">
              {/* System Alerts */}
              <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center text-lg">
                    <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
                    Upozornenia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemAlerts.map((alert, index) => (
                      <div key={index} className={`p-3 rounded-lg border-l-4 ${
                        alert.priority === 'high' 
                          ? 'border-red-500 bg-red-50/50' 
                          : alert.priority === 'medium'
                          ? 'border-amber-500 bg-amber-50/50'
                          : 'border-emerald-500 bg-emerald-50/50'
                      }`}>
                        <p className="text-sm text-slate-900 mb-2">{alert.message}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            alert.priority === 'high' 
                              ? 'border-red-200 text-red-700' 
                              : alert.priority === 'medium'
                              ? 'border-amber-200 text-amber-700'
                              : 'border-emerald-200 text-emerald-700'
                          }`}
                        >
                          {alert.priority === 'high' ? 'vysoká' : alert.priority === 'medium' ? 'stredná' : 'nízka'} priorita
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 text-lg">Rýchle akcie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-300 hover:bg-slate-50"
                    onClick={() => navigate('/onboarding')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Vytvoriť novú zmluvu
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-300 hover:bg-slate-50"
                    disabled
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generovať reporty
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-300 hover:bg-slate-50"
                    disabled
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Spravovať používateľov
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-slate-300 hover:bg-slate-50"
                    disabled
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Nastavenia systému
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900 text-lg">Posledná aktivita</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-600">Systém spustený</span>
                      <span className="text-slate-400 ml-auto">práve teraz</span>
                    </div>
                    {stats?.total && stats.total > 0 && (
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-600">Načítané {stats.total} zmlúv</span>
                        <span className="text-slate-400 ml-auto">pred chvíľou</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
