
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";

const PageBreadcrumbs = () => {
  const location = useLocation();
  const { t } = useTranslation('admin');

  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const items = [];
    
    // Home
    items.push({
      label: t('navigation.dashboard'),
      path: '/admin',
      isHome: true
    });

    // Current sections
    if (pathSegments.includes('deals')) {
      items.push({ label: t('navigation.businessProcesses'), path: '/admin/deals' });
    }
    if (pathSegments.includes('overview')) {
      items.push({ label: t('navigation.overview'), path: '/admin/overview' });
    }
    if (pathSegments.includes('contracts')) {
      items.push({ label: t('navigation.contracts'), path: '/admin/contracts' });
    }
    if (pathSegments.includes('merchants')) {
      items.push({ label: t('navigation.merchants'), path: '/admin/merchants' });
    }
    if (pathSegments.includes('users')) {
      items.push({ label: t('navigation.users'), path: '/admin/users' });
    }
    if (pathSegments.includes('settings')) {
      items.push({ label: t('navigation.profileSettings'), path: '/admin/settings' });
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <div className="sticky top-[60px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-2">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <div key={item.path} className="flex items-center gap-1">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {index === breadcrumbItems.length - 1 ? (
                  <BreadcrumbPage className="flex items-center gap-1">
                    {item.isHome && <Home className="h-3 w-3" />}
                    <span className="text-sm">{item.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.path} className="flex items-center gap-1">
                    {item.isHome && <Home className="h-3 w-3" />}
                    <span className="text-sm">{item.label}</span>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default PageBreadcrumbs;
