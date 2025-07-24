import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus } from 'lucide-react';
import { icons } from 'lucide-react';

interface CompactProductCardProps {
  product: {
    id: string;
    name: string;
    description?: string;
    monthly_fee: number;
    company_cost: number;
    icon_name?: string;
    icon_url?: string;
    color?: string;
  };
  quantity: number;
  onQuantityChange: (productId: string, quantity: number) => void;
}

const CompactProductCard = ({ product, quantity, onQuantityChange }: CompactProductCardProps) => {
  const renderIcon = (iconName: string | null, iconUrl: string | null, color: string) => {
    if (iconUrl) {
      return <img src={iconUrl} alt="Icon" className="h-4 w-4 object-contain" />;
    }
    if (iconName && icons[iconName as keyof typeof icons]) {
      const IconComponent = icons[iconName as keyof typeof icons];
      return <IconComponent className="h-4 w-4" style={{ color }} />;
    }
    return <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />;
  };

  const handleAdd = () => {
    onQuantityChange(product.id, quantity + 1);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      onQuantityChange(product.id, quantity - 1);
    }
  };

  return (
    <Card className={`transition-all hover:shadow-md ${quantity > 0 ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {renderIcon(
              product.icon_name || null,
              product.icon_url || null,
              product.color || '#3B82F6'
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{product.name}</h4>
              <p className="text-xs text-muted-foreground">
                {Number(product.monthly_fee).toFixed(2)}€/mesiac
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {quantity > 0 && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                {quantity}x
              </Badge>
            )}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={handleRemove}
                disabled={quantity === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={handleAdd}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactProductCard;