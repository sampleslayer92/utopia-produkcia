
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Package, Wrench } from "lucide-react";
import { DeviceCard, ServiceCard } from "@/types/onboarding";
import { useTranslation } from "react-i18next";

interface PreviewCardItemProps {
  card: DeviceCard | ServiceCard;
  onEdit: (card: DeviceCard | ServiceCard) => void;
  onRemove: (cardId: string) => void;
}

const PreviewCardItem = ({ card, onEdit, onRemove }: PreviewCardItemProps) => {
  const { t } = useTranslation('forms');

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
            {card.type === 'device' && (card as DeviceCard).image ? (
              <img 
                src={(card as DeviceCard).image} 
                alt={card.name} 
                className="w-10 h-10 object-contain" 
              />
            ) : card.type === 'device' ? (
              <Package className="h-6 w-6 text-slate-400" />
            ) : (
              <Wrench className="h-6 w-6 text-green-600" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-slate-900 text-sm">{card.name}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{card.description}</p>
                {card.type === 'service' && (card as ServiceCard).customValue && (
                  <p className="text-xs text-slate-500 mt-1 italic">"{(card as ServiceCard).customValue}"</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {t('deviceSelection.cards.count', { count: card.count })}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${card.type === 'device' ? 'text-blue-600 border-blue-300' : 'text-green-600 border-green-300'}`}
                  >
                    {(card.count * card.monthlyFee).toFixed(2)} €/mes
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(card)}
                  className="h-6 w-6 p-0 hover:bg-blue-50"
                >
                  <Edit className="h-3 w-3 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(card.id)}
                  className="h-6 w-6 p-0 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewCardItem;
