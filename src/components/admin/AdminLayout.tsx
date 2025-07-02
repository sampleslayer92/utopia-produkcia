
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const AdminLayout = ({ title, subtitle, actions, children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30">
        <AdminSidebar />
        
        <SidebarInset className="flex flex-col">
          <AdminHeader title={title} subtitle={subtitle} actions={actions} />
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
