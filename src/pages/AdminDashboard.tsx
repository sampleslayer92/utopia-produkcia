
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Building, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  BarChart3,
  Settings,
  FileText,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ContractsTable from "@/components/admin/ContractsTable";
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
      trend: "up"
    },
    {
      title: "Odoslané zmluvy",
      value: statsLoading ? "..." : (stats?.submitted.toString() || "0"),
      change: "Čakajú na schválenie",
      icon: CreditCard,
      trend: "up"
    },
    {
      title: "Schválené zmluvy",
      value: statsLoading ? "..." : (stats?.approved.toString() || "0"),
      change: "Aktívne zmluvy",
      icon: Building,
      trend: "up"
    },
    {
      title: "Koncepty",
      value: statsLoading ? "..." : (stats?.draft.toString() || "0"),
      change: "Nedokončené",
      icon: Users,
      trend: "neutral"
    }
  ];

  const systemAlerts = [
    { type: "info", message: `${stats?.submitted || 0} zmlúv čaká na schválenie`, priority: "medium" },
    { type: "info", message: "Systém funguje bez problémov", priority: "low" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-sm text-slate-600">ISO Organization Control Panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                Admin
              </Badge>
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="border-slate-300"
              >
                Späť na domovskú stránku
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className={`text-sm flex items-center mt-1 ${
                      stat.trend === 'up' ? 'text-emerald-600' : 'text-slate-500'
                    }`}>
                      {stat.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                      {stat.trend === 'neutral' && <Calendar className="h-3 w-3 mr-1" />}
                      {stat.change}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contracts Table */}
          <div className="lg:col-span-2">
            <ContractsTable />
          </div>

          {/* System Alerts & Quick Actions */}
          <div className="space-y-6">
            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
                  Systémové upozornenia
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
                        : 'border-blue-500 bg-blue-50/50'
                    }`}>
                      <p className="text-sm text-slate-900">{alert.message}</p>
                      <Badge 
                        variant="outline" 
                        className={`mt-2 ${
                          alert.priority === 'high' 
                            ? 'border-red-200 text-red-700' 
                            : alert.priority === 'medium'
                            ? 'border-amber-200 text-amber-700'
                            : 'border-blue-200 text-blue-700'
                        }`}
                      >
                        {alert.priority === 'high' ? 'vysoká' : alert.priority === 'medium' ? 'stredná' : 'nízka'} priorita
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Rýchle akcie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-300"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generovať správy
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-300"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Spravovať používateľov
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-300"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Nastavenia systému
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
