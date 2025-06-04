
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Plus } from "lucide-react";
import { formatCurrency } from "@/components/onboarding/utils/currencyUtils";
import EditableSection from "./EditableSection";
import { Button } from "@/components/ui/button";
import QuantityStepper from "@/components/onboarding/components/QuantityStepper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DevicesServicesSectionProps {
  onboardingData: any;
  isEditMode: boolean;
  onSave: (data: any) => void;
}

const DevicesServicesSection = ({ onboardingData, isEditMode, onSave }: DevicesServicesSectionProps) => {
  const devices = onboardingData.deviceSelection?.dynamicCards || [];

  const getDeviceIcon = (category: string) => {
    return <Monitor className="h-5 w-5 text-emerald-600" />;
  };

  const calculateItemTotal = (item: any) => {
    const baseTotal = item.count * item.monthlyFee;
    const addonTotal = item.addons?.reduce((sum: number, addon: any) => {
      return sum + (addon.quantity * addon.monthlyFee);
    }, 0) || 0;
    return baseTotal + addonTotal;
  };

  const calculateItemCost = (item: any) => {
    const baseCost = item.count * (item.companyCost || 0);
    const addonCost = item.addons?.reduce((sum: number, addon: any) => {
      return sum + (addon.quantity * (addon.companyCost || 0));
    }, 0) || 0;
    return baseCost + addonCost;
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-slate-900">
          <div className="flex items-center">
            <Monitor className="h-5 w-5 mr-2 text-emerald-600" />
            Zariadenia a služby
          </div>
          {isEditMode && (
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Pridať položku
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {devices.length > 0 ? (
          devices.map((device: any, index: number) => {
            const itemTotal = calculateItemTotal(device);
            const itemCost = calculateItemCost(device);
            const margin = itemTotal - itemCost;

            return (
              <EditableSection key={index} isEditMode={isEditMode}>
                <div className="p-6 bg-slate-50/50 rounded-lg border border-slate-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getDeviceIcon(device.category)}
                      <div>
                        <h4 className="font-semibold text-slate-900">{device.name}</h4>
                        <p className="text-sm text-slate-600">{device.description || 'Profesionálne zariadenie'}</p>
                        <Badge variant="secondary" className="mt-1">
                          {device.type === 'device' ? 'Zariadenie' : 'Služba'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Quantity and Payment Type */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Počet kusov</Label>
                        {isEditMode ? (
                          <div className="mt-1">
                            <QuantityStepper 
                              value={device.count} 
                              onChange={(value) => {}} 
                              min={1}
                              max={99}
                            />
                          </div>
                        ) : (
                          <p className="text-2xl font-bold text-slate-900 mt-1">{device.count}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Typ platby</Label>
                        {isEditMode ? (
                          <div className="flex space-x-2 mt-1">
                            <Button size="sm" variant="outline">Prenájom</Button>
                            <Button size="sm" variant="outline">Kúpa</Button>
                          </div>
                        ) : (
                          <Badge className="mt-1">Prenájom</Badge>
                        )}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Mesačný poplatok / ks</Label>
                        {isEditMode ? (
                          <Input 
                            type="number" 
                            defaultValue={device.monthlyFee} 
                            className="mt-1"
                            step="0.01"
                          />
                        ) : (
                          <p className="text-slate-900 mt-1">{formatCurrency(device.monthlyFee)}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Firemný náklad / ks</Label>
                        {isEditMode ? (
                          <Input 
                            type="number" 
                            defaultValue={device.companyCost || 0} 
                            className="mt-1"
                            step="0.01"
                          />
                        ) : (
                          <p className="text-slate-900 mt-1">{formatCurrency(device.companyCost || 0)}</p>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border border-slate-200">
                        <h5 className="font-medium text-slate-900 mb-3">Súhrn nákladov</h5>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Hlavná položka:</span>
                            <span className="font-medium">{formatCurrency(device.count * device.monthlyFee)}</span>
                          </div>
                          
                          {device.addons && device.addons.length > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">Doplnky:</span>
                              <span className="font-medium">
                                {formatCurrency(device.addons.reduce((sum: number, addon: any) => 
                                  sum + (addon.quantity * addon.monthlyFee), 0
                                ))}
                              </span>
                            </div>
                          )}
                          
                          <div className="border-t border-slate-200 pt-2 mt-2">
                            <div className="flex justify-between font-medium">
                              <span>Subtotal zákazník:</span>
                              <span>{formatCurrency(itemTotal)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>Náklad firmy:</span>
                              <span>{formatCurrency(itemCost)}</span>
                            </div>
                            <div className={`flex justify-between font-bold ${margin < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                              <span>Marža:</span>
                              <span>{formatCurrency(margin)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add-ons section */}
                  {device.addons && device.addons.length > 0 && (
                    <div className="mt-6">
                      <h5 className="font-medium text-slate-900 mb-3">Doplnky a príslušenstvo</h5>
                      <div className="space-y-3">
                        {device.addons.map((addon: any, addonIndex: number) => (
                          <div key={addonIndex} className="p-3 bg-white rounded border border-slate-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <span className="font-medium text-slate-900">{addon.name}</span>
                                <div className="text-sm text-slate-600 mt-1">
                                  {addon.quantity} ks × {formatCurrency(addon.monthlyFee)} = {formatCurrency(addon.quantity * addon.monthlyFee)}
                                </div>
                              </div>
                              {isEditMode && (
                                <div className="flex items-center space-x-2">
                                  <QuantityStepper 
                                    value={addon.quantity} 
                                    onChange={(value) => {}} 
                                    min={0}
                                    max={99}
                                    className="w-32"
                                  />
                                  <Button variant="ghost" size="sm" className="text-red-600">
                                    ×
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {isEditMode && (
                        <Button variant="outline" size="sm" className="mt-3">
                          <Plus className="h-4 w-4 mr-2" />
                          Pridať doplnok
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </EditableSection>
            );
          })
        ) : (
          <p className="text-slate-600 text-center py-8">
            Žiadne zariadenia neboli vybrané
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DevicesServicesSection;
