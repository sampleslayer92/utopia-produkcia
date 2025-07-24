import React, { useState } from 'react';
import { Plus, ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { WarehouseItem } from '@/hooks/useWarehouseItems';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: WarehouseItem;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'rental' | 'purchase'>('rental');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addToCart(product, quantity, paymentMethod === 'rental');
      toast({
        title: "Pridané do košíka",
        description: `${product.name} (${quantity}x) ${paymentMethod === 'rental' ? 'prenájom' : 'kúpa'}`,
      });
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa pridať produkt do košíka",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const isProductInCart = isInCart(product.id);
  const price = paymentMethod === 'rental' ? product.monthly_fee : product.setup_fee;

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-4 flex-1">
        {/* Product Image */}
        <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="text-muted-foreground text-sm">Bez obrázka</div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
            <Badge variant="secondary" className="text-xs whitespace-nowrap">
              {product.category}
            </Badge>
          </div>
          
          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <Badge 
              variant={product.current_stock > 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {product.current_stock > 0 ? `${product.current_stock} ks skladom` : 'Nedostupné'}
            </Badge>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3 pt-2">
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as 'rental' | 'purchase')}
              className="grid grid-cols-1 gap-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded border">
                <RadioGroupItem value="rental" id={`rental-${product.id}`} />
                <Label htmlFor={`rental-${product.id}`} className="flex-1 text-xs">
                  <div className="flex justify-between">
                    <span>Prenájom</span>
                    <span className="font-semibold">€{product.monthly_fee.toFixed(2)}/mes</span>
                  </div>
                </Label>
              </div>
              
              {product.setup_fee > 0 && (
                <div className="flex items-center space-x-2 p-2 rounded border">
                  <RadioGroupItem value="purchase" id={`purchase-${product.id}`} />
                  <Label htmlFor={`purchase-${product.id}`} className="flex-1 text-xs">
                    <div className="flex justify-between">
                      <span>Kúpa</span>
                      <span className="font-semibold">€{product.setup_fee.toFixed(2)}</span>
                    </div>
                  </Label>
                </div>
              )}
            </RadioGroup>

            {/* Quantity Input */}
            <div className="flex items-center space-x-2">
              <Label htmlFor={`quantity-${product.id}`} className="text-xs whitespace-nowrap">
                Množstvo:
              </Label>
              <Input
                id={`quantity-${product.id}`}
                type="number"
                min="1"
                max={product.current_stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isAdding || product.current_stock === 0}
          className="w-full h-9 text-xs"
          variant={isProductInCart ? "secondary" : "default"}
        >
          {isAdding ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
              Pridávanie...
            </div>
          ) : isProductInCart ? (
            <div className="flex items-center gap-2">
              <Check className="h-3 w-3" />
              V košíku
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-3 w-3" />
              Pridať do košíka
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;