
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useTranslation } from 'react-i18next';
import { TrendingUp, BarChart3 } from "lucide-react";
import { useRevenueData } from "@/hooks/useRevenueData";

const RevenueChart = () => {
  const { t } = useTranslation('admin');
  const { data: revenueData, isLoading } = useRevenueData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-elevation-2">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              {t('dashboard.revenue.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 animate-pulse bg-muted rounded"></div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-elevation-2">
          <CardContent className="p-6">
            <div className="h-80 animate-pulse bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card border-border shadow-elevation-2">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            {t('dashboard.revenue.monthlyTrend')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData?.monthlyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`€${value.toLocaleString()}`, t('dashboard.revenue.revenue')]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card-dark border-card-dark shadow-elevation-2">
        <CardHeader>
          <CardTitle className="flex items-center text-card-dark-foreground">
            <BarChart3 className="h-5 w-5 mr-2 text-accent" />
            {t('dashboard.revenue.profitByMonth')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData?.profitTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--card-dark-foreground) / 0.2)" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--card-dark-foreground) / 0.7)"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--card-dark-foreground) / 0.7)"
                fontSize={12}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`€${value.toLocaleString()}`, t('dashboard.revenue.profit')]}
                labelStyle={{ color: 'hsl(var(--card-dark-foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card-dark))', 
                  border: '1px solid hsl(var(--card-dark-foreground) / 0.2)',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="profit" 
                fill="hsl(var(--accent))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueChart;
