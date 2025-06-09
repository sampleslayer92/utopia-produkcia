
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeviceCard, ServiceCard } from "@/types/onboarding";
import { useTranslation } from "react-i18next";

interface CardInputFieldsProps {
  card: DeviceCard | ServiceCard;
  onUpdate: (field: string, value: any) => void;
}

const CardInputFields = ({ card, onUpdate }: CardInputFieldsProps) => {
  const { t } = useTranslation('forms');

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor={`count-${card.id}`} className="text-sm font-medium text-slate-700">
          {t('deviceSelection.cards.quantityLabel')}
        </Label>
        <Input
          id={`count-${card.id}`}
          type="number"
          min="1"
          value={card.count}
          onChange={(e) => onUpdate('count', parseInt(e.target.value) || 1)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={`monthlyFee-${card.id}`} className="text-sm font-medium text-slate-700">
          {t('deviceSelection.cards.monthlyFeeLabel')}
        </Label>
        <Input
          id={`monthlyFee-${card.id}`}
          type="number"
          min="0"
          step="0.01"
          value={card.monthlyFee}
          onChange={(e) => onUpdate('monthlyFee', parseFloat(e.target.value) || 0)}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default CardInputFields;
