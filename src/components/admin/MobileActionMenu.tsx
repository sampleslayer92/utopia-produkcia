import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileActionMenuProps {
  children: React.ReactNode[];
  maxVisibleActions?: number;
}

const MobileActionMenu = ({ children, maxVisibleActions = 3 }: MobileActionMenuProps) => {
  const isMobile = useIsMobile();
  
  if (!isMobile || !children || children.length <= maxVisibleActions) {
    // On desktop or when we have few actions, show all actions normally
    return <div className="flex items-center gap-1 md:gap-2">{children}</div>;
  }

  // On mobile with many actions, show first few actions + overflow menu
  const visibleActions = children.slice(0, maxVisibleActions);
  const hiddenActions = children.slice(maxVisibleActions);

  return (
    <div className="flex items-center gap-1">
      {/* Show first few actions directly */}
      <div className="flex items-center gap-1">
        {visibleActions}
      </div>
      
      {/* Overflow menu for remaining actions */}
      {hiddenActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="min-h-touch min-w-touch h-11 w-11 p-0 bg-background border-border hover:bg-accent">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Viac možností</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover border-border shadow-md">
            {hiddenActions.map((action, index) => (
              <DropdownMenuItem key={index} asChild className="cursor-pointer hover:bg-accent focus:bg-accent">
                <div className="w-full min-h-touch flex items-center">
                  {action}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default MobileActionMenu;