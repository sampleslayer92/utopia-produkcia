import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

const CartPage: React.FC = () => {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Košík vymazaný",
      description: "Všetky položky boli odstránené z košíka",
    });
  };

  if (state.totalItems === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-4">Váš košík je prázdny</h1>
          <p className="text-muted-foreground mb-8">
            Pridajte si produkty do košíka a pokračujte v objednávke
          </p>
          <Button asChild>
            <Link to="/admin/eshop">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Pokračovať v nákupe
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Nákupný košík</h1>
          <p className="text-muted-foreground">
            {state.totalItems} položiek v košíku
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/eshop">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Pokračovať v nákupe
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleClearCart}>
            <Trash2 className="h-4 w-4 mr-2" />
            Vymazať košík
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-muted-foreground text-xs">Bez obrázka</div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                    {item.product.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.product.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Badge variant={item.isRental ? "default" : "secondary"}>
                        {item.isRental ? "Prenájom" : "Kúpa"}
                      </Badge>
                      <Badge variant="outline">{item.product.category}</Badge>
                    </div>

                    {/* Price per unit */}
                    <div className="text-lg font-semibold">
                      €{item.isRental ? item.product.monthly_fee.toFixed(2) : item.product.setup_fee.toFixed(2)}
                      {item.isRental && <span className="text-sm font-normal text-muted-foreground">/mes</span>}
                    </div>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end space-y-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Line Total */}
                    <div className="text-right">
                      <div className="font-semibold">
                        €{(item.isRental 
                          ? item.product.monthly_fee * item.quantity 
                          : item.product.setup_fee * item.quantity
                        ).toFixed(2)}
                      </div>
                      {item.isRental && (
                        <div className="text-sm text-muted-foreground">/mes</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Súhrn objednávky</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Počet položiek:</span>
                  <span>{state.totalItems}</span>
                </div>
                
                {state.monthlyAmount > 0 && (
                  <>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span>Mesačné platby:</span>
                      <span className="font-medium">€{state.monthlyAmount.toFixed(2)}/mes</span>
                    </div>
                  </>
                )}
                
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Celkom:</span>
                  <span>€{state.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Button className="w-full" size="lg">
                  Pokračovať k objednávke
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/admin/eshop">Pokračovať v nákupe</Link>
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground pt-2">
                * Ceny sú uvedené bez DPH
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;