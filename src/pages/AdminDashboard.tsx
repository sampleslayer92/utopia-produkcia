
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
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Revenue",
      value: "$2,847,392",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Active Partners",
      value: "47",
      change: "+3",
      icon: Users,
      trend: "up"
    },
    {
      title: "Total Merchants",
      value: "1,234",
      change: "+89",
      icon: Building,
      trend: "up"
    },
    {
      title: "Transactions Today",
      value: "8,429",
      change: "+5.2%",
      icon: CreditCard,
      trend: "up"
    }
  ];

  const recentPartners = [
    { name: "Acme Payment Solutions", merchants: 23, revenue: "$45,230", status: "active" },
    { name: "TechFlow Partners", merchants: 15, revenue: "$32,100", status: "active" },
    { name: "Metro Business Services", merchants: 8, revenue: "$18,950", status: "pending" },
    { name: "Global Payment Hub", merchants: 31, revenue: "$67,840", status: "active" }
  ];

  const systemAlerts = [
    { type: "warning", message: "3 devices require maintenance", priority: "medium" },
    { type: "info", message: "Monthly compliance report due in 5 days", priority: "low" },
    { type: "error", message: "2 failed transactions require review", priority: "high" }
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
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-emerald-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
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
          {/* Recent Partners */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-900">Business Partners</CardTitle>
                    <CardDescription className="text-slate-600">
                      Recent partner activity and performance
                    </CardDescription>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Partner
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPartners.map((partner, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          <Building className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{partner.name}</h4>
                          <p className="text-sm text-slate-600">{partner.merchants} merchants</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900">{partner.revenue}</p>
                        <Badge 
                          variant={partner.status === 'active' ? 'default' : 'secondary'}
                          className={partner.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-100 text-amber-700 border-amber-200'
                          }
                        >
                          {partner.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Alerts & Quick Actions */}
          <div className="space-y-6">
            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
                  System Alerts
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
                        {alert.priority} priority
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-300"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-300"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-300"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
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
