
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PerformanceMonitor from './PerformanceMonitor';
import ErrorRecoverySystem from './ErrorRecoverySystem';
import TeamManagement from './TeamManagement';
import { Activity, AlertTriangle, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboardTabs = () => {
  const { userRole } = useAuth();
  const isAdmin = userRole?.role === 'admin';

  return (
    <Tabs defaultValue="performance" className="w-full">
      <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <TabsTrigger value="performance" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Výkonnostné metriky
        </TabsTrigger>
        <TabsTrigger value="errors" className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Error Recovery
        </TabsTrigger>
        {isAdmin && (
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Správa tímu
          </TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="performance" className="mt-6">
        <PerformanceMonitor />
      </TabsContent>
      
      <TabsContent value="errors" className="mt-6">
        <ErrorRecoverySystem />
      </TabsContent>
      
      {isAdmin && (
        <TabsContent value="team" className="mt-6">
          <TeamManagement />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default AdminDashboardTabs;
