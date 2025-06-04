
import { formatCurrency } from "../utils/currencyUtils";
import { AddonCard } from "@/types/onboarding";

interface CostBreakdownSummaryProps {
  mainItem: {
    name: string;
    count: number;
    monthlyFee: number;
    companyCost: number;
  };
  addons: AddonCard[];
}

const CostBreakdownSummary = ({ mainItem, addons }: CostBreakdownSummaryProps) => {
  const mainItemSubtotal = mainItem.count * mainItem.monthlyFee;
  const mainItemCompanyCost = mainItem.count * mainItem.companyCost;

  const addonsSubtotal = addons.reduce((sum, addon) => {
    const quantity = addon.customQuantity || 1;
    return sum + (quantity * addon.monthlyFee);
  }, 0);

  const addonsCompanyCost = addons.reduce((sum, addon) => {
    const quantity = addon.customQuantity || 1;
    return sum + (quantity * addon.companyCost);
  }, 0);

  const totalCustomer = mainItemSubtotal + addonsSubtotal;
  const totalCompany = mainItemCompanyCost + addonsCompanyCost;
  const margin = totalCustomer - totalCompany;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
      <h4 className="font-medium text-slate-900 mb-4">Súhrn nákladov</h4>
      
      <div className="space-y-3 text-sm">
        {/* Main item breakdown */}
        <div className="flex justify-between items-center">
          <span className="text-slate-700">
            Hlavná položka: ({mainItem.count} ks × {formatCurrency(mainItem.monthlyFee)})
          </span>
          <span className="font-medium">
            {formatCurrency(mainItemSubtotal)}
          </span>
        </div>

        {/* Addons breakdown */}
        {addons.length > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Doplnky:</span>
              <span className="font-medium">
                {formatCurrency(addonsSubtotal)}
              </span>
            </div>
            {addons.map((addon) => {
              const quantity = addon.customQuantity || 1;
              const subtotal = quantity * addon.monthlyFee;
              return (
                <div key={addon.id} className="flex justify-between items-center text-xs text-slate-600 ml-4">
                  <span>• {addon.name} ({quantity} ks × {formatCurrency(addon.monthlyFee)})</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-900">Subtotal zákazník:</span>
            <span className="font-bold text-lg text-blue-600">
              {formatCurrency(totalCustomer)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-900">Náklad firmy:</span>
            <span className="font-bold text-red-600">
              {formatCurrency(totalCompany)}
            </span>
          </div>
          
          <div className="flex justify-between items-center border-t pt-2">
            <span className="font-bold text-slate-900">Marža:</span>
            <span className={`font-bold text-xl ${margin < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(margin)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostBreakdownSummary;
