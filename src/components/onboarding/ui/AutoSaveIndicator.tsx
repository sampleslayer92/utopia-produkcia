
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  className?: string;
}

const AutoSaveIndicator = ({ status, lastSaved, className }: AutoSaveIndicatorProps) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          text: 'Ukladá sa...',
          color: 'text-blue-600'
        };
      case 'saved':
        return {
          icon: <Check className="h-3 w-3" />,
          text: 'Uložené',
          color: 'text-green-600'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: 'Chyba pri ukladaní',
          color: 'text-red-600'
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();
  
  if (!statusInfo) return null;

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'práve teraz';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `pred ${minutes} min`;
    } else {
      return date.toLocaleTimeString('sk-SK', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  return (
    <div className={cn(
      'flex items-center space-x-1 text-xs',
      statusInfo.color,
      className
    )}>
      {statusInfo.icon}
      <span>{statusInfo.text}</span>
      {status === 'saved' && lastSaved && (
        <span className="text-slate-500">
          • {formatLastSaved(lastSaved)}
        </span>
      )}
    </div>
  );
};

export default AutoSaveIndicator;
