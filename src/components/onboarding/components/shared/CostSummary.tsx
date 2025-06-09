
import { formatCurrencyWithColor } from "../../utils/currencyUtils";
import { useTranslation } from "react-i18next";

interface CostSummaryProps {
  mainSubtotal: number;
  addonsSubtotal: number;
  totalSubtotal: number;
}

const CostSummary = ({ mainSubtotal, addonsSubtotal, totalSubtotal }: CostSummaryProps) => {
  const { t } = useTranslation('forms');
  
  const mainSubtotalFormatted = formatCurrencyWithColor(mainSubtotal);
  const addonsSubtotalFormatted = formatCurrencyWithColor(addonsSubtotal);
  const totalSubtotalFormatted = formatCurrencyWithColor(totalSubtotal);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 border border-blue-200">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-slate-700">{t('deviceSelection.cards.mainItem')}</span>
          <span className={`font-medium ${mainSubtotalFormatted.className}`}>
            {mainSubtotalFormatted.value}
          </span>
        </div>
        {addonsSubtotal > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-slate-700">{t('deviceSelection.cards.addons')}</span>
            <span className={`font-medium ${addonsSubtotalFormatted.className}`}>
              {addonsSubtotalFormatted.value}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center border-t pt-2">
          <span className="font-bold text-slate-900">{t('deviceSelection.cards.total')}</span>
          <span className={`font-bold text-xl ${totalSubtotalFormatted.className || 'text-green-600'}`}>
            {totalSubtotalFormatted.value}{t('deviceSelection.cards.perMonth')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CostSummary;
