
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StepAnalytics {
  step_name: string;
  avg_duration: number;
  completion_rate: number;
  total_attempts: number;
}

const PerformanceMonitor = () => {
  const [analytics, setAnalytics] = useState<StepAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('step_analytics')
        .select('*')
        .not('completed_at', 'is', null);

      if (error) throw error;

      // Process data to calculate metrics
      const stepStats = data?.reduce((acc: any, item) => {
        const stepName = item.step_name;
        if (!acc[stepName]) {
          acc[stepName] = {
            step_name: stepName,
            durations: [],
            completed: 0,
            total: 0
          };
        }
        
        acc[stepName].total++;
        if (item.completed_at) {
          acc[stepName].completed++;
          acc[stepName].durations.push(item.duration_seconds || 0);
        }
        
        return acc;
      }, {});

      const analyticsData = Object.values(stepStats || {}).map((step: any) => ({
        step_name: step.step_name,
        avg_duration: step.durations.length > 0 
          ? Math.round(step.durations.reduce((a: number, b: number) => a + b, 0) / step.durations.length)
          : 0,
        completion_rate: Math.round((step.completed / step.total) * 100),
        total_attempts: step.total
      }));

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Výkonnostné metriky</CardTitle>
          <CardDescription>Načítava sa...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const avgCompletionRate = analytics.length > 0 
    ? Math.round(analytics.reduce((sum, item) => sum + item.completion_rate, 0) / analytics.length)
    : 0;

  const slowestSteps = analytics
    .filter(step => step.avg_duration > 0)
    .sort((a, b) => b.avg_duration - a.avg_duration)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-slate-600">Priemerná doba dokončenia</p>
                <p className="text-2xl font-bold text-slate-900">
                  {analytics.length > 0 
                    ? Math.round(analytics.reduce((sum, item) => sum + item.avg_duration, 0) / analytics.length)
                    : 0}s
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-600">Miera dokončenia</p>
                <p className="text-2xl font-bold text-slate-900">{avgCompletionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-slate-600">Celkový počet krokov</p>
                <p className="text-2xl font-bold text-slate-900">{analytics.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Duration Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Priemerná doba trvania krokov</CardTitle>
          <CardDescription>Čas potrebný na dokončenie jednotlivých krokov onboardingu</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step_name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value}s`, 'Priemerná doba']}
                labelFormatter={(label) => `Krok: ${label}`}
              />
              <Bar dataKey="avg_duration" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Slowest Steps Alert */}
      {slowestSteps.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Najpomalšie kroky</CardTitle>
            <CardDescription className="text-orange-700">
              Kroky, ktoré si vyžadujú pozornosť kvôli dlhej dobe dokončenia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {slowestSteps.map((step, index) => (
                <div key={step.step_name} className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="font-medium">{step.step_name}</span>
                  <span className="text-orange-600 font-semibold">{step.avg_duration}s</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceMonitor;
