
import { useTranslation } from 'react-i18next';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";

import { SidebarTrigger } from "@/components/ui/sidebar";
import MobileActionMenu from "./MobileActionMenu";
import MobileBreadcrumb from "./MobileBreadcrumb";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const AdminHeader = ({ title, subtitle, actions }: AdminHeaderProps) => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: t('navigation.dashboard'), href: '/admin' }
    ];

    if (location.pathname.startsWith('/admin/contracts')) {
      breadcrumbs.push({ label: t('navigation.contracts'), href: '/admin/contracts' });
    }

    if (location.pathname.startsWith('/admin/merchants')) {
      breadcrumbs.push({ label: t('navigation.merchants'), href: '/admin/merchants' });
    }

    if (location.pathname.includes('/contract/') && location.pathname.includes('/edit')) {
      breadcrumbs.push({ label: t('breadcrumbs.editContract'), href: '#' });
    }

    if (location.pathname.includes('/contract/') && location.pathname.includes('/view')) {
      breadcrumbs.push({ label: t('breadcrumbs.viewContract'), href: '#' });
    }

    if (location.pathname.includes('/merchant/') && location.pathname.includes('/view')) {
      breadcrumbs.push({ label: t('breadcrumbs.viewMerchant'), href: '#' });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="px-3 md:px-6 py-2 md:py-4">
        {/* Desktop Breadcrumbs */}
        <div className="mb-2 md:mb-3 hidden md:block">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <BreadcrumbItem key={index}>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="text-foreground font-medium">
                      {breadcrumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <>
                      <BreadcrumbLink
                        asChild
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                        onClick={() => navigate(breadcrumb.href)}
                      >
                        <span>{breadcrumb.label}</span>
                      </BreadcrumbLink>
                      <BreadcrumbSeparator />
                    </>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Mobile Breadcrumb */}
        <MobileBreadcrumb title={title} />

        {/* Header Content */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            <SidebarTrigger className="min-h-touch min-w-touch flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs md:text-sm text-muted-foreground mt-1 truncate">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 md:space-x-3 flex-shrink-0">
            {/* Notifications */}
            <NotificationBell />
            
            {/* Dynamic Actions - Mobile-optimized with overflow menu */}
            <MobileActionMenu singleActionMode={true}>
              {Array.isArray(actions) ? actions : actions ? [actions] : []}
            </MobileActionMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
