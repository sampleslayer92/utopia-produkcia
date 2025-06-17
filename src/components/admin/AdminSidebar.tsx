
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminProfile from "./AdminProfile";

const AdminSidebar = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: t('navigation.dashboard'),
      icon: LayoutDashboard,
      path: "/admin",
      active: location.pathname === "/admin"
    },
    {
      title: t('navigation.contracts'),
      icon: FileText,
      path: "/admin/contracts",
      active: location.pathname.startsWith("/admin/contract")
    },
    {
      title: t('navigation.clients'),
      icon: Users,
      path: "/admin/clients",
      active: false
    },
    {
      title: t('navigation.reports'),
      icon: BarChart3,
      path: "/admin/reports",
      active: false
    },
    {
      title: t('navigation.settings'),
      icon: Settings,
      path: "/admin/settings",
      active: false
    }
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col">
      {/* Logo only - simplified */}
      <div className="p-6 border-b border-slate-200 flex justify-center">
        <img 
          src="https://cdn.prod.website-files.com/65bb58bd9feeda1fd2e1b551/65bb58bd9feeda1fd2e1b5ad_logo-header.svg" 
          alt="Onepos Logo" 
          className="h-10 w-auto"
        />
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant={item.active ? "default" : "ghost"}
            onClick={() => navigate(item.path)}
            className={`w-full justify-start ${
              item.active 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "text-slate-700 hover:bg-slate-100"
            }`}
            disabled={!item.active && item.path !== "/admin"}
          >
            <item.icon className="h-4 w-4 mr-3" />
            {item.title}
          </Button>
        ))}
      </div>

      {/* Admin Profile at bottom */}
      <div className="p-4">
        <AdminProfile />
      </div>
    </div>
  );
};

export default AdminSidebar;
