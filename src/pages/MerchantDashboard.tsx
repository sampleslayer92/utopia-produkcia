
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Monitor,
  FileText,
  Settings,
  HelpCircle,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminProfile from "@/components/admin/AdminProfile";
import { useMerchantProfile } from "@/hooks/useMerchantProfile";
import { useMerchantStats } from "@/hooks/useMerchantStats";
import { useMerchantContracts } from "@/hooks/useMerchantContracts";
import { format } from "date-fns";

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const { data: merchantProfile, isLoading: profileLoading } = useMerchantProfile();
  const { data: merchantStats, isLoading: statsLoading } = useMerchantStats();
  const { data: contracts, isLoading: contractsLoading } = useMerchantContracts();

  const isLoading = profileLoading || statsLoading || contractsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-slate-600">Loading merchant dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Contracts",
      value: merchantStats?.totalContracts?.toString() || "0",
      change: "+0",
      icon: FileText,
      trend: "neutral"
    },
    {
      title: "Active Contracts",
      value: merchantStats?.activeContracts?.toString() || "0",
      change: "+0",
      icon: CreditCard,
      trend: "up"
    },
    {
      title: "Monthly Profit",
      value: `€${merchantStats?.totalMonthlyProfit?.toFixed(2) || "0.00"}`,
      change: "+0%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Average Contract",
      value: `€${merchantStats?.averageContractValue?.toFixed(2) || "0.00"}`,
      change: "+0%",
      icon: TrendingUp,
      trend: "up"
    }
  ];

  const recentTransactions = [
    { id: "TXN-001", amount: "$45.67", type: "Sale", card: "•••• 4321", time: "2:34 PM", status: "approved" },
    { id: "TXN-002", amount: "$23.45", type: "Sale", card: "•••• 8765", time: "2:28 PM", status: "approved" },
    { id: "TXN-003", amount: "$67.89", type: "Sale", card: "•••• 1234", time: "2:15 PM", status: "approved" },
    { id: "TXN-004", amount: "$12.34", type: "Refund", card: "•••• 5678", time: "1:45 PM", status: "processed" },
    { id: "TXN-005", amount: "$89.99", type: "Sale", card: "•••• 9876", time: "1:32 PM", status: "declined" }
  ];

  const deviceStatus = [
    { name: "Terminal 1", location: "Front Counter", status: "online", lastUsed: "2 minutes ago" },
    { name: "Terminal 2", location: "Back Office", status: "online", lastUsed: "15 minutes ago" },
    { name: "Mobile Reader", location: "Portable", status: "offline", lastUsed: "2 hours ago" }
  ];

  const notifications = [
    { type: "info", message: "Monthly statement is ready", time: "1 hour ago" },
    { type: "warning", message: "Device maintenance scheduled for tomorrow", time: "3 hours ago" },
    { type: "success", message: "Payment settlement processed", time: "1 day ago" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Merchant Dashboard</h1>
                <p className="text-sm text-slate-600">{merchantProfile?.company_name || "Loading..."}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                Merchant
              </Badge>
              <AdminProfile />
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
                    <p className={`text-sm flex items-center mt-1 ${
                      stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-red-600' : 'text-slate-500'
                    }`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Contracts */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-900">Recent Contracts</CardTitle>
                    <CardDescription className="text-slate-600">
                      Your latest contract activity
                    </CardDescription>
                  </div>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-slate-300"
                    onClick={() => navigate('/merchant/contracts')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {contracts?.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No contracts found</p>
                    <p className="text-sm text-slate-500">Your contracts will appear here once created</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contracts?.slice(0, 5).map((contract, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            contract.status === 'signed' 
                              ? 'bg-emerald-100 text-emerald-600'
                              : contract.status === 'approved'
                              ? 'bg-blue-100 text-blue-600'
                              : contract.status === 'submitted'
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{contract.contract_number}</p>
                            <p className="text-sm text-slate-600">
                              {contract.contract_items_count} items • €{contract.total_monthly_profit.toFixed(2)}/month
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">
                            {format(new Date(contract.created_at), 'MMM dd, yyyy')}
                          </p>
                          <Badge 
                            variant="outline"
                            className={
                              contract.status === 'signed' 
                                ? 'border-emerald-200 text-emerald-700'
                                : contract.status === 'approved'
                                ? 'border-blue-200 text-blue-700'
                                : contract.status === 'submitted'
                                ? 'border-amber-200 text-amber-700'
                                : 'border-slate-200 text-slate-700'
                            }
                          >
                            {contract.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Device Status & Notifications */}
          <div className="space-y-6">
            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Monitor className="h-5 w-5 mr-2 text-purple-600" />
                  Device Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deviceStatus.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{device.name}</p>
                        <p className="text-sm text-slate-600">{device.location}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="outline"
                          className={device.status === 'online' 
                            ? 'border-emerald-200 text-emerald-700'
                            : 'border-red-200 text-red-700'
                          }
                        >
                          {device.status}
                        </Badge>
                        <p className="text-xs text-slate-500 mt-1">{device.lastUsed}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      notification.type === 'success' 
                        ? 'border-emerald-500 bg-emerald-50/50' 
                        : notification.type === 'warning'
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-blue-500 bg-blue-50/50'
                    }`}>
                      <p className="text-sm text-slate-900">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
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
                  <FileText className="h-4 w-4 mr-2" />
                  View Statements
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-300"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-300"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
