import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { TrendingUp, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from 'recharts';
import { useRevenueData } from "@/hooks/useRevenueData";

const RevenueChart = () => {
  const { t } = useTranslation('admin');
  const { data, isLoading } = useRevenueData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card-solid">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-xl animate-pulse"></div>
              <div className="h-5 bg-muted rounded w-1/3 animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-xl animate-pulse"></div>
          </CardContent>
        </Card>
        <Card className="glass-card-dark border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl animate-pulse"></div>
              <div className="h-5 bg-white/20 rounded w-1/3 animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-white/10 rounded-xl animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Revenue Trend */}
      <Card className="glass-card-solid hover-scale group">
        <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
        <CardHeader className="relative pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-bold text-foreground">
            <div className="p-2 rounded-xl gradient-primary">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            {t('dashboard.charts.monthlyRevenue')}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart data={data.monthlyTrend}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                fontWeight={500}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                fontWeight={500}
                tickFormatter={(value) => `€${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  backdropFilter: 'blur(8px)'
                }}
                formatter={(value: number) => [`€${value.toLocaleString()}`, t('dashboard.charts.revenue')]}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1}
                fill="url(#revenueGradient)"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: 'hsl(var(--primary))', strokeWidth: 2, fill: 'hsl(var(--primary-foreground))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Profit Chart */}
      <Card className="glass-card-dark hover-scale group border-0">
        <div className="absolute inset-0 gradient-accent opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" />
        <CardHeader className="relative pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-bold text-white">
            <div className="p-2 rounded-xl gradient-bright">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            {t('dashboard.charts.monthlyProfit')}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={data.profitTrend}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent-cyan))" stopOpacity={1}/>
                  <stop offset="95%" stopColor="hsl(var(--accent-cyan))" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="rgba(255,255,255,0.7)"
                fontSize={11}
                fontWeight={500}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.7)"
                fontSize={11}
                fontWeight={500}
                tickFormatter={(value) => `€${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--glass-dark-bg))',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-dark)',
                  backdropFilter: 'blur(8px)',
                  color: 'white'
                }}
                formatter={(value: number) => [`€${value.toLocaleString()}`, t('dashboard.charts.profit')]}
                labelStyle={{ color: 'white' }}
              />
              <Bar 
                dataKey="profit" 
                fill="url(#profitGradient)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueChart;