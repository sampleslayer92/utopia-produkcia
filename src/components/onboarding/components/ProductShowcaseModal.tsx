
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { DynamicCard } from "@/types/onboarding";
import { useTranslation } from "react-i18next";

interface ProductShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  productType: 'device' | 'service';
  onAddToContract: (item: DynamicCard) => void;
}

const ProductShowcaseModal = ({
  isOpen,
  onClose,
  product,
  productType,
  onAddToContract
}: ProductShowcaseModalProps) => {
  const { t } = useTranslation('forms');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'rental' | 'purchase'>('rental');

  // Reset state when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setPaymentMethod('rental');
    }
  }, [isOpen, product?.id]);

  if (!product) return null;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const monthlyFeePerUnit = paymentMethod === 'rental' 
    ? (product.rentalPrice || product.monthlyFee || 0)
    : 0;
  
  const purchasePrice = product.purchasePrice || 0;
  const companyCostPerUnit = product.companyCost || monthlyFeePerUnit * 0.7;
  
  const totalMonthlyFee = monthlyFeePerUnit * quantity;
  const totalCompanyCost = companyCostPerUnit * quantity;
  const totalPurchasePrice = purchasePrice * quantity;
  const monthlyMargin = totalMonthlyFee - totalCompanyCost;

  const handleAddToContract = () => {
    const dynamicCard: DynamicCard = {
      id: `${productType}-${Date.now()}`,
      type: productType,
      category: product.category || 'terminal',
      name: product.name,
      description: product.description,
      monthlyFee: totalMonthlyFee,
      companyCost: totalCompanyCost,
      count: quantity,
      specifications: product.specifications || [],
      addons: [],
      ...(productType === 'device' && {
        image: product.image,
        catalogId: product.id
      })
    };

    onAddToContract(dynamicCard);
    onClose();
  };

  const productImage = product.image || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Left side - Product Image */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
            <div className="relative group">
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-auto max-w-[350px] max-h-[350px] object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop';
                }}
              />
              {product.category && (
                <Badge className="absolute top-4 right-4 bg-blue-600 text-white">
                  {product.category}
                </Badge>
              )}
            </div>
          </div>

          {/* Right side - Product Details */}
          <div className="p-8 flex flex-col">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-slate-900">
                {product.name}
              </DialogTitle>
              <p className="text-slate-600 mt-2">{product.description}</p>
            </DialogHeader>

            <div className="flex-1 space-y-6">
              {/* Quantity Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Počet kusov
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold min-w-[3rem] text-center">
                    {quantity}
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

              {/* Payment Method */}
              {productType === 'device' && purchasePrice > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
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

              {/* Pricing Information */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Mesačný poplatok za 1 kus:</span>
                    <span className="font-semibold">€{monthlyFeePerUnit.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Mesačný náklad pre firmu za 1 kus:</span>
                    <span className="font-semibold">€{companyCostPerUnit.toFixed(2)}</span>
                  </div>

                  {paymentMethod === 'purchase' && purchasePrice > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Nákupná cena za 1 kus:</span>
                      <span className="font-semibold">€{purchasePrice.toFixed(2)}</span>
                    </div>
                  )}

                  <hr className="my-3" />

                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Celkový mesačný poplatok:</span>
                    <span className="font-bold text-blue-600">€{totalMonthlyFee.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Celkový mesačný náklad:</span>
                    <span className="font-semibold">€{totalCompanyCost.toFixed(2)}</span>
                  </div>

                  {paymentMethod === 'purchase' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Celková nákupná cena:</span>
                      <span className="font-semibold text-green-600">€{totalPurchasePrice.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Mesačná marža:</span>
                    <span className={`font-semibold ${monthlyMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      €{monthlyMargin.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-700">Špecifikácie:</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {product.specifications.slice(0, 4).map((spec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
              <Button variant="outline" onClick={onClose}>
                Zrušiť
              </Button>
              <Button 
                onClick={handleAddToContract}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Pridať do košíka
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductShowcaseModal;
