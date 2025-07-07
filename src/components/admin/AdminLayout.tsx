
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 safe-area-inset-top safe-area-inset-bottom">
        <AdminSidebar />
        
        <SidebarInset className="flex flex-col w-full">
          <AdminHeader title={title} subtitle={subtitle} actions={actions} />
          
          <main className="flex-1 p-3 md:p-6 safe-area-inset-left safe-area-inset-right">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
