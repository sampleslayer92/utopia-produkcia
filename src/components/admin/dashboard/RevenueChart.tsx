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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Monthly Revenue Chart */}
      <Card className="glass-card-solid hover-lift border-0 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t('dashboard.charts.monthlyRevenue')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyTrend}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="1 1" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => [`€${value.toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Profit Chart */}
      <Card className="glass-card-solid hover-lift border-0 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {t('dashboard.charts.monthlyProfit')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.profitTrend} barCategoryGap="25%">
                <defs>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary-light))" stopOpacity={1}/>
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="1 1" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number) => [`€${value.toLocaleString()}`, 'Profit']}
                />
                <Bar
                  dataKey="profit"
                  fill="url(#profitGradient)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueChart;