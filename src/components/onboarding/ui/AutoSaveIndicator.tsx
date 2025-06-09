
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Check, Loader2, AlertCircle } from "lucide-react";

interface AutoSaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
}

const AutoSaveIndicator = ({ status, lastSaved }: AutoSaveIndicatorProps) => {
  const { t } = useTranslation();

  if (status === 'idle') return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          text: t('onboarding.autoSave.saving'),
          className: 'text-blue-600'
        };
      case 'saved':
        return {
          icon: <Check className="h-3 w-3" />,
          text: t('onboarding.autoSave.saved'),
          className: 'text-green-600'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: t('onboarding.autoSave.error'),
          className: 'text-red-600'
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className={`flex items-center gap-2 text-xs ${config.className}`}>
      {config.icon}
      <span>{config.text}</span>
      {status === 'saved' && lastSaved && (
        <span className="text-slate-500">
          {t('onboarding.autoSave.lastSaved', { 
            time: format(lastSaved, 'HH:mm:ss') 
          })}
        </span>
      )}
    </div>
  );
};

export default AutoSaveIndicator;
