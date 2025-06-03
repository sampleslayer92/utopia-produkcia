
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeviceCard, ServiceCard } from "@/types/onboarding";
import DynamicDeviceCard from "../components/DynamicDeviceCard";
import DynamicServiceCard from "../components/DynamicServiceCard";

interface SelectedItemsSectionProps {
  dynamicCards: Array<DeviceCard | ServiceCard>;
  onUpdateCard: (cardId: string, updatedCard: DeviceCard | ServiceCard) => void;
  onRemoveCard: (cardId: string) => void;
}

const SelectedItemsSection = ({ 
  dynamicCards, 
  onUpdateCard, 
  onRemoveCard 
}: SelectedItemsSectionProps) => {
  const totalMonthlyFee = dynamicCards.reduce((sum, card) => sum + (card.count * card.monthlyFee), 0);
  const deviceCount = dynamicCards.filter(card => card.type === 'device').length;
  const serviceCount = dynamicCards.filter(card => card.type === 'service').length;

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <span>Vybrané zariadenia a služby</span>
              <div className="w-full bg-slate-200 rounded-full h-2 ml-4">
                <div className="bg-blue-600 h-2 rounded-full w-full"></div>
              </div>
              <span className="text-sm text-slate-500 ml-2">Krok 4 z 4</span>
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">{deviceCount} zariadení</Badge>
            <Badge variant="secondary">{serviceCount} služieb</Badge>
          </div>
        </div>
        {totalMonthlyFee > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-emerald-800 font-medium">Celkový mesačný poplatok:</span>
              <span className="text-2xl font-bold text-emerald-600">{totalMonthlyFee.toFixed(2)} €</span>
            </div>
            <p className="text-emerald-600 text-sm mt-1">
              Ročný poplatok: {(totalMonthlyFee * 12).toFixed(2)} €
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {dynamicCards.length > 0 ? (
          <div className="space-y-4">
            {dynamicCards.map((card) => (
              <div key={card.id}>
                {card.type === 'device' ? (
                  <DynamicDeviceCard
                    device={card}
                    onUpdate={(updatedCard) => onUpdateCard(card.id, updatedCard)}
                    onRemove={() => onRemoveCard(card.id)}
                  />
                ) : (
                  <DynamicServiceCard
                    service={card}
                    onUpdate={(updatedCard) => onUpdateCard(card.id, updatedCard)}
                    onRemove={() => onRemoveCard(card.id)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500 text-lg">Zatiaľ neboli vybrané žiadne zariadenia ani služby</p>
            <p className="text-slate-400 text-sm mt-2">Vráťte sa na predchádzajúce kroky a pridajte potrebné položky</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectedItemsSection;
