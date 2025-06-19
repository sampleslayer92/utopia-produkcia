
import { useTranslation } from 'react-i18next';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

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

    if (location.pathname.includes('/contract/') && location.pathname.includes('/edit')) {
      breadcrumbs.push({ label: t('breadcrumbs.editContract'), href: '#' });
    }

    if (location.pathname.includes('/contract/') && location.pathname.includes('/view')) {
      breadcrumbs.push({ label: t('breadcrumbs.viewContract'), href: '#' });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="px-6 py-4">
        {/* Breadcrumbs */}
        <div className="mb-3">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <BreadcrumbItem key={index}>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="text-slate-900 font-medium">
                      {breadcrumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <>
                      <BreadcrumbLink
                        href={breadcrumb.href}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        {breadcrumb.label}
                      </BreadcrumbLink>
                      <BreadcrumbSeparator />
                    </>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Content */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            
            {/* Dynamic Actions */}
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
