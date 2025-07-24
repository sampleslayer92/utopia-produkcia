import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { DeviceCard, ServiceCard } from "@/types/onboarding";
import { BusinessLocation } from "@/types/business";
import { useTranslation } from "react-i18next";
import { useProductForm } from "./ProductDetailModal/hooks/useProductForm";
import { createProductCard } from "./ProductDetailModal/utils/productSaveUtils";
import ProductForm from "./ProductDetailModal/ProductForm";
import EnhancedAddonManager from "./EnhancedAddonManager";
import { CustomFieldsDisplay } from "./CustomFieldsDisplay";
import { useProductCustomFields } from "@/hooks/useCustomFieldDefinitions";
import CustomFieldsEditor from "./ProductDetailModal/CustomFieldsEditor";

interface UnifiedProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  productType: 'device' | 'service';
  product?: any;
  editingCard?: DeviceCard | ServiceCard;
  onSave: (card: DeviceCard | ServiceCard) => void;
  businessLocations: BusinessLocation[];
}

const UnifiedProductModal = ({
  isOpen,
  onClose,
  mode,
  productType,
  product,
  editingCard,
  onSave,
  businessLocations
}: UnifiedProductModalProps) => {
  const { t } = useTranslation('forms');
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'rental' | 'purchase'>('rental');
  const [activeTab, setActiveTab] = useState('basic');

  const {
    formData,
    selectedAddons,
    updateField,
    handleAddAddon,
    handleRemoveAddon,
    handleUpdateAddon
  } = useProductForm({ 
    mode, 
    product, 
    editingCard, 
    isOpen, 
    businessLocations: businessLocations.map(loc => ({ id: loc.id, name: loc.name }))
  });

  // Reset payment method when modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentMethod('rental');
    }
  }, [isOpen, product?.id]);

  // Early return - move before hooks to fix React Rules
  if (!product && mode === 'add') {
    return null;
  }

  const displayProduct = mode === 'edit' ? editingCard : product;
  const productImage = displayProduct?.image || displayProduct?.image_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop';

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, formData.count + delta);
    updateField('count', newQuantity);
  };

  // Calculate pricing based on payment method and current form data
  const monthlyFeePerUnit = paymentMethod === 'rental' 
    ? (product?.monthly_fee || formData.monthlyFee || 0)
    : 0;
  
  const purchasePrice = product?.setup_fee || 0;
  const companyCostPerUnit = formData.companyCost || product?.company_cost || monthlyFeePerUnit * 0.7;
  
  const totalMonthlyFee = monthlyFeePerUnit * formData.count;
  const totalCompanyCost = companyCostPerUnit * formData.count;
  const totalPurchasePrice = purchasePrice * formData.count;
  const monthlyMargin = totalMonthlyFee - totalCompanyCost;

  // Calculate final values when payment method or quantity changes
  const finalMonthlyFee = paymentMethod === 'rental' ? monthlyFeePerUnit * formData.count : 0;
  const finalCompanyCost = companyCostPerUnit * formData.count;

  const handleSave = () => {
    try {
      console.log('🎯 UnifiedProductModal HandleSave called with formData:', formData);
      console.log('🎯 Business locations count:', businessLocations.length);
      console.log('🎯 Current locationId:', formData.locationId);
      console.log('🎯 Custom fields:', formData.customFields);
      
      // Validate location selection if multiple locations exist
      if (businessLocations.length > 1 && !formData.locationId) {
        console.log('❌ Location validation failed');
        toast({
          title: "Chyba",
          description: "Musíte vybrať prevádzku",
          variant: "destructive",
        });
        setActiveTab('basic'); // Switch to basic tab to show the error
        return;
      }

      const savedCard = createProductCard({
        formData: {
          ...formData,
          monthlyFee: finalMonthlyFee,
          companyCost: finalCompanyCost
        },
        selectedAddons,
        productType,
        mode,
        product: displayProduct,
        editingCard
      });

      // Add warehouse item reference and custom fields
      if (product?.id) {
        savedCard.warehouseItemId = product.id;
      }
      if (formData.customFields) {
        savedCard.customFields = formData.customFields;
        console.log('🔧 Custom fields added to saved card:', formData.customFields);
      }

      console.log('💾 Final saved card:', {
        id: savedCard.id,
        name: savedCard.name,
        locationId: savedCard.locationId,
        monthlyFee: savedCard.monthlyFee,
        customFields: savedCard.customFields,
        warehouseItemId: savedCard.warehouseItemId
      });

      console.log('Generated card with UUID:', savedCard.id);
      
      // Call the onSave callback to actually save the product
      onSave(savedCard);
      
      // Show success message
      toast({
        title: "Úspech",
        description: mode === 'add' ? "Produkt bol pridaný do košíka" : "Produkt bol aktualizovaný",
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa uložiť produkt",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0">
        <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
          {/* Left side - Product Image (2/5 width) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
            <div className="relative group">
              <img
                src={productImage}
                alt={formData.name}
                className="w-full h-auto max-w-[400px] max-h-[400px] object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop';
                }}
              />
              {displayProduct?.category && (
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  {displayProduct.category}
                </Badge>
              )}
            </div>
          </div>

          {/* Right side - Product Details & Form (3/5 width) */}
          <div className="lg:col-span-3 p-6 flex flex-col overflow-y-auto">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">
                {mode === 'add' ? t('deviceSelection.modal.addTitle') : t('deviceSelection.modal.editTitle')} {formData.name}
              </DialogTitle>
              <p className="text-muted-foreground mt-2">{formData.description}</p>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Základné</TabsTrigger>
                <TabsTrigger value="pricing">Ceny</TabsTrigger>
                <TabsTrigger value="custom">Vlastné polia</TabsTrigger>
                <TabsTrigger value="addons">Doplnky</TabsTrigger>
                <TabsTrigger value="specs">Špecifikácie</TabsTrigger>
              </TabsList>

              <div className="flex-1 mt-6">
                <TabsContent value="basic" className="space-y-6 mt-0">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Názov</label>
                      <p className="text-sm text-muted-foreground">{formData.name}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Popis</label>
                      <p className="text-sm text-muted-foreground">{formData.description}</p>
                    </div>

                    {/* Location Selection */}
                    {businessLocations.length > 1 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Prevádzka <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.locationId || ""}
                          onChange={(e) => {
                            console.log('🎯 Location select onChange:', e.target.value);
                            updateField('locationId', e.target.value);
                          }}
                          className={`w-full p-2 border rounded-md bg-background ${
                            !formData.locationId && businessLocations.length > 1 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-input focus:border-primary'
                          }`}
                        >
                          <option value="">Vyberte prevádzku</option>
                          {businessLocations.map((location) => (
                            <option key={location.id} value={location.id}>
                              {location.name}
                            </option>
                          ))}
                        </select>
                        {!formData.locationId && businessLocations.length > 1 && (
                          <p className="text-sm text-red-500">Prevádzka je povinná</p>
                        )}
                      </div>
                    )}

                    {/* Quantity Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {t('deviceSelection.modal.quantity')}
                      </label>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={formData.count <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-semibold min-w-[3rem] text-center">
                          {formData.count}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Payment Method for devices */}
                    {productType === 'device' && product?.purchasePrice > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Spôsob platby
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={paymentMethod === 'rental' ? 'default' : 'outline'}
                            onClick={() => setPaymentMethod('rental')}
                            className="justify-start"
                          >
                            Prenájom
                          </Button>
                          <Button
                            variant={paymentMethod === 'purchase' ? 'default' : 'outline'}
                            onClick={() => setPaymentMethod('purchase')}
                            className="justify-start"
                          >
                            Kúpa
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-6 mt-0">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                       <div className="flex justify-between items-center">
                         <span className="text-sm text-muted-foreground">Mesačný poplatok za 1 kus:</span>
                         <span className="font-semibold">€{monthlyFeePerUnit.toFixed(2)}</span>
                       </div>
                       
                       <div className="flex justify-between items-center">
                         <span className="text-sm text-muted-foreground">Mesačný náklad pre firmu za 1 kus:</span>
                         <span className="font-semibold">€{companyCostPerUnit.toFixed(2)}</span>
                       </div>

                      {paymentMethod === 'purchase' && purchasePrice > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Nákupná cena za 1 kus:</span>
                          <span className="font-semibold">€{purchasePrice.toFixed(2)}</span>
                        </div>
                      )}

                      <hr className="my-3" />

                       <div className="flex justify-between items-center text-lg">
                         <span className="font-semibold">Celkový mesačný poplatok:</span>
                         <span className="font-bold text-primary">€{finalMonthlyFee.toFixed(2)}</span>
                       </div>

                       <div className="flex justify-between items-center">
                         <span className="text-sm text-muted-foreground">Celkový mesačný náklad:</span>
                         <span className="font-semibold">€{finalCompanyCost.toFixed(2)}</span>
                       </div>

                      {paymentMethod === 'purchase' && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Celková nákupná cena:</span>
                          <span className="font-semibold text-green-600">€{totalPurchasePrice.toFixed(2)}</span>
                        </div>
                      )}

                       <div className="flex justify-between items-center">
                         <span className="text-sm text-muted-foreground">Mesačná marža:</span>
                         <span className={`font-semibold ${(finalMonthlyFee - finalCompanyCost) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                           €{(finalMonthlyFee - finalCompanyCost).toFixed(2)}
                         </span>
                       </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="custom" className="space-y-4 mt-0">
                  <CustomFieldsEditor
                    warehouseItemId={product?.id}
                    values={formData.customFields}
                    onChange={(customFields) => updateField('customFields', customFields)}
                  />
                </TabsContent>

                <TabsContent value="addons" className="space-y-4 mt-0">
                  <EnhancedAddonManager
                    selectedAddons={selectedAddons}
                    onAddAddon={handleAddAddon}
                    onRemoveAddon={handleRemoveAddon}
                    onUpdateAddon={handleUpdateAddon}
                  />
                </TabsContent>

                <TabsContent value="specs" className="space-y-4 mt-0">
                  {displayProduct?.specifications && Object.keys(displayProduct.specifications).length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-medium">Špecifikácie produktu</h4>
                      <div className="grid gap-2">
                        {Object.entries(displayProduct.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center py-1 px-2 bg-muted/50 rounded">
                            <span className="text-sm font-medium">{key}:</span>
                            <span className="text-sm text-muted-foreground">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Žiadne špecifikácie nie sú dostupné.</p>
                  )}
                </TabsContent>
              </div>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
              <Button variant="outline" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {mode === 'add' ? 'Pridať do košíka' : t('common.save')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedProductModal;