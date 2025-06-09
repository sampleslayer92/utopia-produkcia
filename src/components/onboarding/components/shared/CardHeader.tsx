
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { X, Edit2, Package, Wrench } from "lucide-react";
import { DeviceCard, ServiceCard } from "@/types/onboarding";
import { useTranslation } from "react-i18next";

interface CardHeaderProps {
  card: DeviceCard | ServiceCard;
  onEdit?: () => void;
  onRemove: () => void;
}

const CardHeader = ({ card, onEdit, onRemove }: CardHeaderProps) => {
  const { t } = useTranslation('forms');

  return (
    <>
      <div className="absolute top-2 right-2 flex gap-1">
        {onEdit && (
          <Button
            variant="outline"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 hover:bg-blue-50 hover:border-blue-300"
          >
            <Edit2 className="h-4 w-4 text-blue-500" />
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 hover:bg-red-50 hover:border-red-300"
        >
          <X className="h-4 w-4 text-red-500" />
        </Button>
      </div>
      
      <div className="flex items-start space-x-4 pr-20">
        <div className={`bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden ${
          card.type === 'device' ? 'w-24 h-24' : 'w-20 h-20'
        }`}>
          {card.type === 'device' && (card as DeviceCard).image ? (
            <img 
              src={(card as DeviceCard).image} 
              alt={card.name} 
              className="w-20 h-20 object-contain hover:scale-110 transition-transform cursor-pointer" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling!.classList.remove('hidden');
              }}
            />
          ) : null}
          <span className={`text-xs text-slate-500 text-center ${
            card.type === 'device' && (card as DeviceCard).image ? 'hidden' : ''
          }`}>
            {card.type === 'device' ? '📦' : '⚙️'} {card.name}
          </span>
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg text-slate-900">{card.name}</CardTitle>
          <p className="text-sm text-slate-600 mt-1">{card.description}</p>
          {card.type === 'service' && (card as ServiceCard).customValue && (
            <p className="text-xs text-slate-500 mt-1 italic">"{(card as ServiceCard).customValue}"</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {card.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {card.count} {t('deviceSelection.preview.count.pieces')}
            </Badge>
            {(card.addons?.length || 0) > 0 && (
              <Badge variant="outline" className="text-xs text-green-600">
                {t('deviceSelection.cards.addonsCount', { count: card.addons?.length })}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CardHeader;
