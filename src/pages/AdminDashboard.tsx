
import EnhancedContractsTable from "@/components/admin/EnhancedContractsTable";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import DashboardSidebar from "@/components/admin/dashboard/DashboardSidebar";
import { useContractsStats } from "@/hooks/useContractsData";

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useContractsStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <div className="flex-1 p-6">
          <StatsCards stats={stats} statsLoading={statsLoading} />

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Enhanced Contracts Table */}
            <div className="lg:col-span-3">
              <EnhancedContractsTable />
            </div>

            {/* Sidebar with alerts and actions */}
            <div className="lg:col-span-1">
              <DashboardSidebar stats={stats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
