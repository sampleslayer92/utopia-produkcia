
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
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-900">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            {t('dashboard.revenue.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 animate-pulse bg-slate-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-900">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            {t('dashboard.revenue.monthlyTrend')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData?.monthlyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`€${value.toLocaleString()}`, t('dashboard.revenue.revenue')]}
                labelStyle={{ color: '#1e293b' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-900">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            {t('dashboard.revenue.profitByMonth')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData?.profitTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`€${value.toLocaleString()}`, t('dashboard.revenue.profit')]}
                labelStyle={{ color: '#1e293b' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="profit" 
                fill="#3b82f6"
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
