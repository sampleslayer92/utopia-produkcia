import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatBotFloatingButtonProps {
  isOpen: boolean;
  hasNewMessage: boolean;
  onClick: () => void;
}

const ChatBotFloatingButton = ({ isOpen, hasNewMessage, onClick }: ChatBotFloatingButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        hasNewMessage && !isOpen && "animate-pulse"
      )}
      size="icon"
    >
      {hasNewMessage && !isOpen && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-ping" />
      )}
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <MessageCircle className="h-6 w-6" />
      )}
    </Button>
  );
};

export default ChatBotFloatingButton;