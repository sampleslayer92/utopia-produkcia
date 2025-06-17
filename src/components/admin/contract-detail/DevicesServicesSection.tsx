
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Plus, Trash2, Package, Wrench } from "lucide-react";
import { useTranslation } from 'react-i18next';
import EditableSection from "./EditableSection";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { formatCurrency } from "@/components/onboarding/utils/currencyUtils";

interface DevicesServicesSectionProps {
  onboardingData: any;
  isEditMode: boolean;
  onSave: (data: any) => void;
}

const DevicesServicesSection = ({ onboardingData, isEditMode, onSave }: DevicesServicesSectionProps) => {
  const { t } = useTranslation('admin');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const devices = onboardingData.deviceSelection?.dynamicCards || [];

  const handleDeleteItem = (item: any) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // Delete logic here
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const addNewItem = () => {
    console.log('Add new item');
  };

  const calculateItemTotal = (item: any) => {
    const mainItemTotal = item.count * item.monthlyFee;
    const addonsTotal = item.addons?.reduce((sum: number, addon: any) => 
      sum + (addon.quantity * addon.monthlyFee), 0) || 0;
    return mainItemTotal + addonsTotal;
  };

  const calculateItemCost = (item: any) => {
    const mainItemCost = item.count * (item.companyCost || 0);
    const addonsCost = item.addons?.reduce((sum: number, addon: any) => 
      sum + (addon.quantity * (addon.companyCost || 0)), 0) || 0;
    return mainItemCost + addonsCost;
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'device':
        return <Smartphone className="h-4 w-4" />;
      case 'service':
        return <Wrench className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getItemTypeBadge = (type: string) => {
    switch (type) {
      case 'device':
        return <Badge variant="outline">{t('devicesServices.device')}</Badge>;
      case 'service':
        return <Badge variant="outline">{t('devicesServices.service')}</Badge>;
      case 'professional':
        return <Badge variant="outline">{t('devicesServices.professionalDevice')}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <>
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-slate-900">
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2 text-emerald-600" />
              {t('devicesServices.title')}
            </div>
            {isEditMode && (
              <Button variant="outline" size="sm" onClick={addNewItem}>
                <Plus className="h-4 w-4 mr-2" />
                {t('devicesServices.addItem')}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {devices.length > 0 ? (
            devices.map((item: any, index: number) => (
              <EditableSection key={index} isEditMode={isEditMode}>
                <div className="p-6 bg-emerald-50/50 rounded-lg border border-emerald-200/60 relative">
                  {isEditMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item)}
                      className="absolute top-4 right-4 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        {getItemIcon(item.type)}
                        <h4 className="font-medium text-emerald-900">{item.name}</h4>
                        {getItemTypeBadge(item.type)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-600">
                            {t('devicesServices.quantity')}
                          </Label>
                          {isEditMode ? (
                            <Input 
                              type="number"
                              defaultValue={item.count || 1} 
                              className="mt-1"
                              min="1"
                            />
                          ) : (
                            <p className="text-slate-900 mt-1">{item.count || 1}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-slate-600">
                            {t('devicesServices.paymentType')}
                          </Label>
                          {isEditMode ? (
                            <Select defaultValue={item.paymentType || 'rental'}>
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rental">{t('devicesServices.rental')}</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-slate-900 mt-1">{t('devicesServices.rental')}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-600">
                            {t('devicesServices.monthlyFeePerPiece')}
                          </Label>
                          {isEditMode ? (
                            <Input 
                              type="number"
                              defaultValue={item.monthlyFee || 0} 
                              className="mt-1"
                              step="0.01"
                            />
                          ) : (
                            <p className="text-slate-900 mt-1">{formatCurrency(item.monthlyFee || 0)}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-slate-600">
                            {t('devicesServices.companyCostPerPiece')}
                          </Label>
                          {isEditMode ? (
                            <Input 
                              type="number"
                              defaultValue={item.companyCost || 0} 
                              className="mt-1"
                              step="0.01"
                            />
                          ) : (
                            <p className="text-slate-900 mt-1">{formatCurrency(item.companyCost || 0)}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cost Summary */}
                    <div className="space-y-4">
                      <h5 className="font-medium text-emerald-900">
                        {t('devicesServices.costSummary')}
                      </h5>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">{t('devicesServices.mainItem')}:</span>
                          <span className="font-medium">{formatCurrency(item.count * item.monthlyFee)}</span>
                        </div>
                        
                        {item.addons && item.addons.length > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">{t('devicesServices.addons')}:</span>
                            <span className="font-medium">
                              {formatCurrency(item.addons.reduce((sum: number, addon: any) => 
                                sum + (addon.quantity * addon.monthlyFee), 0))}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between border-t border-emerald-200 pt-2">
                          <span className="font-medium">{t('devicesServices.customerSubtotal')}:</span>
                          <span className="font-bold text-emerald-600">{formatCurrency(calculateItemTotal(item))}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-slate-600">{t('devicesServices.companyCost')}:</span>
                          <span className="font-medium">{formatCurrency(calculateItemCost(item))}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="font-medium">{t('devicesServices.margin')}:</span>
                          <span className={`font-bold ${calculateItemTotal(item) - calculateItemCost(item) > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatCurrency(calculateItemTotal(item) - calculateItemCost(item))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add-ons section */}
                  {item.addons && item.addons.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-emerald-200">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium text-emerald-900">
                          {t('devicesServices.addonsAndAccessories')}
                        </h5>
                        {isEditMode && (
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            {t('devicesServices.addAddon')}
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid gap-3">
                        {item.addons.map((addon: any, addonIndex: number) => (
                          <div key={addonIndex} className="flex items-center justify-between p-3 bg-white rounded border">
                            <div className="flex-1">
                              <span className="font-medium">{addon.name}</span>
                              <span className="text-slate-600 ml-2">({addon.quantity}x)</span>
                            </div>
                            <div className="text-right">
                              <span className="font-medium">{formatCurrency(addon.quantity * addon.monthlyFee)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </EditableSection>
            ))
          ) : (
            <div className="text-center py-8">
              <Smartphone className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">{t('devicesServices.noDevicesSelected')}</p>
              {isEditMode && (
                <Button variant="outline" onClick={addNewItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('devicesServices.addFirstDevice')}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={itemToDelete?.name || t('devicesServices.confirmDelete', { itemName: '' })}
        isDeleting={false}
      />
    </>
  );
};

export default DevicesServicesSection;
