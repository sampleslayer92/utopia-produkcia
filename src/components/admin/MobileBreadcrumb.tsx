import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface MobileBreadcrumbProps {
  title: string;
}

const MobileBreadcrumb = ({ title }: MobileBreadcrumbProps) => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const location = useLocation();

  const getParentPath = () => {
    if (location.pathname.includes('/contract/')) {
      return '/admin/merchants/contracts';
    }
    if (location.pathname.includes('/merchant/')) {
      return '/admin/merchants';
    }
    if (location.pathname.includes('/organizations/teams')) {
      return '/admin/organizations';
    }
    if (location.pathname.includes('/team/')) {
      return '/admin/team';
    }
    return '/admin';
  };

  const getParentLabel = () => {
    if (location.pathname.includes('/contract/')) {
      return t('navigation.contracts');
    }
    if (location.pathname.includes('/merchant/')) {
      return t('navigation.merchants');
    }
    if (location.pathname.includes('/organizations')) {
      return t('navigation.organizations');
    }
    if (location.pathname.includes('/team/')) {
      return t('navigation.teamManagement');
    }
    return t('navigation.dashboard');
  };

  return (
    <div className="flex items-center gap-2 md:hidden mb-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(getParentPath())}
        className="min-h-touch min-w-touch p-1 h-auto"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Späť na {getParentLabel()}</span>
      </Button>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{getParentLabel()}</span>
        <span>/</span>
        <span className="text-foreground font-medium truncate">{title}</span>
      </div>
    </div>
  );
};

export default MobileBreadcrumb;