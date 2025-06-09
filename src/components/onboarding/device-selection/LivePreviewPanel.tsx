
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, Wrench } from "lucide-react";
import { DeviceCard, ServiceCard } from "@/types/onboarding";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import PreviewHeader from "../components/preview/PreviewHeader";
import PreviewCardItem from "../components/preview/PreviewCardItem";

interface LivePreviewPanelProps {
  dynamicCards: Array<DeviceCard | ServiceCard>;
  onUpdateCard: (cardId: string, updatedCard: DeviceCard | ServiceCard) => void;
  onRemoveCard: (cardId: string) => void;
  onClearAll: () => void;
  onEditCard: (card: DeviceCard | ServiceCard) => void;
}

const LivePreviewPanel = ({ 
  dynamicCards, 
  onUpdateCard, 
  onRemoveCard,
  onClearAll,
  onEditCard
}: LivePreviewPanelProps) => {
  const { t } = useTranslation('forms');
  const deviceCards = dynamicCards.filter(card => card.type === 'device') as DeviceCard[];
  const serviceCards = dynamicCards.filter(card => card.type === 'service') as ServiceCard[];
  
  // Group services by category
  const servicesByCategory = serviceCards.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, ServiceCard[]>);

  const totalDevices = deviceCards.reduce((sum, card) => sum + card.count, 0);
  const totalServices = serviceCards.reduce((sum, card) => sum + card.count, 0);
  const totalMonthlyFee = dynamicCards.reduce((sum, card) => sum + (card.count * card.monthlyFee), 0);
  const totalYearlyFee = totalMonthlyFee * 12;

  const categoryIcons = {
    software: <Package className="h-4 w-4" />,
    technical: <Wrench className="h-4 w-4" />,
    accessories: <ShoppingCart className="h-4 w-4" />
  };

  if (dynamicCards.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-sm">
          <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">
            {t('deviceSelection.preview.emptyTitle')}
          </h3>
          <p className="text-slate-500 text-sm">
            {t('deviceSelection.preview.emptyDescription')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <PreviewHeader
        totalDevices={totalDevices}
        totalServices={totalServices}
        totalItems={dynamicCards.length}
        totalMonthlyFee={totalMonthlyFee}
        totalYearlyFee={totalYearlyFee}
        onClearAll={onClearAll}
      />

      <div className="flex-1 overflow-y-auto p-4">
        <Accordion type="multiple" defaultValue={["devices", "software", "technical", "accessories"]} className="space-y-4">
          {/* Devices Section */}
          {deviceCards.length > 0 && (
            <AccordionItem value="devices" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <h4 className="font-semibold text-slate-900">{t('deviceSelection.preview.sections.devices')}</h4>
                  <Badge variant="secondary">{deviceCards.length} {t('deviceSelection.preview.types')}</Badge>
                  <Badge variant="outline" className="text-blue-600 border-blue-300 ml-auto">
                    {deviceCards.reduce((sum, card) => sum + (card.count * card.monthlyFee), 0).toFixed(2)} €/mes
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3 mt-4">
                  {deviceCards.map(card => (
                    <PreviewCardItem
                      key={card.id}
                      card={card}
                      onEdit={onEditCard}
                      onRemove={onRemoveCard}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Service Categories */}
          {Object.entries(servicesByCategory).map(([category, services]) => (
            <AccordionItem key={category} value={category} className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  {categoryIcons[category as keyof typeof categoryIcons]}
                  <h4 className="font-semibold text-slate-900">
                    {t(`deviceSelection.preview.categoryNames.${category}`)}
                  </h4>
                  <Badge variant="secondary">{services.length} {t('deviceSelection.preview.types')}</Badge>
                  <Badge variant="outline" className="text-green-600 border-green-300 ml-auto">
                    {services.reduce((sum, card) => sum + (card.count * card.monthlyFee), 0).toFixed(2)} €/mes
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3 mt-4">
                  {services.map(card => (
                    <PreviewCardItem
                      key={card.id}
                      card={card}
                      onEdit={onEditCard}
                      onRemove={onRemoveCard}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default LivePreviewPanel;
