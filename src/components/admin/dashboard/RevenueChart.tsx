
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useTranslation } from 'react-i18next';
import { TrendingUp, BarChart3, ArrowUpRight } from "lucide-react";
import { useRevenueData } from "@/hooks/useRevenueData";
import { CircularProgress } from "@/components/ui/circular-progress";

const RevenueChart = () => {
  const { t } = useTranslation('admin');
  const { data: revenueData, isLoading } = useRevenueData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          {t('dashboard.revenue.title')}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-border/50 bg-card">
            <CardContent className="p-8">
              <div className="h-80 animate-pulse bg-muted rounded-xl"></div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card">
            <CardContent className="p-8">
              <div className="h-80 animate-pulse bg-muted rounded-xl"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate total values for summary cards
  const totalRevenue = revenueData?.monthlyTrend?.reduce((sum, item) => sum + item.revenue, 0) || 0;
  const totalProfit = revenueData?.profitTrend?.reduce((sum, item) => sum + item.profit, 0) || 0;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {t('dashboard.revenue.title')}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 border-border/50 bg-card hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-foreground">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                {t('dashboard.revenue.monthlyTrend')}
              </div>
              <div className="flex items-center text-sm text-primary">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +12.5%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={revenueData?.monthlyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `€${value}`}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => [`€${value.toLocaleString()}`, t('dashboard.revenue.revenue')]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 6 }}
                  activeDot={{ r: 8, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="space-y-6">
          {/* Total Revenue Card */}
          <Card className="border-border/50 bg-card-dark text-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CircularProgress
                  value={85}
                  size="sm"
                  color="lime"
                  showValue={false}
                />
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  €{totalRevenue.toLocaleString()}
                </div>
                <div className="text-white/70 text-sm font-medium">
                  Total Revenue
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profit Margin Card */}
          <Card className="border-border/50 bg-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <CircularProgress
                  value={profitMargin}
                  size="sm"
                  color="yellow"
                  showValue={false}
                />
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {profitMargin.toFixed(1)}%
                </div>
                <div className="text-muted-foreground text-sm font-medium">
                  Profit Margin
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Profit Card */}
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div className="text-sm text-primary font-medium">
                  +8.3%
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  €{totalProfit.toLocaleString()}
                </div>
                <div className="text-muted-foreground text-sm font-medium">
                  Total Profit
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
