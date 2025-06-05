
import EnhancedAdminTable from "@/components/admin/EnhancedAdminTable";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import { useContractsStats } from "@/hooks/useContractsData";

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useContractsStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <div className="flex-1 p-6">
          <StatsCards stats={stats} statsLoading={statsLoading} />
          <EnhancedAdminTable />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
