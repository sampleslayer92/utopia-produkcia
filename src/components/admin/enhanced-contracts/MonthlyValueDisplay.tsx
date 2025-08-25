
import { useTranslation } from 'react-i18next';

interface MonthlyValueDisplayProps {
  value: number;
}

const MonthlyValueDisplay = ({ value }: MonthlyValueDisplayProps) => {
  const { t } = useTranslation('admin');

  const getValueColor = (value: number) => {
    if (value >= 1000) return 'text-green-600 font-semibold';
    if (value >= 500) return 'text-blue-600 font-medium';
    if (value >= 100) return 'text-slate-900';
    return 'text-slate-600';
  };

  return (
    <div className="text-right">
      <div className={`${getValueColor(value)}`}>
        €{value.toFixed(2)}
      </div>
      <div className="text-xs text-muted-foreground">
        {t('contracts.table.monthly')}
      </div>
    </div>
  );
};

export default MonthlyValueDisplay;
