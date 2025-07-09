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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card-solid">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-xl animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] bg-muted rounded-xl animate-pulse"></div>
          </CardContent>
        </Card>
        <Card className="glass-card-solid">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-xl animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] bg-muted rounded-xl animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Monthly Revenue Trend */}
      <Card className="glass-card-solid hover-scale group">
        <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
            <div className="p-3 rounded-xl gradient-primary">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            {t('dashboard.charts.monthlyRevenue')}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <ResponsiveContainer width="100%" height={320}>
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
                fontSize={13}
                fontWeight={500}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={13}
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
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2, fill: 'hsl(var(--primary-foreground))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Profit Chart */}
      <Card className="glass-card-solid hover-scale group">
        <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
            <div className="p-3 rounded-xl gradient-primary">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            {t('dashboard.charts.monthlyProfit')}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.profitTrend}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={1}/>
                  <stop offset="95%" stopColor="hsl(var(--primary-light))" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={13}
                fontWeight={500}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={13}
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
                formatter={(value: number) => [`€${value.toLocaleString()}`, t('dashboard.charts.profit')]}
              />
              <Bar 
                dataKey="profit" 
                fill="url(#profitGradient)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueChart;