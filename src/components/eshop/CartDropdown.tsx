import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';

interface CartDropdownProps {
  children: React.ReactNode;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ children }) => {
  const { state, removeFromCart, updateQuantity } = useCart();

  if (state.totalItems === 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="p-4 text-center text-muted-foreground">
            Váš košík je prázdny
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Nákupný košík</h3>
            <Badge variant="secondary">{state.totalItems} položiek</Badge>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {state.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg border">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant={item.isRental ? "default" : "secondary"} className="text-xs">
                      {item.isRental ? "Prenájom" : "Kúpa"}
                    </Badge>
                    <span>
                      €{item.isRental ? item.product.monthly_fee.toFixed(2) : item.product.setup_fee.toFixed(2)}
                      {item.isRental && "/mes"}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            {state.monthlyAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span>Mesačné platby:</span>
                <span className="font-medium">€{state.monthlyAmount.toFixed(2)}/mes</span>
              </div>
            )}
            <div className="flex justify-between font-semibold">
              <span>Celkom:</span>
              <span>€{state.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <Button asChild className="w-full">
              <Link to="/admin/eshop/cart">Zobraziť košík</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin/eshop">Pokračovať v nákupe</Link>
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartDropdown;