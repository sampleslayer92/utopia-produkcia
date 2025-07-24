
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, Wrench, MapPin } from "lucide-react";
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
  businessLocations?: Array<{ id: string; name: string }>;
}

const LivePreviewPanel = ({ 
  dynamicCards, 
  onUpdateCard, 
  onRemoveCard,
  onClearAll,
  onEditCard,
  businessLocations = []
}: LivePreviewPanelProps) => {
  const { t } = useTranslation('forms');
  
  // Group cards by location
  const cardsByLocation = dynamicCards.reduce((acc, card) => {
    const locationId = card.locationId || 'unassigned';
    if (!acc[locationId]) {
      acc[locationId] = [];
    }
    acc[locationId].push(card);
    return acc;
  }, {} as Record<string, Array<DeviceCard | ServiceCard>>);

  console.log('📊 Live Preview Panel - Cards by location:', {
    totalCards: dynamicCards.length,
    cardsByLocation: Object.keys(cardsByLocation).map(locId => ({
      locationId: locId,
      cardCount: cardsByLocation[locId].length,
      locationName: getLocationName(locId)
    }))
  });

  const getLocationName = (locationId: string) => {
    if (locationId === 'unassigned') return 'Nepriradené k prevádzke';
    const location = businessLocations.find(loc => loc.id === locationId);
    return location?.name || 'Neznáma prevádzka';
  };

  // Group cards within location by type and category
  const getLocationData = (cards: Array<DeviceCard | ServiceCard>) => {
    const devices = cards.filter(card => card.type === 'device') as DeviceCard[];
    const services = cards.filter(card => card.type === 'service') as ServiceCard[];
    
    const servicesByCategory = services.reduce((acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push(service);
      return acc;
    }, {} as Record<string, ServiceCard[]>);

    return { devices, servicesByCategory };
  };

  const totalDevices = dynamicCards.filter(card => card.type === 'device').reduce((sum, card) => sum + card.count, 0);
  const totalServices = dynamicCards.filter(card => card.type === 'service').reduce((sum, card) => sum + card.count, 0);
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
        <Accordion 
          type="multiple" 
          defaultValue={Object.keys(cardsByLocation).map(locationId => `location-${locationId}`)} 
          className="space-y-4"
        >
          {Object.entries(cardsByLocation).map(([locationId, locationCards]) => {
            const { devices, servicesByCategory } = getLocationData(locationCards);
            const locationMonthlyFee = locationCards.reduce((sum, card) => sum + (card.count * card.monthlyFee), 0);
            
            return (
              <AccordionItem key={locationId} value={`location-${locationId}`} className="border rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-slate-900">{getLocationName(locationId)}</h3>
                    <Badge variant="secondary">{locationCards.length} {t('deviceSelection.preview.products')}</Badge>
                    <Badge variant="outline" className="text-primary border-primary/30 ml-auto">
                      {locationMonthlyFee.toFixed(2)} €/mes
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4 mt-4">
                    {/* Devices within location */}
                    {devices.length > 0 && (
                      <div className="border-l-2 border-blue-200 pl-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Package className="h-4 w-4 text-blue-600" />
                          <h4 className="font-medium text-slate-800">{t('deviceSelection.preview.sections.devices')}</h4>
                          <Badge variant="outline" className="text-blue-600 border-blue-300">
                            {devices.reduce((sum, card) => sum + (card.count * card.monthlyFee), 0).toFixed(2)} €/mes
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          {devices.map(card => (
                            <PreviewCardItem
                              key={card.id}
                              card={card}
                              onEdit={onEditCard}
                              onRemove={onRemoveCard}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Services by category within location */}
                    {Object.entries(servicesByCategory).map(([category, services]) => (
                      <div key={category} className="border-l-2 border-green-200 pl-4">
                        <div className="flex items-center gap-2 mb-3">
                          {categoryIcons[category as keyof typeof categoryIcons] || <Package className="h-4 w-4" />}
                          <h4 className="font-medium text-slate-800">
                            {t(`deviceSelection.preview.categoryNames.${category}`)}
                          </h4>
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            {services.reduce((sum, card) => sum + (card.count * card.monthlyFee), 0).toFixed(2)} €/mes
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          {services.map(card => (
                            <PreviewCardItem
                              key={card.id}
                              card={card}
                              onEdit={onEditCard}
                              onRemove={onRemoveCard}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export default LivePreviewPanel;
