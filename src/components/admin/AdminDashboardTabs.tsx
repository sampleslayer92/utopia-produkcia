
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PerformanceMonitor from './PerformanceMonitor';
import ErrorRecoverySystem from './ErrorRecoverySystem';
import { Activity, AlertTriangle } from 'lucide-react';

const AdminDashboardTabs = () => {
  return (
    <Tabs defaultValue="performance" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="performance" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Výkonnostné metriky
        </TabsTrigger>
        <TabsTrigger value="errors" className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Error Recovery
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="performance" className="mt-6">
        <PerformanceMonitor />
      </TabsContent>
      
      <TabsContent value="errors" className="mt-6">
        <ErrorRecoverySystem />
      </TabsContent>
    </Tabs>
  );
};

export default AdminDashboardTabs;
