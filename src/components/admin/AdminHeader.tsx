
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import MobileActionMenu from "./MobileActionMenu";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const AdminHeader = ({ title, subtitle, actions }: AdminHeaderProps) => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Parse actions into array for mobile handling
  const actionsArray = Array.isArray(actions) ? actions : actions ? [actions] : [];

  return (
    <header className={cn(
      "bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b border-border",
      "px-3 md:px-6 py-3 md:py-4"
    )}>
      {/* Header Content */}
      <div className="flex items-center justify-between gap-3 md:gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          <SidebarTrigger className={cn(
            "flex-shrink-0 transition-all duration-200",
            isMobile ? "min-h-touch min-w-touch h-11 w-11" : "h-9 w-9"
          )} />
          
          <div className="min-w-0 flex-1">
            <h1 className={cn(
              "font-bold text-foreground truncate tracking-tight",
              isMobile ? "text-xl" : "text-2xl"
            )}>
              {title}
            </h1>
            {subtitle && (
              <p className={cn(
                "text-muted-foreground mt-1 truncate leading-tight",
                isMobile ? "text-sm" : "text-base"
              )}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Section - Actions & Notifications */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Actions - Mobile optimized */}
          {actionsArray.length > 0 && (
            <MobileActionMenu singleActionMode={isMobile}>
              {actionsArray}
            </MobileActionMenu>
          )}
          
          {/* Notifications */}
          <NotificationBell />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
