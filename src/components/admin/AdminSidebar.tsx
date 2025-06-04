
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3,
  Building,
  CreditCard
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
      active: location.pathname === "/admin"
    },
    {
      title: "Zmluvy",
      icon: FileText,
      path: "/admin/contracts",
      active: location.pathname.startsWith("/admin/contract")
    },
    {
      title: "Klienti",
      icon: Users,
      path: "/admin/clients",
      active: false
    },
    {
      title: "Reporty",
      icon: BarChart3,
      path: "/admin/reports",
      active: false
    },
    {
      title: "Nastavenia",
      icon: Settings,
      path: "/admin/settings",
      active: false
    }
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-slate-200">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <img 
            src="https://cdn.prod.website-files.com/65bb58bd9feeda1fd2e1b551/65bb58bd9feeda1fd2e1b5ad_logo-header.svg" 
            alt="Logo" 
            className="h-10 w-auto"
          />
          <div>
            <h2 className="text-lg font-bold text-slate-900">Admin</h2>
            <p className="text-xs text-slate-600">Control Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
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

      {/* Quick Stats */}
      <div className="p-4 mt-8">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center space-x-3">
            <Building className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-medium text-slate-900">Rýchly prehľad</h3>
              <p className="text-sm text-slate-600">Systém funguje správne</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminSidebar;
