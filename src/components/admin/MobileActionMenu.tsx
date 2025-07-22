
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileActionMenuProps {
  children: React.ReactNode[];
  maxVisibleActions?: number;
  singleActionMode?: boolean;
}

const MobileActionMenu = ({ children, maxVisibleActions = 3, singleActionMode = false }: MobileActionMenuProps) => {
  const isMobile = useIsMobile();
  
  if (!isMobile || !children || children.length === 0) {
    // On desktop or when no actions, show all actions normally
    return <div className="flex items-center gap-2">{children}</div>;
  }

  // Single action mode for mobile - show only + button with dropdown
  if (singleActionMode || children.length > 1) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="secondary-action" 
              size="mobile-icon"
              className="shadow-sm border-gray-200 bg-white hover:bg-gray-50"
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className={cn(
              "w-56 bg-white border-gray-200 shadow-lg rounded-lg p-1",
              "animate-in slide-in-from-top-2 duration-200"
            )}
          >
            {children.map((action, index) => (
              <DropdownMenuItem 
                key={index} 
                asChild 
                className={cn(
                  "cursor-pointer rounded-md p-3 min-h-touch",
                  "hover:bg-gray-50 focus:bg-gray-50 transition-colors",
                  "flex items-center w-full"
                )}
              >
                <div className="w-full flex items-center">
                  {action}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // For single action, show it directly with mobile styling
  return (
    <div className="flex items-center gap-2">
      {children.map((child, index) => (
        <div key={index} className="[&>button]:min-h-touch [&>button]:min-w-touch">
          {child}
        </div>
      ))}
    </div>
  );
};

export default MobileActionMenu;
