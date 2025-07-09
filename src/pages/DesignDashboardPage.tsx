import React from 'react';
import { motion } from 'framer-motion';
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
  Plus
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const DesignDashboardPage = () => {
  const stats = [
    { icon: Users, value: '2.8K', label: 'Active Users', change: '+12%', trend: 'up' },
    { icon: TrendingUp, value: '€15.2K', label: 'Revenue', change: '+8.2%', trend: 'up' },
    { icon: Activity, value: '94.5%', label: 'Performance', change: '+2.1%', trend: 'up' },
    { icon: Globe, value: '156', label: 'Countries', change: '+5', trend: 'up' }
  ];

  const activities = [
    { type: 'sale', user: 'Sarah Chen', action: 'completed a transaction', amount: '€245', time: '2 min ago', color: 'bg-emerald-500' },
    { type: 'user', user: 'Alex Morgan', action: 'joined the platform', time: '5 min ago', color: 'bg-blue-500' },
    { type: 'achievement', user: 'Maria Lopez', action: 'reached milestone', badge: 'Gold Member', time: '8 min ago', color: 'bg-amber-500' },
    { type: 'feature', user: 'System', action: 'deployed new update', version: 'v2.1.0', time: '12 min ago', color: 'bg-purple-500' }
  ];

  const quickActions = [
    { icon: Plus, label: 'New Project', color: 'from-violet-500 to-purple-600' },
    { icon: Users, label: 'Add Team', color: 'from-blue-500 to-cyan-500' },
    { icon: Rocket, label: 'Deploy', color: 'from-emerald-500 to-teal-500' },
    { icon: BarChart3, label: 'Analytics', color: 'from-orange-500 to-red-500' }
  ];

  return (
    <AdminLayout title="Design Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-cyan-50/20 p-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Design Dashboard 2025
              </h1>
              <p className="text-slate-600 mt-2">Modern interface with next-gen design patterns</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-violet-200 text-violet-700 hover:bg-violet-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Sparkles className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 bg-white/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${
                      index === 0 ? 'from-blue-500 to-cyan-500' :
                      index === 1 ? 'from-emerald-500 to-teal-500' :
                      index === 2 ? 'from-violet-500 to-purple-500' :
                      'from-orange-500 to-red-500'
                    } text-white`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className={`
                      ${stat.trend === 'up' ? 'text-emerald-700 border-emerald-200 bg-emerald-50' : 'text-red-700 border-red-200 bg-red-50'}
                    `}>
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      {stat.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-slate-600 text-sm">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 bg-white/70 backdrop-blur-xl border-0 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-800">Revenue Analytics</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">7D</Button>
                    <Button variant="outline" size="sm">30D</Button>
                    <Button size="sm" className="bg-violet-600 text-white">90D</Button>
                  </div>
                </div>
                
                {/* Mock Chart */}
                <div className="relative h-64 bg-gradient-to-t from-violet-50 to-transparent rounded-lg flex items-end justify-center">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.random() * 80 + 20}%` }}
                      transition={{ delay: 0.1 * i, duration: 0.5 }}
                      className={`w-8 mx-1 bg-gradient-to-t rounded-t ${
                        i % 3 === 0 ? 'from-violet-400 to-violet-600' :
                        i % 3 === 1 ? 'from-cyan-400 to-cyan-600' :
                        'from-purple-400 to-purple-600'
                      }`}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-white/70 backdrop-blur-xl border-0 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-800 mb-6">Live Activity</h3>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                    >
                      <div className={`w-3 h-3 rounded-full ${activity.color}`} />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium text-slate-800">{activity.user}</span>
                          <span className="text-slate-600"> {activity.action}</span>
                          {activity.amount && <span className="font-medium text-emerald-600"> {activity.amount}</span>}
                          {activity.badge && <Badge className="ml-2 bg-amber-100 text-amber-800">{activity.badge}</Badge>}
                          {activity.version && <code className="ml-2 px-2 py-1 bg-slate-200 rounded text-xs">{activity.version}</code>}
                        </p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
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
              <Card className="p-6 bg-white/70 backdrop-blur-xl border-0 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300`}
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
              <Card className="p-6 bg-white/70 backdrop-blur-xl border-0 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance</h3>
                <div className="space-y-4">
                  {[
                    { label: 'CPU Usage', value: 68, color: 'bg-blue-500' },
                    { label: 'Memory', value: 84, color: 'bg-emerald-500' },
                    { label: 'Storage', value: 42, color: 'bg-violet-500' },
                    { label: 'Network', value: 76, color: 'bg-orange-500' }
                  ].map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">{metric.label}</span>
                        <span className="font-medium">{metric.value}%</span>
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
              <Card className="p-6 bg-white/70 backdrop-blur-xl border-0 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Team Status</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Design Team', members: 8, status: 'active', color: 'bg-emerald-500' },
                    { name: 'Development', members: 12, status: 'active', color: 'bg-blue-500' },
                    { name: 'Marketing', members: 6, status: 'meeting', color: 'bg-amber-500' },
                    { name: 'Sales', members: 4, status: 'offline', color: 'bg-slate-400' }
                  ].map((team, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${team.color}`} />
                        <div>
                          <p className="font-medium text-sm">{team.name}</p>
                          <p className="text-xs text-slate-500">{team.members} members</p>
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
          className="fixed bottom-8 right-8"
        >
          <Button 
            size="lg"
            className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default DesignDashboardPage;