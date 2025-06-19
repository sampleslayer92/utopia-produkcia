
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import NewDashboardContent from "@/components/admin/dashboard/NewDashboardContent";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <NewDashboardContent />
      </div>
    </div>
  );
};

export default AdminDashboard;
