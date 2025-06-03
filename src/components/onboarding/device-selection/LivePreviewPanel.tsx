
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Calculator, ShoppingCart } from "lucide-react";
import { DeviceCard, ServiceCard } from "@/types/onboarding";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import EnhancedDeviceCard from "../components/EnhancedDeviceCard";
import EnhancedServiceCard from "../components/EnhancedServiceCard";

interface LivePreviewPanelProps {
  dynamicCards: Array<DeviceCard | ServiceCard>;
  onUpdateCard: (cardId: string, updatedCard: DeviceCard | ServiceCard) => void;
  onRemoveCard: (cardId: string) => void;
  onClearAll: () => void;
}

const LivePreviewPanel = ({ 
  dynamicCards, 
  onUpdateCard, 
  onRemoveCard,
  onClearAll 
}: LivePreviewPanelProps) => {
  const deviceCards = dynamicCards.filter(card => card.type === 'device') as DeviceCard[];
  const serviceCards = dynamicCards.filter(card => card.type === 'service') as ServiceCard[];
  
  const totalDevices = deviceCards.reduce((sum, card) => sum + card.count, 0);
  const totalServices = serviceCards.reduce((sum, card) => sum + card.count, 0);
  const totalMonthlyFee = dynamicCards.reduce((sum, card) => sum + (card.count * card.monthlyFee), 0);
  const totalYearlyFee = totalMonthlyFee * 12;

  if (dynamicCards.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-sm">
          <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">Žiadne položky</h3>
          <p className="text-slate-500 text-sm">
            Začnite pridávaním zariadení a služieb z katalógu na ľavej strane
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header with Summary */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Vaša objednávka</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Vymazať všetko
          </Button>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalDevices}</div>
            <div className="text-xs text-slate-500">Zariadení</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalServices}</div>
            <div className="text-xs text-slate-500">Služieb</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{dynamicCards.length}</div>
            <div className="text-xs text-slate-500">Celkom položiek</div>
          </div>
        </div>

        {/* Cost Summary */}
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-emerald-800">Celkové náklady</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">{totalMonthlyFee.toFixed(2)} €/mes</div>
                <div className="text-sm text-emerald-700">{totalYearlyFee.toFixed(2)} € ročne</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Accordion type="multiple" defaultValue={["devices", "services"]} className="space-y-4">
          {/* Devices Section */}
          {deviceCards.length > 0 && (
            <AccordionItem value="devices">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900">Zariadenia</h4>
                  <Badge variant="secondary">{deviceCards.length} typov</Badge>
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    {deviceCards.reduce((sum, card) => sum + (card.count * card.monthlyFee), 0).toFixed(2)} €/mes
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 mt-4">
                  {deviceCards.map((card) => (
                    <EnhancedDeviceCard
                      key={card.id}
                      device={card}
                      onUpdate={(updatedCard) => onUpdateCard(card.id, updatedCard)}
                      onRemove={() => onRemoveCard(card.id)}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Services Section */}
          {serviceCards.length > 0 && (
            <AccordionItem value="services">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900">Služby</h4>
                  <Badge variant="secondary">{serviceCards.length} typov</Badge>
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    {serviceCards.reduce((sum, card) => sum + (card.count * card.monthlyFee), 0).toFixed(2)} €/mes
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 mt-4">
                  {serviceCards.map((card) => (
                    <EnhancedServiceCard
                      key={card.id}
                      service={card}
                      onUpdate={(updatedCard) => onUpdateCard(card.id, updatedCard)}
                      onRemove={() => onRemoveCard(card.id)}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
};

export default LivePreviewPanel;
