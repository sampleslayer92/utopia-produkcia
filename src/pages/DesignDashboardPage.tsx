
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Activity, 
  Award, 
  Zap,
  Globe,
  Rocket,
  Star,
  Heart,
  Eye,
  MessageCircle,
  Share,
  Download,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  Pause,
  Plus,
  FileText,
  Building,
  Loader2,
  DollarSign,
  UserPlus,
  Settings
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDesignDashboardData } from '@/hooks/useDesignDashboardData';
import { toast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DesignDashboardPage = () => {
  const navigate = useNavigate();
  const { businessMetrics, recentActivity, chartData, teamData, isLoading, error } = useDesignDashboardData();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'New Contract':
        navigate('/admin/merchants');
        toast({
          title: "Navigating to Merchants",
          description: "You can create new contracts from merchant profiles",
        });
        break;
      case 'Add Merchant':
        navigate('/admin/merchants');
        toast({
          title: "Opening Merchants",
          description: "Add new merchants to expand your business",
        });
        break;
      case 'View Reports':
        navigate('/admin/reporting');
        toast({
          title: "Loading Reports",
          description: "Accessing comprehensive analytics dashboard",
        });
        break;
      case 'Manage Warehouse':
        navigate('/admin/warehouse');
        toast({
          title: "Opening Warehouse",
          description: "Manage inventory and product catalog",
        });
        break;
      default:
        toast({
          title: "Feature Coming Soon",
          description: "This feature is currently in development",
        });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Design Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Design Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <p className="text-destructive">Error loading dashboard data</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      icon: Building,
      value: businessMetrics?.totalMerchants?.toString() || "0",
      label: 'Total Merchants',
      change: `+${businessMetrics?.merchantGrowth?.toFixed(1) || 0}%`,
      trend: 'up',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: DollarSign,
      value: `€${businessMetrics?.monthlyRevenue?.toLocaleString() || '0'}`,
      label: 'Monthly Revenue',
      change: `+${businessMetrics?.revenueGrowth?.toFixed(1) || 0}%`,
      trend: 'up',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: FileText,
      value: `${businessMetrics?.activeContracts || 0}`,
      label: 'Active Contracts',
      change: `+${businessMetrics?.contractGrowth?.toFixed(1) || 0}%`,
      trend: 'up',
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: Globe,
      value: businessMetrics?.locationsWithPOS?.toString() || "0",
      label: 'Locations with POS',
      change: '+12.5%',
      trend: 'up',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const quickActions = [
    { icon: Plus, label: 'New Contract', color: 'from-violet-500 to-purple-600', action: 'New Contract' },
    { icon: UserPlus, label: 'Add Merchant', color: 'from-blue-500 to-cyan-500', action: 'Add Merchant' },
    { icon: BarChart3, label: 'View Reports', color: 'from-emerald-500 to-teal-500', action: 'View Reports' },
    { icon: Settings, label: 'Manage Warehouse', color: 'from-orange-500 to-red-500', action: 'Manage Warehouse' }
  ];

  return (
    <AdminLayout title="Design Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 p-4 md:p-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                Design Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">Modern analytics with real-time insights</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="text-muted-foreground">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground">
                <Sparkles className="w-4 h-4 mr-2" />
                New Action
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="p-4 md:p-6 bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-200 hover:bg-card/80">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-950">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Chart Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h3 className="text-xl font-semibold text-foreground">Revenue Analytics</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">6M</Button>
                    <Button variant="outline" size="sm">1Y</Button>
                    <Button size="sm" className="bg-primary text-primary-foreground">All</Button>
                  </div>
                </div>
                
                {/* Functional Chart */}
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        contentStyle={{
                          background: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                        formatter={(value: number) => [`€${value.toLocaleString()}`, 'Revenue']}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <h3 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h3>
                <div className="space-y-4">
                {recentActivity.slice(0, 6).map((activity, index) => {
                  const iconMap: Record<string, any> = {
                    'FileText': FileText,
                    'Building': Building,
                    'Users': Users,
                    'Activity': Activity
                  };
                  const IconComponent = iconMap[activity.icon] || Activity;
                  const colorMap: Record<string, string> = {
                    'contract': 'bg-emerald-500',
                    'merchant': 'bg-blue-500',
                    'system': 'bg-purple-500',
                    'user': 'bg-amber-500'
                  };

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/30 cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => {
                        if (activity.type === 'contract') {
                          navigate('/admin/contracts');
                        } else if (activity.type === 'merchant') {
                          navigate('/admin/merchants');
                        }
                      }}
                    >
                      <div className={`w-8 h-8 rounded-full ${colorMap[activity.type]} flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {new Date(activity.timestamp).toLocaleDateString('sk-SK', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      onClick={() => handleQuickAction(action.action)}
                      className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95`}
                    >
                      <action.icon className="w-5 h-5 mb-2 mx-auto" />
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4">Performance</h3>
                <div className="space-y-4">
                  {[
                    { 
                      label: 'Avg Profit/Merchant', 
                      value: Math.min((businessMetrics?.avgProfitPerMerchant || 0) / 100, 100), 
                      display: `€${businessMetrics?.avgProfitPerMerchant?.toLocaleString() || '0'}`,
                      color: 'bg-blue-500' 
                    },
                    { 
                      label: 'Contract Success Rate', 
                      value: businessMetrics ? Math.min((businessMetrics.activeContracts / Math.max(businessMetrics.totalMerchants, 1)) * 100, 100) : 0,
                      display: `${businessMetrics ? Math.round((businessMetrics.activeContracts / Math.max(businessMetrics.totalMerchants, 1)) * 100) : 0}%`,
                      color: 'bg-emerald-500' 
                    },
                    { 
                      label: 'Total Turnover', 
                      value: Math.min((businessMetrics?.totalTurnover || 0) / 1000000 * 100, 100),
                      display: `€${businessMetrics?.totalTurnover?.toLocaleString() || '0'}`,
                      color: 'bg-violet-500' 
                    },
                    { 
                      label: 'Growth Rate', 
                      value: Math.min(Math.abs(businessMetrics?.merchantGrowth || 0), 100),
                      display: `${businessMetrics?.merchantGrowth?.toFixed(1) || 0}%`,
                      color: 'bg-orange-500' 
                    }
                  ].map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{metric.label}</span>
                        <span className="font-medium text-foreground">{metric.display}</span>
                      </div>
                      <Progress 
                        value={metric.value} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Team Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4">Team Overview</h3>
                <div className="space-y-3">
                  {[
                    { 
                      name: 'Active Users', 
                      members: teamData?.activeUsers || 0, 
                      status: 'online', 
                      color: 'bg-emerald-500' 
                    },
                    { 
                      name: 'Admin Users', 
                      members: teamData?.adminUsers || 0, 
                      status: 'active', 
                      color: 'bg-blue-500' 
                    },
                    { 
                      name: 'Partner Users', 
                      members: teamData?.partnerUsers || 0, 
                      status: 'active', 
                      color: 'bg-purple-500' 
                    },
                    { 
                      name: 'Organizations', 
                      members: teamData?.totalOrganizations || 0, 
                      status: 'registered', 
                      color: 'bg-cyan-500' 
                    }
                  ].map((team, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${team.color}`} />
                        <div>
                          <p className="font-medium text-sm text-foreground">{team.name}</p>
                          <p className="text-xs text-muted-foreground">{team.members} {team.name.toLowerCase().includes('organization') ? 'total' : 'users'}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {team.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Floating Action Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          className="fixed bottom-6 right-6"
        >
          <Button 
            size="lg"
            onClick={() => handleQuickAction('New Contract')}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default DesignDashboardPage;
