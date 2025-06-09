
import { AddonCard } from "@/types/onboarding";
import { getAddonIcon } from "../../config/addonCatalog";
import { formatCurrencyWithColor } from "../../utils/currencyUtils";
import { useTranslation } from "react-i18next";

interface AddonsSectionProps {
  addons: AddonCard[];
  deviceCount: number;
}

const AddonsSection = ({ addons, deviceCount }: AddonsSectionProps) => {
  const { t } = useTranslation('forms');

  if (!addons || addons.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-4">
      <h5 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
        🔧 {t('deviceSelection.cards.addonsTitle')} ({addons.length})
      </h5>
      <div className="space-y-2">
        {addons.map((addon: AddonCard) => {
          const quantity = addon.isPerDevice ? deviceCount : (addon.customQuantity || 1);
          const subtotal = quantity * addon.monthlyFee;
          const subtotalFormatted = formatCurrencyWithColor(subtotal);
          
          return (
            <div key={addon.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getAddonIcon(addon.category)}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{addon.name}</p>
                    <p className="text-xs text-slate-600">
                      {t('deviceSelection.cards.count', { count: quantity })} x {addon.monthlyFee.toFixed(2)} €
                      {addon.isPerDevice && (
                        <span className="text-blue-600 ml-1">
                          {t('deviceSelection.cards.automatic')}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${subtotalFormatted.className || 'text-green-600'}`}>
                  {subtotalFormatted.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddonsSection;
