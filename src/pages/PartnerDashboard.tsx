
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Users,
  Plus,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PartnerDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Merchants",
      value: "23",
      change: "+3",
      icon: Building,
      trend: "up"
    },
    {
      title: "Monthly Revenue",
      value: "$45,230",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Active Devices",
      value: "67",
      change: "+5",
      icon: CreditCard,
      trend: "up"
    },
    {
      title: "This Month's Commission",
      value: "$3,420",
      change: "+8.2%",
      icon: TrendingUp,
      trend: "up"
    }
  ];

  const recentMerchants = [
    { 
      name: "Corner Coffee Shop", 
      type: "Restaurant", 
      status: "active", 
      revenue: "$2,340",
      devices: 2,
      joinDate: "2024-12-15"
    },
    { 
      name: "Tech Repair Plus", 
      type: "Services", 
      status: "active", 
      revenue: "$1,850",
      devices: 1,
      joinDate: "2024-12-10"
    },
    { 
      name: "Fashion Boutique", 
      type: "Retail", 
      status: "pending", 
      revenue: "$0",
      devices: 0,
      joinDate: "2024-12-20"
    },
    { 
      name: "Auto Service Center", 
      type: "Automotive", 
      status: "active", 
      revenue: "$4,120",
      devices: 3,
      joinDate: "2024-12-01"
    }
  ];

  const recentTickets = [
    { id: "TK-001", merchant: "Corner Coffee Shop", issue: "Device connectivity", priority: "medium", status: "open" },
    { id: "TK-002", merchant: "Tech Repair Plus", issue: "Transaction failed", priority: "high", status: "in-progress" },
    { id: "TK-003", merchant: "Auto Service Center", issue: "Monthly statement", priority: "low", status: "resolved" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Partner Dashboard</h1>
                <p className="text-sm text-slate-600">Business Partner Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                Partner
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
                    <p className="text-sm text-blue-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Merchant Portfolio */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-900">My Merchants</CardTitle>
                    <CardDescription className="text-slate-600">
                      Your merchant portfolio and performance
                    </CardDescription>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => navigate('/onboarding')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Merchant
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMerchants.map((merchant, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          <Building className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{merchant.name}</h4>
                          <div className="flex items-center space-x-3 text-sm text-slate-600">
                            <span>{merchant.type}</span>
                            <span>•</span>
                            <span>{merchant.devices} devices</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900">{merchant.revenue}</p>
                        <Badge 
                          variant={merchant.status === 'active' ? 'default' : 'secondary'}
                          className={merchant.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-100 text-amber-700 border-amber-200'
                          }
                        >
                          {merchant.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Tickets & Quick Actions */}
          <div className="space-y-6">
            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Recent Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTickets.map((ticket, index) => (
                    <div key={index} className="p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900">{ticket.id}</span>
                        <Badge 
                          variant="outline"
                          className={
                            ticket.priority === 'high' 
                              ? 'border-red-200 text-red-700'
                              : ticket.priority === 'medium'
                              ? 'border-amber-200 text-amber-700'
                              : 'border-blue-200 text-blue-700'
                          }
                        >
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{ticket.merchant}</p>
                      <p className="text-sm text-slate-900">{ticket.issue}</p>
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
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-300"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-300"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Newsletter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
