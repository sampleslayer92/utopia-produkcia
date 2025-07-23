import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileActionMenuProps {
  children: React.ReactNode[];
  maxVisibleActions?: number;
  singleActionMode?: boolean;
}

const MobileActionMenu = ({ children, maxVisibleActions = 3, singleActionMode = false }: MobileActionMenuProps) => {
  const isMobile = useIsMobile();
  
  if (!isMobile || !children || children.length === 0) {
    // On desktop or when no actions, show all actions normally
    return <div className="flex items-center gap-1 md:gap-2">{children}</div>;
  }

  // Single action mode for mobile - show only + button with dropdown
  if (singleActionMode || children.length > 1) {
    return (
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="min-h-touch min-w-touch h-11 w-11 p-0 bg-background border-border hover:bg-accent">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Možnosti</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover border-border shadow-md">
            {children.map((action, index) => (
              <DropdownMenuItem key={index} asChild className="cursor-pointer hover:bg-accent focus:bg-accent">
                <div className="w-full min-h-touch flex items-center">
                  {action}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // For single action, show it directly
  return <div className="flex items-center gap-1">{children}</div>;
};

export default MobileActionMenu;