
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeviceCard, ServiceCard } from "@/types/onboarding";
import { useTranslation } from "react-i18next";

interface CardInputFieldsProps {
  card: DeviceCard | ServiceCard;
  onUpdate: (field: keyof (DeviceCard | ServiceCard), value: any) => void;
}

const CardInputFields = ({ card, onUpdate }: CardInputFieldsProps) => {
  const { t } = useTranslation('forms');

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor={`count-${card.id}`}>{t('deviceSelection.cards.quantityLabel')}</Label>
        <Input
          id={`count-${card.id}`}
          type="number"
          min="1"
          value={card.count}
          onChange={(e) => onUpdate('count', parseInt(e.target.value) || 1)}
          className="border-slate-300 focus:border-blue-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`fee-${card.id}`}>{t('deviceSelection.cards.monthlyFeeLabel')}</Label>
        <Input
          id={`fee-${card.id}`}
          type="number"
          min="0"
          step="0.01"
          value={card.monthlyFee}
          onChange={(e) => onUpdate('monthlyFee', parseFloat(e.target.value) || 0)}
          className="border-slate-300 focus:border-blue-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`company-cost-${card.id}`}>{t('deviceSelection.cards.companyCostLabel')}</Label>
        <Input
          id={`company-cost-${card.id}`}
          type="number"
          min="0"
          step="0.01"
          value={card.companyCost}
          onChange={(e) => onUpdate('companyCost', parseFloat(e.target.value) || 0)}
          className="border-slate-300 focus:border-blue-500"
        />
      </div>
      {card.name === 'Iný' && (
        <div className="space-y-2">
          <Label htmlFor={`custom-${card.id}`}>{t('deviceSelection.cards.specifications')}</Label>
          <Input
            id={`custom-${card.id}`}
            type="text"
            value={(card as ServiceCard).customValue || ''}
            onChange={(e) => onUpdate('customValue', e.target.value)}
            className="border-slate-300 focus:border-blue-500"
            placeholder={t('deviceSelection.modal.customSpecificationPlaceholder')}
          />
        </div>
      )}
    </div>
  );
};

export default CardInputFields;
