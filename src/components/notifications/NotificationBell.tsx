
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NotificationDropdown } from './NotificationDropdown';
import { useNotifications } from '@/hooks/useNotifications';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size={isMobile ? "mobile-icon" : "icon"}
          className={cn(
            "relative transition-all duration-200",
            isMobile ? "h-11 w-11 p-0" : "h-9 w-9 p-0"
          )}
        >
          <Bell className={cn(
            "transition-all duration-200",
            isMobile ? "h-5 w-5" : "h-4 w-4"
          )} />
          {unreadCount > 0 && (
            <span className={cn(
              "absolute rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center transition-all duration-200",
              isMobile 
                ? "-top-1 -right-1 h-6 w-6 min-w-6" 
                : "-top-1 -right-1 h-5 w-5 min-w-5"
            )}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "p-0 shadow-lg border-border bg-popover",
          isMobile ? "w-[90vw] max-w-sm" : "w-80"
        )} 
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <NotificationDropdown onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};
