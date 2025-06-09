
import { Clock, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { OpeningHours } from "@/types/onboarding";

interface OpeningHoursSummaryProps {
  openingHours: OpeningHours[];
  onEdit: () => void;
}

const OpeningHoursSummary = ({ openingHours, onEdit }: OpeningHoursSummaryProps) => {
  const { t } = useTranslation('forms');

  const daysMap = {
    "Po": t('businessLocation.openingHours.days.pondelok'),
    "Ut": t('businessLocation.openingHours.days.utorok'), 
    "St": t('businessLocation.openingHours.days.streda'),
    "Št": t('businessLocation.openingHours.days.stvrtok'),
    "Pi": t('businessLocation.openingHours.days.piatok'),
    "So": t('businessLocation.openingHours.days.sobota'),
    "Ne": t('businessLocation.openingHours.days.nedela')
  };

  const openDays = openingHours.filter(h => h.otvorene);
  const closedDays = openingHours.filter(h => !h.otvorene);

  // Group days with same hours
  const groupedHours = openDays.reduce((acc, day) => {
    const timeKey = `${day.open}-${day.close}`;
    if (!acc[timeKey]) {
      acc[timeKey] = [];
    }
    acc[timeKey].push(day.day);
    return acc;
  }, {} as Record<string, OpeningHours['day'][]>);

  if (openDays.length === 0) {
    return (
      <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600">{t('businessLocation.openingHours.title')}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="text-xs"
          >
            <Edit3 className="h-3 w-3 mr-1" />
            {t('businessLocation.openingHours.setButton')}
          </Button>
        </div>
        <p className="text-sm text-slate-500 mt-2">{t('businessLocation.openingHours.closedAllDays')}</p>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-slate-700">{t('businessLocation.openingHours.title')}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="text-xs"
        >
          <Edit3 className="h-3 w-3 mr-1" />
          {t('businessLocation.openingHours.editButton')}
        </Button>
      </div>

      <div className="space-y-2">
        {Object.entries(groupedHours).map(([timeRange, days]) => {
          const [open, close] = timeRange.split('-');
          const dayLabels = days.map(day => day).join(', ');
          
          return (
            <div key={timeRange} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs px-2 py-1">
                  {dayLabels}
                </Badge>
              </div>
              <span className="text-slate-600 font-mono">
                {open} - {close}
              </span>
            </div>
          );
        })}
        
        {closedDays.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs px-2 py-1">
                {closedDays.map(day => day.day).join(', ')}
              </Badge>
            </div>
            <span className="text-slate-500 italic">{t('businessLocation.openingHours.closed')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpeningHoursSummary;
