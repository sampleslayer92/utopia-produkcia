
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import PageBreadcrumbs from "./PageBreadcrumbs";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showBreadcrumbs?: boolean;
  isCompact?: boolean;
}

const AdminLayout = ({ 
  children, 
  title, 
  subtitle, 
  actions,
  showBreadcrumbs = true,
  isCompact = false
}: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader 
            title={title}
            subtitle={subtitle}
            actions={actions}
            isCompact={isCompact}
          />
          {showBreadcrumbs && <PageBreadcrumbs />}
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
