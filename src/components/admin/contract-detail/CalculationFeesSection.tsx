
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { formatCurrency } from "@/components/onboarding/utils/currencyUtils";

interface CalculationFeesSectionProps {
  onboardingData: any;
  contract: any;
}

const CalculationFeesSection = ({ onboardingData, contract }: CalculationFeesSectionProps) => {
  const { t } = useTranslation('admin');
  
  // Get business location data for calculations
  const businessLocation = onboardingData.businessLocations?.[0];
  const devices = onboardingData.deviceSelection?.dynamicCards || [];
  
  // Calculate estimated turnover
  const estimatedTurnover = businessLocation?.estimatedTurnover || 0;
  const averageTransaction = businessLocation?.averageTransaction || 0;
  
  // Calculate device costs
  const totalMonthlyRevenue = devices.reduce((sum: number, device: any) => {
    const deviceRevenue = device.count * device.monthlyFee;
    const addonRevenue = device.addons?.reduce((addonSum: number, addon: any) => 
      addonSum + (addon.quantity * addon.monthlyFee), 0) || 0;
    return sum + deviceRevenue + addonRevenue;
  }, 0);
  
  const totalMonthlyCost = devices.reduce((sum: number, device: any) => {
    const deviceCost = device.count * (device.companyCost || 0);
    const addonCost = device.addons?.reduce((addonSum: number, addon: any) => 
      addonSum + (addon.quantity * (addon.companyCost || 0)), 0) || 0;
    return sum + deviceCost + addonCost;
  }, 0);

  // MIF++ calculations (example rates)
  const mifRegulatedRate = 0.002; // 0.2%
  const mifUnregulatedRate = 0.015; // 1.5%
  const regulatedTurnover = estimatedTurnover * 0.7; // Assume 70% regulated
  const unregulatedTurnover = estimatedTurnover * 0.3; // Assume 30% unregulated
  
  const mifRegulatedFee = regulatedTurnover * mifRegulatedRate;
  const mifUnregulatedFee = unregulatedTurnover * mifUnregulatedRate;
  const totalMifFees = mifRegulatedFee + mifUnregulatedFee;
  
  // Calculate total profit
  const totalMonthlyProfit = totalMonthlyRevenue + totalMifFees - totalMonthlyCost;
  const totalAnnualProfit = totalMonthlyProfit * 12;

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-slate-900">
          <Calculator className="h-5 w-5 mr-2 text-purple-600" />
          {t('calculations.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Business Data */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900 mb-3">{t('calculations.businessData')}</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">{t('calculations.estimatedTurnover')}:</span>
                <span className="font-medium">{formatCurrency(estimatedTurnover)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600">{t('calculations.averageTransaction')}:</span>
                <span className="font-medium">{formatCurrency(averageTransaction)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600">{t('calculations.transactionsPerMonth')}:</span>
                <span className="font-medium">
                  {averageTransaction > 0 ? Math.round(estimatedTurnover / averageTransaction) : 0}
                </span>
              </div>
            </div>
          </div>

          {/* MIF++ Fees */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900 mb-3">{t('calculations.mifFees')}</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">{t('calculations.regulatedCards')}:</span>
                <span className="font-medium">{formatCurrency(mifRegulatedFee)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600">{t('calculations.unregulatedCards')}:</span>
                <span className="font-medium">{formatCurrency(mifUnregulatedFee)}</span>
              </div>
              
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="font-medium">{t('calculations.totalMif')}:</span>
                <span className="font-bold text-emerald-600">{formatCurrency(totalMifFees)}</span>
              </div>
            </div>
          </div>

          {/* Profit Summary */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900 mb-3">{t('calculations.profitabilitySummary')}</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">{t('calculations.monthlyIncome')}:</span>
                <span className="font-medium">{formatCurrency(totalMonthlyRevenue + totalMifFees)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600">{t('calculations.monthlyCosts')}:</span>
                <span className="font-medium">{formatCurrency(totalMonthlyCost)}</span>
              </div>
              
              <div className={`flex justify-between border-t border-slate-200 pt-2 ${totalMonthlyProfit < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                <span className="font-medium">{t('calculations.monthlyProfit')}:</span>
                <span className="font-bold">{formatCurrency(totalMonthlyProfit)}</span>
              </div>
              
              <div className={`flex justify-between ${totalAnnualProfit < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                <span className="font-medium">{t('calculations.annualProfit')}:</span>
                <span className="font-bold text-lg">{formatCurrency(totalAnnualProfit)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="mt-8 p-4 bg-slate-50/50 rounded-lg">
          <h4 className="font-medium text-slate-900 mb-4">{t('calculations.detailedBreakdown')}</h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-slate-700 mb-3">{t('calculations.devicesAndServices')}</h5>
              <div className="space-y-2 text-sm">
                {devices.map((device: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-slate-600">
                      {device.name} ({device.count} {t('calculations.pieces')}):
                    </span>
                    <span className="font-medium">
                      {formatCurrency(device.count * device.monthlyFee)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-2 flex justify-between font-medium">
                  <span>{t('calculations.subtotalDevices')}:</span>
                  <span>{formatCurrency(totalMonthlyRevenue)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-slate-700 mb-3">{t('calculations.transactionFees')}</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('calculations.mifRegulated')}:</span>
                  <span className="font-medium">{formatCurrency(mifRegulatedFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">{t('calculations.mifUnregulated')}:</span>
                  <span className="font-medium">{formatCurrency(mifUnregulatedFee)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-medium">
                  <span>{t('calculations.subtotalTransactions')}:</span>
                  <span>{formatCurrency(totalMifFees)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculationFeesSection;
