
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  isCompact?: boolean;
}

const AdminHeader = ({ title, subtitle, actions, isCompact = false }: AdminHeaderProps) => {
  const location = useLocation();
  const { t } = useTranslation('admin');

  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const items = [];
    
    // Home
    items.push({
      label: t('nav.dashboard'),
      path: '/admin',
      isHome: true
    });

    // Current sections
    if (pathSegments.includes('deals')) {
      items.push({ label: t('nav.deals'), path: '/admin/deals' });
    }
    if (pathSegments.includes('overview')) {
      items.push({ label: t('nav.overview'), path: '/admin/overview' });
    }
    if (pathSegments.includes('contracts')) {
      items.push({ label: t('nav.contracts'), path: '/admin/contracts' });
    }
    if (pathSegments.includes('users')) {
      items.push({ label: t('nav.users'), path: '/admin/users' });
    }
    if (pathSegments.includes('settings')) {
      items.push({ label: t('nav.settings'), path: '/admin/settings' });
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();
  const headerPadding = isCompact ? "px-3 py-2" : "px-4 py-3";
  const titleSize = isCompact ? "text-lg" : "text-xl";
  const subtitleSize = isCompact ? "text-xs" : "text-sm";

  return (
    <header className={`sticky top-0 z-40 flex h-auto shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${headerPadding}`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        
        {/* Breadcrumb */}
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <div key={item.path} className="flex items-center gap-1">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === breadcrumbItems.length - 1 ? (
                    <BreadcrumbPage className="flex items-center gap-1">
                      {item.isHome && <Home className="h-3 w-3" />}
                      <span className={isCompact ? "text-xs" : "text-sm"}>{item.label}</span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.path} className="flex items-center gap-1">
                      {item.isHome && <Home className="h-3 w-3" />}
                      <span className={isCompact ? "text-xs" : "text-sm"}>{item.label}</span>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title - Mobile */}
        <div className="flex flex-col md:hidden min-w-0">
          <h1 className={`font-semibold ${titleSize} truncate`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`text-muted-foreground ${subtitleSize} truncate`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Page Title - Desktop */}
      <div className="hidden md:flex flex-col items-center flex-1 min-w-0">
        <h1 className={`font-semibold ${titleSize} text-center truncate w-full`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`text-muted-foreground ${subtitleSize} text-center truncate w-full`}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex items-center gap-1">
          {actions}
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
