
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PreviewHeaderProps {
  totalDevices: number;
  totalServices: number;
  totalItems: number;
  totalMonthlyFee: number;
  totalYearlyFee: number;
  onClearAll: () => void;
}

const PreviewHeader = ({ 
  totalDevices, 
  totalServices, 
  totalItems, 
  totalMonthlyFee, 
  totalYearlyFee, 
  onClearAll 
}: PreviewHeaderProps) => {
  const { t } = useTranslation('forms');

  return (
    <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          {t('deviceSelection.preview.title')}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {t('deviceSelection.preview.clearAll')}
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalDevices}</div>
          <div className="text-xs text-slate-500">{t('deviceSelection.preview.stats.devices')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{totalServices}</div>
          <div className="text-xs text-slate-500">{t('deviceSelection.preview.stats.services')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600">{totalItems}</div>
          <div className="text-xs text-slate-500">{t('deviceSelection.preview.stats.totalItems')}</div>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-emerald-600" />
              <span className="font-medium text-emerald-800">
                {t('deviceSelection.preview.costSummary.title')}
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">
                {totalMonthlyFee.toFixed(2)} €/mes
              </div>
              <div className="text-sm text-emerald-700">
                {totalYearlyFee.toFixed(2)} € ročne
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewHeader;
