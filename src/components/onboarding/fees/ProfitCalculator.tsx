
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp } from "lucide-react";
import { OnboardingData, ItemBreakdown, AddonCard, DeviceCard, ServiceCard } from "@/types/onboarding";
import { formatCurrency, formatCurrencyWithColor, formatPercentage } from "../utils/currencyUtils";

interface ProfitCalculatorProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const ProfitCalculator = ({ data, updateData }: ProfitCalculatorProps) => {
  const [showResults, setShowResults] = useState(false);

  // Calculate monthly turnover from all business locations
  const monthlyTurnover = data.businessLocations.reduce(
    (sum, location) => sum + (location.estimatedTurnover || 0), 
    0
  );

  // Helper function to create item breakdown
  const createItemBreakdown = (card: DeviceCard | ServiceCard, isCustomerPrice: boolean): ItemBreakdown => {
    const unitPrice = isCustomerPrice ? card.monthlyFee : card.companyCost;
    const mainItem: ItemBreakdown = {
      id: card.id,
      name: card.name,
      count: card.count,
      unitPrice: unitPrice,
      subtotal: card.count * unitPrice,
      addons: []
    };

    // Add addons breakdown
    if (card.addons && card.addons.length > 0) {
      mainItem.addons = card.addons.map((addon: AddonCard) => {
        const addonUnitPrice = isCustomerPrice ? addon.monthlyFee : addon.companyCost;
        const addonQuantity = addon.isPerDevice ? card.count : (addon.customQuantity || 1);
        
        return {
          id: addon.id,
          name: addon.name,
          count: addonQuantity,
          unitPrice: addonUnitPrice,
          subtotal: addonQuantity * addonUnitPrice
        };
      });
    }

    return mainItem;
  };

  // Calculate total customer payments
  const calculateTotalCustomerPayments = () => {
    return data.deviceSelection.dynamicCards.reduce((sum, card) => {
      const mainItemTotal = card.count * card.monthlyFee;
      const addonsTotal = (card.addons || []).reduce((addonSum, addon) => {
        const quantity = addon.isPerDevice ? card.count : (addon.customQuantity || 1);
        return addonSum + (quantity * addon.monthlyFee);
      }, 0);
      return sum + mainItemTotal + addonsTotal;
    }, 0);
  };

  // Calculate total company costs
  const calculateTotalCompanyCosts = () => {
    return data.deviceSelection.dynamicCards.reduce((sum, card) => {
      const mainItemCost = card.count * card.companyCost;
      const addonsCost = (card.addons || []).reduce((addonSum, addon) => {
        const quantity = addon.isPerDevice ? card.count : (addon.customQuantity || 1);
        return addonSum + (quantity * addon.companyCost);
      }, 0);
      return sum + mainItemCost + addonsCost;
    }, 0);
  };

  const totalCustomerPayments = calculateTotalCustomerPayments();
  const totalCompanyCosts = calculateTotalCompanyCosts();

  // Calculate effective rates (subtract 0.2%)
  const effectiveRegulated = Math.max(0, data.fees.regulatedCards - 0.2);
  const effectiveUnregulated = Math.max(0, data.fees.unregulatedCards - 0.2);

  const updateFees = (field: keyof typeof data.fees, value: number) => {
    updateData({
      fees: {
        ...data.fees,
        [field]: value
      }
    });
    setShowResults(false);
  };

  const calculateProfit = () => {
    const regulatedFee = monthlyTurnover * (effectiveRegulated / 100);
    const unregulatedFee = monthlyTurnover * (effectiveUnregulated / 100);
    const transactionMargin = regulatedFee + unregulatedFee;
    const serviceMargin = totalCustomerPayments - totalCompanyCosts;
    const totalMonthlyProfit = transactionMargin + serviceMargin;

    // Create detailed breakdowns
    const customerPaymentBreakdown = data.deviceSelection.dynamicCards.map(card => 
      createItemBreakdown(card, true)
    );
    
    const companyCostBreakdown = data.deviceSelection.dynamicCards.map(card => 
      createItemBreakdown(card, false)
    );

    const calculatorResults = {
      monthlyTurnover,
      totalCustomerPayments,
      totalCompanyCosts,
      effectiveRegulated,
      effectiveUnregulated,
      regulatedFee,
      unregulatedFee,
      transactionMargin,
      serviceMargin,
      totalMonthlyProfit,
      customerPaymentBreakdown,
      companyCostBreakdown
    };

    updateData({
      fees: {
        ...data.fees,
        calculatorResults
      }
    });

    setShowResults(true);
  };

  const renderItemBreakdown = (items: ItemBreakdown[], title: string, isCustomerPayment: boolean) => (
    <Card className="bg-slate-50 border-slate-200 shadow-sm">
      <CardContent className="pt-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          {isCustomerPayment ? '💼' : '🔧'} {title}:
        </h3>
        <div className="space-y-3">
          {items.map((item) => {
            const itemSubtotalFormatted = formatCurrencyWithColor(item.subtotal);
            const totalWithAddons = item.subtotal + (item.addons?.reduce((sum, addon) => sum + addon.subtotal, 0) || 0);
            const totalFormatted = formatCurrencyWithColor(totalWithAddons);
            
            return (
              <div key={item.id} className="border-l-4 border-blue-200 pl-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">
                    📦 {item.name} ({item.count} ks x {formatCurrency(item.unitPrice)}):
                  </span>
                  <span className={`font-medium ${itemSubtotalFormatted.className}`}>
                    {itemSubtotalFormatted.value}
                  </span>
                </div>
                
                {item.addons && item.addons.map((addon) => {
                  const addonSubtotalFormatted = formatCurrencyWithColor(addon.subtotal);
                  return (
                    <div key={addon.id} className="flex justify-between items-center ml-4 mt-1">
                      <span className="text-xs text-slate-600">
                        🔧 {addon.name} ({addon.count} ks x {formatCurrency(addon.unitPrice)}):
                      </span>
                      <span className={`text-xs font-medium ${addonSubtotalFormatted.className}`}>
                        {addonSubtotalFormatted.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
          
          <div className="border-t pt-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">📦 Spolu:</span>
              <span className={`font-bold text-xl ${
                isCustomerPayment 
                  ? (formatCurrencyWithColor(items.reduce((sum, item) => {
                      return sum + item.subtotal + (item.addons?.reduce((addonSum, addon) => addonSum + addon.subtotal, 0) || 0);
                    }, 0)).className || 'text-blue-600')
                  : (formatCurrencyWithColor(items.reduce((sum, item) => {
                      return sum + item.subtotal + (item.addons?.reduce((addonSum, addon) => addonSum + addon.subtotal, 0) || 0);
                    }, 0)).className || 'text-red-600')
              }`}>
                {formatCurrency(items.reduce((sum, item) => {
                  return sum + item.subtotal + (item.addons?.reduce((addonSum, addon) => addonSum + addon.subtotal, 0) || 0);
                }, 0))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-green-600" />
          Kalkulačka výnosov a nákladov
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pre-filled inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-700">Odhadovaný mesačný obrat (EUR)</Label>
            <Input
              type="text"
              value={formatCurrency(monthlyTurnover)}
              readOnly
              className="bg-slate-50 border-slate-300"
            />
            <p className="text-xs text-slate-500">Predvyplnené z údajov prevádzkární</p>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700">Súčet mesačných poplatkov od klienta</Label>
            <Input
              type="text"
              value={formatCurrency(totalCustomerPayments)}
              readOnly
              className="bg-slate-50 border-slate-300"
            />
            <p className="text-xs text-slate-500">Spočítané zo zariadení a služieb</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700">Súčet mesačných nákladov pre firmu</Label>
          <Input
            type="text"
            value={formatCurrency(totalCompanyCosts)}
            readOnly
            className="bg-slate-50 border-slate-300"
          />
          <p className="text-xs text-slate-500">Reálne náklady na poskytovanie služieb</p>
        </div>

        {/* Fee inputs with effective rates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="regulatedCards">MIF++ regulované karty (%)</Label>
            <Input
              id="regulatedCards"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={data.fees.regulatedCards}
              onChange={(e) => updateFees('regulatedCards', parseFloat(e.target.value) || 0)}
              className="border-slate-300 focus:border-green-500"
              placeholder="0.90"
            />
            <p className="text-sm text-green-600">
              → Efektívna provízia: {formatPercentage(effectiveRegulated)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unregulatedCards">MIF++ neregulované karty (%)</Label>
            <Input
              id="unregulatedCards"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={data.fees.unregulatedCards}
              onChange={(e) => updateFees('unregulatedCards', parseFloat(e.target.value) || 0)}
              className="border-slate-300 focus:border-green-500"
              placeholder="1.50"
            />
            <p className="text-sm text-green-600">
              → Efektívna provízia: {formatPercentage(effectiveUnregulated)}
            </p>
          </div>
        </div>

        {/* Calculate button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={calculateProfit}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex items-center gap-2 px-8"
          >
            <TrendingUp className="h-4 w-4" />
            Vypočítať
          </Button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {showResults && data.fees.calculatorResults && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Detailed Payment Breakdown */}
              {renderItemBreakdown(
                data.fees.calculatorResults.customerPaymentBreakdown,
                "Mesačné platby od zákazníka",
                true
              )}

              {/* Detailed Cost Breakdown */}
              {renderItemBreakdown(
                data.fees.calculatorResults.companyCostBreakdown,
                "Vaše firemné náklady",
                false
              )}

              {/* Transaction Revenue */}
              <Card className="bg-slate-50 border-slate-200 shadow-md">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    💰 Tržba z transakcií:
                  </h3>
                  <div className="space-y-2 text-sm ml-4">
                    <div className="flex justify-between">
                      <span>• Odhadovaný obrat:</span>
                      <span className="font-medium">{formatCurrency(data.fees.calculatorResults.monthlyTurnover)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Regulované karty: {formatPercentage(data.fees.calculatorResults.effectiveRegulated)} →</span>
                      <span className={`font-medium ${formatCurrencyWithColor(data.fees.calculatorResults.regulatedFee).className}`}>
                        {formatCurrencyWithColor(data.fees.calculatorResults.regulatedFee).value}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Neregulované karty: {formatPercentage(data.fees.calculatorResults.effectiveUnregulated)} →</span>
                      <span className={`font-medium ${formatCurrencyWithColor(data.fees.calculatorResults.unregulatedFee).className}`}>
                        {formatCurrencyWithColor(data.fees.calculatorResults.unregulatedFee).value}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Profit */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    📈 Váš mesačný zisk:
                  </h3>
                  <div className="space-y-3 text-sm ml-4">
                    <div className="flex justify-between">
                      <span>• Marža z transakcií:</span>
                      <span className={`font-medium ${formatCurrencyWithColor(data.fees.calculatorResults.transactionMargin).className || 'text-green-600'}`}>
                        {formatCurrencyWithColor(data.fees.calculatorResults.transactionMargin).value}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Marža zo služieb:</span>
                      <span className={`font-medium ${formatCurrencyWithColor(data.fees.calculatorResults.serviceMargin).className || 'text-green-600'}`}>
                        {formatCurrencyWithColor(data.fees.calculatorResults.serviceMargin).value}
                        <span className="text-xs text-slate-500 ml-1">
                          ({formatCurrency(data.fees.calculatorResults.totalCustomerPayments)} - {formatCurrency(data.fees.calculatorResults.totalCompanyCosts)})
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-green-200">
                      <span className="font-bold text-slate-900">• Celkový mesačný zisk:</span>
                      <span className={`font-bold text-2xl ${formatCurrencyWithColor(data.fees.calculatorResults.totalMonthlyProfit).className || 'text-green-600'}`}>
                        {formatCurrencyWithColor(data.fees.calculatorResults.totalMonthlyProfit).value}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ProfitCalculator;
