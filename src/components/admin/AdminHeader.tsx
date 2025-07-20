
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  isCompact?: boolean;
}

const AdminHeader = ({ title, subtitle, actions, isCompact = false }: AdminHeaderProps) => {
  const headerPadding = isCompact ? "px-3 py-2" : "px-4 py-3";

  return (
    <header className={`sticky top-0 z-50 flex h-auto shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${headerPadding}`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        
        {/* Page Title - Left aligned */}
        <div className="flex flex-col min-w-0">
          <h1 className={`font-semibold text-left truncate ${isCompact ? 'text-lg' : 'text-xl'}`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`text-muted-foreground text-left truncate ${isCompact ? 'text-xs' : 'text-sm'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex items-center gap-2 ml-4">
          {actions}
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
